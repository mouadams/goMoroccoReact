import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";

// Schema with file upload support - make image optional for updates
const formSchema = z.object({
  nom: z.string().min(3, {
    message: "Le nom doit contenir au moins 3 caractères.",
  }),
  ville: z.string().min(2, {
    message: "La ville doit contenir au moins 2 caractères.",
  }),
  capacite: z.coerce.number().min(1, {
    message: "La capacité doit être un nombre positif.",
  }),
  image: z.instanceof(File).refine(
    (file) => file.size <= 2 * 1024 * 1024, 
    "L'image doit faire moins de 2MB"
  ).refine(
    (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
    "Seuls les fichiers JPEG, PNG et JPG sont acceptés"
  ).optional(),
  description: z.string().min(10, {
    message: "La description doit contenir au moins 10 caractères.",
  }),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  anneeConstruction: z.coerce.number().min(1900).max(new Date().getFullYear()),
});

type StadeFormValues = z.infer<typeof formSchema>;

interface Stade {
  id: number;
  nom: string;
  ville: string;
  capacite: number;
  image?: string;
  description: string;
  lat: number;
  lng: number;
  anneeConstruction: number;
}

interface StadeFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (values: StadeFormValues) => void;
  editingStade?: Stade | null;
  dialogTitle: string;
  submitButtonText: string;
  onSuccess?: () => void;
}

export function StadeFormDialog({
  isOpen,
  onClose,
  onSubmit,
  editingStade,
  dialogTitle,
  submitButtonText,
  onSuccess,
}: StadeFormDialogProps) {
  const form = useForm<StadeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      ville: "",
      capacite: 0,
      image: undefined,
      description: "",
      lat: 31.7917,
      lng: -7.0926,
      anneeConstruction: 2000,
    },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Reset form when editingStade changes or dialog opens
  React.useEffect(() => {
    if (isOpen) {
      if (editingStade) {
        form.reset({
          nom: editingStade.nom || "",
          ville: editingStade.ville || "",
          capacite: editingStade.capacite || 0,
          image: undefined, // Always start with no file selected
          description: editingStade.description || "",
          lat: editingStade.lat || 31.7917,
          lng: editingStade.lng || -7.0926,
          anneeConstruction: editingStade.anneeConstruction || 2000,
        });
      } else {
        // Reset to default values for new stadium
        form.reset({
          nom: "",
          ville: "",
          capacite: 0,
          image: undefined,
          description: "",
          lat: 31.7917,
          lng: -7.0926,
          anneeConstruction: 2000,
        });
      }
    }
  }, [editingStade, isOpen, form]);

  async function handleSubmit(values: StadeFormValues) {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("nom", values.nom);
      formData.append("ville", values.ville);
      formData.append("capacite", values.capacite.toString());
      formData.append("description", values.description);
      formData.append("latitude", values.lat.toString());
      formData.append("longitude", values.lng.toString());
      formData.append("annee_construction", values.anneeConstruction.toString());

      // Only append image if a new one is selected
      if (values.image) {
        formData.append("image", values.image);
      }

      let response;
      
      if (editingStade) {
        // Update existing stadium
        response = await axios.put(`http://127.0.0.1:8000/api/stades/${editingStade.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "application/json",
          },
        });
        toast.success("Stade mis à jour avec succès");
      } else {
        // Create new stadium
        response = await axios.post("http://127.0.0.1:8000/api/stades/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "application/json",
          },
        });
        toast.success("Stade créé avec succès");
      }

      form.reset();
      onClose();
      onSuccess?.();

      if (onSubmit) {
        onSubmit(values);
      }
    } catch (error) {
      console.error("Error saving stade:", error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 422) {
          // Handle validation errors
          const errors = error.response.data.errors;
          Object.entries(errors).forEach(([field, messages]) => {
            form.setError(field as keyof StadeFormValues, {
              type: "manual",
              message: (messages as string[])[0],
            });
          });
          toast.error("Veuillez corriger les erreurs dans le formulaire");
        } else {
          toast.error(error.response?.data?.message || `Erreur lors de ${editingStade ? 'la mise à jour' : 'la création'} du stade`);
        }
      } else {
        toast.error("Une erreur inattendue est survenue");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDelete = async () => {
    if (!editingStade) return;
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce stade ?')) {
      try {
        setIsSubmitting(true);
        const response = await axios.delete(`http://127.0.0.1:8000/api/stades/${editingStade.id}`);
        
        if (response.status === 200 || response.status === 204) {
          toast.success("Stade supprimé avec succès");
          onClose();
          onSuccess?.();
        } else {
          throw new Error('Failed to delete stade');
        }
      } catch (error) {
        console.error('Failed to delete stade:', error);
        toast.error("Erreur lors de la suppression du stade");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="mb-4 text-2xl font-bold text-center">{dialogTitle}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du stade</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du stade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="ville"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville</FormLabel>
                    <FormControl>
                      <Input placeholder="Ville" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capacite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacité</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Capacité" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  {editingStade && (
                    <FormDescription>
                      Laissez vide pour conserver l'image actuelle
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description du stade"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="anneeConstruction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Année de construction</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Année" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.0001" placeholder="Latitude" {...field} />
                    </FormControl>
                    <FormDescription>Entre -90 et 90</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lng"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.0001" placeholder="Longitude" {...field} />
                    </FormControl>
                    <FormDescription>Entre -180 et 180</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex justify-between gap-2 mt-6">
              {editingStade && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={handleDelete}
                  className="w-full"
                  disabled={isSubmitting}
                >
                  Supprimer
                </Button>
              )}
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                className="w-full border border-gray-300"
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Envoi en cours..." : submitButtonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default StadeFormDialog;