import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Restaurant } from "@/data/restaurants";
import { Utensils, Phone, Clock, MapPin, Star, Tag, Home } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  nom: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  description: z.string().min(10, { message: "La description doit contenir au moins 10 caractères" }),
  cuisine: z.string().min(2, { message: "Le type de cuisine est requis" }),
  prixMoyen: z.string().min(1, { message: "Le prix moyen est requis" }).transform((val) => {
    const num = parseFloat(val);
    if (isNaN(num)) throw new Error("Le prix doit être un nombre valide");
    return val;
  }),
  adresse: z.string().min(5, { message: "L'adresse est requise" }),
  distance: z.string().min(1, { message: "La distance est requise" }).transform((val) => {
    const num = parseFloat(val);
    if (isNaN(num)) throw new Error("La distance doit être un nombre valide");
    return val;
  }),
  note: z.coerce.number().min(1).max(5, { message: "La note doit être entre 1 et 5" }),
  image: z.instanceof(FileList).optional().or(z.string().optional()),
  stadeId: z.coerce.number().min(1, { message: "Le stade associé est requis" }),
  horaires: z.string().optional(),
  telephone: z.string().optional(),
  vegOptions: z.boolean().optional().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface RestaurantFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: Restaurant) => void;
  editingRestaurant?: Restaurant | null;
  onSuccess?: () => void;
  onDelete?: (id: number) => void;
}

