import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { API_BASE_URL, API_CONFIG } from "@/config/api";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Hotel } from "@/data/hotels";
import { Building, Star, MapPin, Phone, CircleDollarSign, Home, Map, BadgeCheck, Trash2, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const formSchema = z.object({
  nom: z.string()
    .min(1, { message: "Le nom est requis" })
    .max(255, { message: "Le nom ne doit pas dépasser 255 caractères" }),
  description: z.string()
    .min(1, { message: "La description est requise" }),
  etoiles: z.coerce.number()
    .min(1, { message: "Le nombre d'étoiles doit être entre 1 et 5" })
    .max(5, { message: "Le nombre d'étoiles doit être entre 1 et 5" }),
  image: z.instanceof(File)
    .refine((file) => file.size <= 2 * 1024 * 1024, { message: "L'image ne doit pas dépasser 2MB" })
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(file.type),
      { message: "Format d'image non supporté. Utilisez JPG, PNG ou GIF" }
    )
    .or(z.string()),
  prix: z.string()
    .min(1, { message: "Le prix est requis" })
    .max(100, { message: "Le prix ne doit pas dépasser 100 caractères" }),
  ville: z.string()
    .min(1, { message: "La ville est requise" })
    .max(100, { message: "La ville ne doit pas dépasser 100 caractères" }),
  distance: z.string()
    .min(1, { message: "La distance est requise" })
    .max(100, { message: "La distance ne doit pas dépasser 100 caractères" }),
  adresse: z.string()
    .min(1, { message: "L'adresse est requise" })
    .max(100, { message: "L'adresse ne doit pas dépasser 100 caractères" }),
  phone: z.string()
    .min(1, { message: "Le téléphone est requis" })
    .regex(/^[0-9]{8,15}$/, { message: "Le numéro de téléphone doit contenir entre 8 et 15 chiffres" }),
  wifi: z.boolean().optional().default(false),
  parking: z.boolean().optional().default(false),
  piscine: z.boolean().optional().default(false),
  stadeId: z.coerce.number()
    .min(1, { message: "Le stade associé est requis" }),
});

type FormValues = z.infer<typeof formSchema>;

interface DashboardHotel {
  id: string;
  nom: string;
  description: string;
  etoiles: number;
  image: string | File;
  prix: string;
  ville: string;
  distance: string;
  stadeId: number;
  adresse?: string;
  telephone?: string;
  wifi?: boolean;
  parking?: boolean;
  piscine?: boolean;
}

interface HotelFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingHotel: DashboardHotel | null;
  onHotelUpdated: (data: DashboardHotel | null) => void;
}

