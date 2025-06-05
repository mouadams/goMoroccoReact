import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
// import { API_BASE_URL, API_CONFIG } from "@/config/api"; // These are not used in the provided snippet
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
// import { Hotel } from "@/data/hotels"; // This Hotel interface seems to be from data/hotels, not directly used in logic, but DashboardHotel is.
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

interface DashboardHotel {
  id: string;
  nom: string;
  description: string;
  etoiles: number;
  image: string; // Ensure this is string as it's a URL from backend
  prix: string;
  ville: string;
  distance: string;
  stadeId: number;
  adresse?: string;
  phone?: string;
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

  const formSchema = z.object({
    nom: z.string()
      .min(1, { message: "Le nom est requis" })
      .max(255, { message: "Le nom ne doit pas dépasser 255 caractères" }),
    description: z.string()
      .min(1, { message: "La description est requise" }),
    etoiles: z.coerce.number()
      .min(1, { message: "Le nombre d'étoiles doit être entre 1 et 5" })
      .max(5, { message: "Le nombre d'étoiles doit être entre 1 et 5" }),

    // FIX FOR IMAGE FIELD (REQUIRED FOR CREATE, OPTIONAL/IGNORED FOR UPDATE IF NO NEW FILE)
    image: z.union([
      z.instanceof(File)
        .refine((file) => file.size <= 2 * 1024 * 1024, { message: "L'image ne doit pas dépasser 2MB" })
        .refine(
          (file) => ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(file.type),
          { message: "Format d'image non supporté. Utilisez JPG, PNG ou GIF" }
        ),
      z.string().nullable().optional() // Allow string type (for URL) or null/undefined
    ]).superRefine((val, ctx) => {
      // If we are creating a new hotel (editingHotel is null)
      // AND no file has been provided (val is not a File instance AND it's not a non-empty string)
      if (!editingHotel && !(val instanceof File) && (typeof val !== 'string' || val === '')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "L'image est requise pour un nouvel hôtel",
          path: ['image'], // Point the error to the 'image' field
        });
      }
      // For updates, if a string (URL) is present and no new file, it's valid.
      // If a new file is uploaded, it will be a File instance and pass.
    }),
    // *********************************************************

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
      .regex(/^[0-9]{8,15}$/, { message: "Le numéro de téléphone doit contenir entre 8 et 15 chiffres" })
      .transform(val => val.replace(/\D/g, '').slice(0, 15)),
    wifi: z.boolean().optional().default(false),
    parking: z.boolean().optional().default(false),
    piscine: z.boolean().optional().default(false),
    stadeId: z.coerce.number()
      .min(1, { message: "Le stade associé est requis" }),
  });

  type FormValues = z.infer<typeof formSchema>;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      description: "",
      etoiles: 3,
      image: "", // Keep default as ""
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
        image: editingHotel.image || "", // Keep as string for existing hotels (URL)
        prix: editingHotel.prix || "",
        ville: editingHotel.ville || "",
        distance: editingHotel.distance || "",
        stadeId: editingHotel.stadeId || 1,
        adresse: editingHotel.adresse || "",
        phone: editingHotel.phone || "",
        wifi: editingHotel.wifi || false,
        parking: editingHotel.parking || false,
        piscine: editingHotel.piscine || false,
      });
    } else {
      // For creation, reset to empty/default values
      form.reset({
        nom: "",
        description: "",
        etoiles: 3,
        image: "", // This will now trigger the Zod validation if left empty for creation
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
        console.log('Submitting form data:', data);
        
    try {
      setIsSubmitting(true);
          const formData = new FormData();
      
          // Always include all fields for updates
          formData.append('nom', data.nom.trim());
          formData.append('description', data.description.trim());
      formData.append('etoiles', data.etoiles.toString());
          formData.append('prix', data.prix.trim());
          formData.append('ville', data.ville.trim());
          formData.append('distance', data.distance.trim());
          formData.append('adresse', data.adresse.trim());
          formData.append('phone', data.phone);
          formData.append('stadeId', data.stadeId.toString());
      formData.append('wifi', data.wifi ? '1' : '0');
      formData.append('parking', data.parking ? '1' : '0');
      formData.append('piscine', data.piscine ? '1' : '0');

          // Handle image - only append if it's a new file
      if (data.image instanceof File) {
        formData.append('image', data.image);
      }
      
          const apiUrl = 'http://127.0.0.1:8000/api/hotels';
          let response;
      
      if (editingHotel) {
            // For updates, use POST with _method=PUT
            formData.append('_method', 'PUT');
            console.log('Update request data:', Object.fromEntries(formData.entries()));
            
            response = await axios.post(`${apiUrl}/${editingHotel.id}`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json'
              }
            });
          } else {
           
                // For new hotels, use regular POST
                // For new hotels, we need all required fields
                formData.append('nom', data.nom.trim());
                formData.append('description', data.description.trim());
                formData.append('etoiles', data.etoiles.toString());
                formData.append('prix', data.prix.trim());
                formData.append('ville', data.ville.trim());
                formData.append('distance', data.distance.trim());
                formData.append('adresse', data.adresse.trim());
                formData.append('phone', data.phone);
                formData.append('stadeId', data.stadeId.toString());
                
                // Handle boolean fields
                formData.append('wifi', data.wifi ? '1' : '0');
                formData.append('parking', data.parking ? '1' : '0');
                formData.append('piscine', data.piscine ? '1' : '0');
    
                // Image is required for new hotels
                if (data.image instanceof File) {
                  formData.append('image', data.image);
                } else {
                  toast({
                    title: "Erreur",
                    description: "Veuillez sélectionner une image valide",
                    variant: "destructive",
                  });
                  return;
                }
    
                console.log('Create request data:', Object.fromEntries(formData.entries()));
                
                try {
                  response = await axios.post(apiUrl, formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                      'Accept': 'application/json',
                      'X-Requested-With': 'XMLHttpRequest'
                    }
                  });
                  console.log('Create response:', response.data);
                } catch (error) {
                  if (axios.isAxiosError(error)) {
                    console.error('Create error details:', {
                      status: error.response?.status,
                      data: error.response?.data,
                      config: error.config
                    });
                  }
                  throw error;
                }
        }
  
      // Handle successful response
      if (response.data) {
        const hotelData = {
          ...response.data.data || response.data.hotel,
          id: response.data.data?.id || response.data.hotel?.id || editingHotel?.id || '',
          stadeId: Number(response.data.data?.stadeId || response.data.hotel?.stadeId || data.stadeId),
          wifi: Boolean(response.data.data?.wifi || response.data.hotel?.wifi || data.wifi),
          parking: Boolean(response.data.data?.parking || response.data.hotel?.parking || data.parking),
          piscine: Boolean(response.data.data?.piscine || response.data.hotel?.piscine || data.piscine),
        };
        
        onHotelUpdated(hotelData);
      toast({
        title: editingHotel ? "Hôtel modifié" : "Hôtel ajouté",
        description: editingHotel 
          ? `L'hôtel ${data.nom} a été modifié avec succès.`
          : `L'hôtel ${data.nom} a été ajouté avec succès.`,
      });
        form.reset();
        onOpenChange(false);
      }
  
    } catch (error) {
      console.error('Form submission error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error details:', {
          status: error.response?.status,
          data: error.response?.data,
          config: error.config
        });
        
        if (error.response?.status === 422) {
          // Handle validation errors
          const errors = error.response.data.errors;
          Object.entries(errors).forEach(([field, messages]) => {
            form.setError(field as keyof FormValues, {
              type: "manual",
              message: Array.isArray(messages) ? messages[0] : messages as string,
            });
          });
        }
      }
      
      toast({
        title: "Erreur",
        description: axios.isAxiosError(error) 
          ? error.response?.data?.message || "Erreur lors de la communication avec le serveur"
          : "Une erreur s'est produite",
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
      
      await axios.delete(`http://127.0.0.1:8000/api/hotels/${editingHotel.id}`);
      onHotelUpdated(null); // Signal parent to remove the deleted hotel

      // Close dialogs
      setDeleteDialogOpen(false);
      onOpenChange(false);
      
      toast({
        title: "Hôtel supprimé",
        description: `L'hôtel "${editingHotel.nom}" a été supprimé avec succès.`,
      });

    } catch (error) {
      console.error('Error deleting hotel:', error);
      let errorMessage = "Une erreur s'est produite lors de la suppression.";
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
        phone: editingHotel.phone || "",
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
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                console.log('Form submit event triggered');
                
                try {
                  const formValues = form.getValues();
                  console.log('Form values:', formValues);
                  
                  const formData = new FormData();
                  
                  // Basic fields
                  formData.append('nom', formValues.nom);
                  formData.append('description', formValues.description);
                  formData.append('etoiles', formValues.etoiles.toString());
                  formData.append('prix', formValues.prix);
                  formData.append('ville', formValues.ville);
                  formData.append('distance', formValues.distance);
                  formData.append('adresse', formValues.adresse);
                  // Ensure phone is a string and properly formatted
                  formData.append('phone', formValues.phone);
                  formData.append('stadeId', formValues.stadeId.toString());
                  
                  // Boolean fields
                  formData.append('wifi', formValues.wifi ? '1' : '0');
                  formData.append('parking', formValues.parking ? '1' : '0');
                  formData.append('piscine', formValues.piscine ? '1' : '0');

                  // Image handling
                  if (formValues.image instanceof File) {
                    formData.append('image', formValues.image);
                  }

                  const apiUrl = 'http://127.0.0.1:8000/api/hotels';
                  let response;

                  if (editingHotel) {
                    // For updates
                    formData.append('_method', 'PUT');
                    response = await axios.post(`${apiUrl}/${editingHotel.id}`, formData);
                  } else {
                    // For new hotels, use regular POST
                    // For new hotels, we need all required fields
                    formData.append('nom', formValues.nom.trim());
                    formData.append('description', formValues.description.trim());
                    formData.append('etoiles', formValues.etoiles.toString());
                    formData.append('prix', formValues.prix.trim());
                    formData.append('ville', formValues.ville.trim());
                    formData.append('distance', formValues.distance.trim());
                    formData.append('adresse', formValues.adresse.trim());
                    formData.append('phone', formValues.phone);
                    formData.append('stadeId', formValues.stadeId.toString());
                    
                    // Handle boolean fields
                    formData.append('wifi', formValues.wifi ? '1' : '0');
                    formData.append('parking', formValues.parking ? '1' : '0');
                    formData.append('piscine', formValues.piscine ? '1' : '0');

                    // Image is required for new hotels
                    if (formValues.image instanceof File) {
                      formData.append('image', formValues.image);
                    }

                    console.log('Create request data:', Object.fromEntries(formData.entries()));
                    
                    try {
                      response = await axios.post(apiUrl, formData, {
                        headers: {
                          'Content-Type': 'multipart/form-data',
                          'Accept': 'application/json',
                          'X-Requested-With': 'XMLHttpRequest'
                        }
                      });
                      console.log('Create response:', response.data);
                    } catch (error) {
                      if (axios.isAxiosError(error)) {
                        console.error('Create error details:', {
                          status: error.response?.status,
                          data: error.response?.data,
                          config: error.config
                        });
                      }
                      throw error;
                    }
                  }

                  // Handle successful response
                  if (response.data) {
                    const hotelData = {
                      ...response.data.data || response.data.hotel,
                      id: response.data.data?.id || response.data.hotel?.id || editingHotel?.id || '',
                      stadeId: Number(response.data.data?.stadeId || response.data.hotel?.stadeId || formValues.stadeId),
                      wifi: Boolean(response.data.data?.wifi || response.data.hotel?.wifi || formValues.wifi),
                      parking: Boolean(response.data.data?.parking || response.data.hotel?.parking || formValues.parking),
                      piscine: Boolean(response.data.data?.piscine || response.data.hotel?.piscine || formValues.piscine),
                    };

                    onHotelUpdated(hotelData);
                    toast({
                      title: editingHotel ? "Hôtel modifié" : "Hôtel ajouté",
                      description: editingHotel
                        ? `L'hôtel ${formValues.nom} a été modifié avec succès.`
                        : `L'hôtel ${formValues.nom} a été ajouté avec succès.`,
                    });

                    form.reset();
                    onOpenChange(false);
                  }
                } catch (error) {
                  console.error('Form submission error:', error);
                  toast({
                    title: "Erreur",
                    description: "Une erreur s'est produite lors de la soumission du formulaire.",
                    variant: "destructive",
                  });
                }
              }}
              className="space-y-6"
            >
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
                            placeholder="1"
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
                            } else {
                              // If file input is cleared, set value to an empty string.
                              // For an existing hotel, this means no new image will be sent.
                              onChange("");
                            }
                          }}
                          // Ensure value prop is not passed for file inputs to allow re-selection
                          // Remove the `value` prop from here to ensure the file input is "uncontrolled"
                          // when a new file is not selected, but still allow React Hook Form to manage it.
                          {...field}
                        />
                      </FormControl>
                      {/* Display existing image or file name preview */}
                      {value && (
                        <div className="mt-2">
                          <p className="mb-1 text-sm text-gray-500">Image sélectionnée:</p>
                          {typeof value === 'string' && value !== '' ? (
                            <img src={value} alt="Preview" className="max-w-[200px] h-auto rounded-md" />
                          ) : (
                            value instanceof File && <p className="text-sm text-gray-500">{value.name}</p>
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