export default function RestaurantFormDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  editingRestaurant,
  onSuccess,
  onDelete
}: RestaurantFormDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      description: "",
      cuisine: "",
      prixMoyen: "",
      adresse: "",
      distance: "",
      note: 4,
      image: undefined,
      stadeId: 0,
      horaires: "",
      telephone: "",
      vegOptions: false,
    },
  });

  useEffect(() => {
    if (editingRestaurant) {
      form.reset({
        nom: editingRestaurant.nom || "",
        description: editingRestaurant.description || "",
        cuisine: editingRestaurant.cuisine || "",
        prixMoyen: editingRestaurant.prixMoyen?.toString() || "",
        adresse: editingRestaurant.adresse || "",
        distance: editingRestaurant.distance?.toString() || "",
        note: editingRestaurant.note || 4,
        stadeId: Number(editingRestaurant.stadeId) || 0,
        horaires: editingRestaurant.horaires || "",
        telephone: editingRestaurant.telephone || "",
        vegOptions: editingRestaurant.vegOptions || false,
      });
      
      // Show existing image if available
      if (editingRestaurant.image) {
        setImagePreview(editingRestaurant.image.startsWith('http') 
          ? editingRestaurant.image 
          : `http://127.0.0.1:8000/storage/${editingRestaurant.image}`);
      }
    } else {
      form.reset({
        nom: "",
        description: "",
        cuisine: "",
        prixMoyen: "",
        adresse: "",
        distance: "",
        note: 4,
        image: undefined,
        stadeId: 0,
        horaires: "",
        telephone: "",
        vegOptions: false,
      });
      setImagePreview(null);
    }
  }, [editingRestaurant, form]);

  // Handle image preview when a new file is selected
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Validate numeric fields
      const prix = parseFloat(data.prixMoyen);
      const dist = parseFloat(data.distance);
      
      if (isNaN(prix) || prix <= 0) {
        form.setError('prixMoyen', { message: "Le prix moyen doit être un nombre positif" });
        throw new Error("Le prix moyen doit être un nombre positif");
      }
      
      if (isNaN(dist) || dist <= 0) {
        form.setError('distance', { message: "La distance doit être un nombre positif" });
        throw new Error("La distance doit être un nombre positif");
      }

      const apiUrl = "http://127.0.0.1:8000/api/restaurants";
      
      const formData = new FormData();
      formData.append('nom', data.nom.trim());
      formData.append('description', data.description.trim());
      formData.append('cuisine', data.cuisine.trim());
      formData.append('prixMoyen', prix.toString());
      formData.append('adresse', data.adresse.trim());
      formData.append('distance', dist.toString());
      formData.append('note', Math.round(data.note).toString());
      formData.append('stadeId', data.stadeId.toString());
      
      // Optional fields
      if (data.horaires?.trim()) formData.append('horaires', data.horaires.trim());
      if (data.telephone?.trim()) formData.append('telephone', data.telephone.trim());
      formData.append('vegOptions', data.vegOptions ? '1' : '0');
      
      // Handle image upload
      if (data.image instanceof FileList && data.image.length > 0) {
        const file = data.image[0];
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error("L'image ne doit pas dépasser 5MB");
        }
        // Validate file type
        if (!['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(file.type)) {
          throw new Error("Format d'image non supporté. Utilisez JPG, PNG ou GIF");
        }
        formData.append('image', file);
      }
      
      let response;
      
      if (editingRestaurant) {
        response = await axios.put(
          `${apiUrl}/${editingRestaurant.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "Accept": "application/json"
            }
          }
        );
      } else {
        if (!(data.image instanceof FileList) || data.image.length === 0) {
          throw new Error("L'image est requise pour créer un nouveau restaurant");
        }
        
        response = await axios.post(
          apiUrl,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "Accept": "application/json"
            }
          }
        );
      }

      if (onSubmit && response.data.data) {
        onSubmit(response.data.data);
      }

      form.reset();
      onOpenChange(false);
      onSuccess?.();
      
      toast({
        title: editingRestaurant ? "Restaurant modifié" : "Restaurant ajouté",
        description: editingRestaurant 
          ? `Le restaurant ${data.nom} a été modifié avec succès.`
          : `Le restaurant ${data.nom} a été ajouté avec succès.`,
      });
    } catch (error) {
      console.error('Error:', error);
      
      let errorMessage = "Une erreur s'est produite";
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 422) {
          // Handle validation errors from server
          const errors = error.response.data.errors;
          if (errors) {
            Object.entries(errors).forEach(([field, messages]) => {
              form.setError(field as keyof FormValues, {
                type: "manual",
                message: Array.isArray(messages) ? messages[0] : messages as string,
              });
            });
          }
          errorMessage = "Veuillez corriger les erreurs dans le formulaire";
        } else {
          errorMessage = error.response?.data?.message || "Erreur lors de la communication avec le serveur";
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!editingRestaurant || !editingRestaurant.id) return;
    
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le restaurant ${editingRestaurant.nom}?`)) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      const apiUrl = `http://127.0.0.1:8000/api/restaurants/${editingRestaurant.id}`;
      await axios.delete(apiUrl, {
        headers: {
          "Accept": "application/json"
        }
      });
      
      onOpenChange(false);
      onDelete?.(editingRestaurant.id);
      onSuccess?.();
      
      toast({
        title: "Restaurant supprimé",
        description: `Le restaurant ${editingRestaurant.nom} a été supprimé avec succès.`,
      });
    } catch (error) {
      console.error('Error:', error);
      
      let errorMessage = "Une erreur s'est produite lors de la suppression";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReset = () => {
    if (editingRestaurant) {
      form.reset({
        nom: editingRestaurant.nom || "",
        description: editingRestaurant.description || "",
        cuisine: editingRestaurant.cuisine || "",
        prixMoyen: editingRestaurant.prixMoyen?.toString() || "",
        adresse: editingRestaurant.adresse || "",
        distance: editingRestaurant.distance?.toString() || "",
        note: editingRestaurant.note || 4,
        image: undefined,
        stadeId: Number(editingRestaurant.stadeId) || 0,
        horaires: editingRestaurant.horaires || "",
        telephone: editingRestaurant.telephone || "",
        vegOptions: editingRestaurant.vegOptions || false,
      });
    } else {
      form.reset();
    }
    
    toast({
      title: "Formulaire réinitialisé",
      description: "Toutes les valeurs ont été réinitialisées.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-none shadow-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-caf-green">
            <Utensils className="w-6 h-6" />
            {editingRestaurant ? "Modifier un restaurant" : "Ajouter un nouveau restaurant"}
          </DialogTitle>
          <DialogDescription className="text-base">
            {editingRestaurant 
              ? "Modifiez les informations du restaurant existant."
              : "Remplissez le formulaire pour ajouter un nouveau restaurant partenaire."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-caf-green">
                      <Utensils className="w-4 h-4" />
                      Nom du restaurant
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="La Table Marocaine" 
                        {...field} 
                        className="border-caf-green/30 focus-visible:ring-caf-green/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="cuisine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-caf-red">
                        <Tag className="w-4 h-4" />
                        Type de cuisine
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Marocaine traditionnelle" 
                          {...field} 
                          className="border-caf-red/30 focus-visible:ring-caf-red/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-yellow-600">
                        <Star className="w-4 h-4" />
                        Note (1-5)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          max="5" 
                          {...field} 
                          className="border-yellow-600/30 focus-visible:ring-yellow-600/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="prixMoyen"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-caf-gold">
                        <Tag className="w-4 h-4" />
                        Prix moyen
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="200 DH" 
                          {...field} 
                          className="border-caf-gold/30 focus-visible:ring-caf-gold/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="distance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-blue-500">
                        <MapPin className="w-4 h-4" />
                        Distance du stade
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="1.5 km" 
                          {...field} 
                          className="border-blue-500/30 focus-visible:ring-blue-500/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="stadeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-purple-500">
                        <Home className="w-4 h-4" />
                        ID du stade associé
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="1" 
                          type="number"
                          {...field} 
                          className="border-purple-500/30 focus-visible:ring-purple-500/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="adresse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-emerald-600">
                        <MapPin className="w-4 h-4" />
                        Adresse
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="45 Avenue Mohammed V, Marrakech" 
                          {...field} 
                          className="border-emerald-600/30 focus-visible:ring-emerald-600/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="telephone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-indigo-500">
                        <Phone className="w-4 h-4" />
                        Téléphone
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="+212 522 123 456" 
                          {...field} 
                          className="border-indigo-500/30 focus-visible:ring-indigo-500/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="horaires"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-orange-500">
                        <Clock className="w-4 h-4" />
                        Horaires
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="12h-23h tous les jours" 
                          {...field} 
                          className="border-orange-500/30 focus-visible:ring-orange-500/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="vegOptions"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md shadow-sm">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Options végétariennes</FormLabel>
                        <FormDescription>
                          Cochez si le restaurant propose des options végétariennes.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="image"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-caf-red">
                      Image du restaurant
                      {!editingRestaurant && <span className="text-xs text-red-500">(obligatoire pour les nouveaux restaurants)</span>}
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Input 
                          type="file" 
                          accept="image/jpeg,image/png,image/jpg,image/gif"
                          onChange={(e) => {
                            onChange(e.target.files);
                            handleImageChange(e);
                          }}
                          {...field} 
                          className="border-caf-red/30 focus-visible:ring-caf-red/50"
                        />
                        {imagePreview && (
                          <div className="mt-2">
                            <p className="mb-1 text-sm text-gray-500">Aperçu:</p>
                            <img 
                              src={imagePreview} 
                              alt="Aperçu" 
                              className="w-full h-auto max-w-xs border border-gray-200 rounded-md" 
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-caf-green">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Décrivez le restaurant, son ambiance et sa spécialité..." 
                        className="min-h-[120px] border-caf-green/30 focus-visible:ring-caf-green/50 resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter className="flex flex-col gap-3 pt-4 mt-6 border-t border-gray-100 sm:flex-row sm:justify-between dark:border-gray-800">
              {editingRestaurant && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={handleDelete} 
                  className="w-full sm:w-auto"
                  disabled={isSubmitting || isDeleting}
                >
                  {isDeleting ? "Suppression..." : "Supprimer"}
                </Button>
              )}
              <div className="flex flex-col w-full gap-3 sm:flex-row sm:w-auto">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleReset} 
                  className="w-full border-2 border-gray-300 sm:w-auto hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                  disabled={isSubmitting || isDeleting}
                >
                  Réinitialiser
                </Button>
                <Button 
                  type="submit" 
                  className="w-full transition-all duration-300 shadow-md sm:w-auto bg-gradient-to-r from-caf-green to-emerald-600 hover:from-emerald-600 hover:to-caf-green"
                  disabled={isSubmitting || isDeleting}
                >
                  {isSubmitting ? (
                    "Envoi en cours..."
                  ) : editingRestaurant ? (
                    "Mettre à jour"
                  ) : (
                    "Confirmer"
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