export function HotelFormDialog({
  open,
  onOpenChange,
  editingHotel,
  onHotelUpdated
}: HotelFormDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      description: "",
      etoiles: 3,
      image: "",
      prix: "",
      ville: "",
      distance: "",
      stadeId: 1,
      adresse: "",
      phone: "",
      wifi: false,
      parking: false,
      piscine: false,
    },
  });

  useEffect(() => {
    if (editingHotel) {
      form.reset({
        nom: editingHotel.nom || "",
        description: editingHotel.description || "",
        etoiles: editingHotel.etoiles || 3,
        image: editingHotel.image || "",
        prix: editingHotel.prix || "",
        ville: editingHotel.ville || "",
        distance: editingHotel.distance || "",
        stadeId: editingHotel.stadeId || 1,
        adresse: editingHotel.adresse || "",
        phone: editingHotel.telephone || "",
        wifi: editingHotel.wifi || false,
        parking: editingHotel.parking || false,
        piscine: editingHotel.piscine || false,
      });
    } else {
      form.reset({
        nom: "",
        description: "",
        etoiles: 3,
        image: "",
        prix: "",
        ville: "",
        distance: "",
        stadeId: 1,
        adresse: "",
        phone: "",
        wifi: false,
        parking: false,
        piscine: false,
      });
    }
  }, [editingHotel, form]);

  const handleSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      const formData = new FormData();
      formData.append('nom', data.nom.trim());
      formData.append('description', data.description.trim());
      formData.append('etoiles', data.etoiles.toString());
      formData.append('prix', data.prix.trim());
      formData.append('ville', data.ville.trim());
      formData.append('distance', data.distance.trim());
      formData.append('adresse', data.adresse.trim());
      formData.append('phone', data.phone.trim());
      formData.append('stadeId', data.stadeId.toString());
      
      formData.append('wifi', data.wifi ? '1' : '0');
      formData.append('parking', data.parking ? '1' : '0');
      formData.append('piscine', data.piscine ? '1' : '0');

      if (data.image instanceof File) {
        formData.append('image', data.image);
      } else if (!editingHotel) {
        throw new Error("L'image est requise pour créer un nouvel hôtel");
      }

      const apiUrl = `${API_BASE_URL}/api/hotels`;
      let response;

      if (editingHotel) {
        response = await axios.post(
          `${apiUrl}/${editingHotel.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "Accept": "application/json"
            }
          }
        );
      } else {
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

      if (response.data.data) {
        const hotelData: DashboardHotel = {
          ...response.data.data,
          stadeId: Number(response.data.data.stadeId),
          wifi: Boolean(response.data.data.wifi),
          parking: Boolean(response.data.data.parking),
          piscine: Boolean(response.data.data.piscine),
        };
        onHotelUpdated(hotelData);
      }
      
      form.reset();
      onOpenChange(false);
      
      toast({
        title: editingHotel ? "Hôtel modifié" : "Hôtel ajouté",
        description: editingHotel 
          ? `L'hôtel ${data.nom} a été modifié avec succès.`
          : `L'hôtel ${data.nom} a été ajouté avec succès.`,
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
    if (!editingHotel?.id) return;
    
    try {
      setIsDeleting(true);
      
      // Call the update handler with null to indicate deletion
      onHotelUpdated(null);
      
      // Close dialogs
      setDeleteDialogOpen(false);
      onOpenChange(false);
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReset = () => {
    form.reset();
    toast({
      title: "Formulaire réinitialisé",
      description: "Toutes les valeurs ont été réinitialisées.",
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 border-none shadow-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-3">
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-blue-600">
              <Building className="w-6 h-6" />
              {editingHotel ? "Modifier un hôtel" : "Ajouter un nouvel hôtel"}
            </DialogTitle>
            <DialogDescription className="text-base">
              {editingHotel 
                ? "Modifiez les informations de l'hôtel existant."
                : "Remplissez le formulaire pour ajouter un nouvel hôtel partenaire."}
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
                      <FormLabel className="flex items-center gap-2 text-blue-600">
                        <Building className="w-4 h-4" />
                        Nom de l'hôtel
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Four Seasons" 
                          {...field} 
                          className="border-blue-500/30 focus-visible:ring-blue-500/50"
                        />
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
                        <FormLabel className="flex items-center gap-2 text-purple-600">
                          <Map className="w-4 h-4" />
                          Ville
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Casablanca" 
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
                    name="etoiles"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-yellow-600">
                          <Star className="w-4 h-4" />
                          Nombre d'étoiles (1-5)
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max="5" 
                            {...field} 
                            className="border-yellow-500/30 focus-visible:ring-yellow-500/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="prix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-green-600">
                          <CircleDollarSign className="w-4 h-4" />
                          Prix par nuit
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="1500 DH" 
                            {...field} 
                            className="border-green-500/30 focus-visible:ring-green-500/50"
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
                        <FormLabel className="flex items-center gap-2 text-red-500">
                          <MapPin className="w-4 h-4" />
                          Distance du stade
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="2.5 km" 
                            {...field} 
                            className="border-red-500/30 focus-visible:ring-red-500/50"
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
                        <FormLabel className="flex items-center gap-2 text-orange-500">
                          <Home className="w-4 h-4" />
                          ID du stade associé
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="stade-marrakech" 
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
                    name="adresse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-teal-600">
                          <MapPin className="w-4 h-4" />
                          Adresse
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="123 Avenue Mohammed V" 
                            {...field} 
                            className="border-teal-500/30 focus-visible:ring-teal-500/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
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
                </div>
                
                <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="wifi"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md shadow-sm">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>WiFi</FormLabel>
                          <FormDescription className="text-xs">
                            WiFi gratuit disponible
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="parking"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md shadow-sm">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Parking</FormLabel>
                          <FormDescription className="text-xs">
                            Parking gratuit disponible
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="piscine"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md shadow-sm">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Piscine</FormLabel>
                          <FormDescription className="text-xs">
                            Piscine disponible
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
                      <FormLabel className="flex items-center gap-2 text-blue-600">
                        Image de l'hôtel
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              onChange(file);
                            }
                          }}
                          {...field}
                          className="border-blue-500/30 focus-visible:ring-blue-500/50"
                        />
                      </FormControl>
                      {value && (
                        <div className="mt-2">
                          <p className="mb-1 text-sm text-gray-500">Image sélectionnée:</p>
                          {typeof value === 'string' ? (
                            <img src={value} alt="Preview" className="max-w-[200px] h-auto rounded-md" />
                          ) : (
                            <p className="text-sm text-gray-500">{value.name}</p>
                          )}
                        </div>
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
                      <FormLabel className="flex items-center gap-2 text-blue-600">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Décrivez l'hôtel, ses commodités et services..." 
                          className="min-h-[120px] border-blue-500/30 focus-visible:ring-blue-500/50 resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter className="flex flex-col gap-3 pt-4 mt-6 border-t border-gray-100 sm:flex-row sm:justify-between dark:border-gray-800">
                {editingHotel && (
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={() => setDeleteDialogOpen(true)}
                    className="flex items-center w-full gap-2 sm:w-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </Button>
                )}
                <div className="flex flex-col w-full gap-3 sm:flex-row sm:w-auto">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleReset} 
                    className="w-full border-2 border-gray-300 sm:w-auto hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                    disabled={isSubmitting}
                  >
                    Réinitialiser
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex items-center w-full gap-2 transition-all duration-300 shadow-md sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingHotel ? "Mettre à jour" : "Confirmer"}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet hôtel ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement l'hôtel "{editingHotel?.nom}" et toutes ses données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="flex items-center gap-2 text-white bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}