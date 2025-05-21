
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { stades } from "@/data/stades";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Le nom doit contenir au moins 3 caractères.",
  }),
  description: z.string().min(10, {
    message: "La description doit contenir au moins 10 caractères.",
  }),
  image: z.string().url({
    message: "Veuillez entrer une URL d'image valide.",
  }),
  stadeId: z.string({
    required_error: "Veuillez sélectionner un stade.",
  }),
  category: z.enum(["culture", "sport", "nature", "divertissement"], {
    required_error: "Veuillez sélectionner une catégorie.",
  }),
  price: z.string().min(1, {
    message: "Veuillez entrer un prix.",
  }),
  address: z.string().min(5, {
    message: "L'adresse doit contenir au moins 5 caractères.",
  }),
  rating: z.coerce.number().min(1).max(5),
  website: z.string().url().optional(),
});

type ActivityFormValues = z.infer<typeof formSchema>;

interface ActivityFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ActivityFormValues) => void;
  defaultValues?: ActivityFormValues;
  dialogTitle: string;
  submitButtonText: string;
}

export function ActivityFormDialog({
  isOpen,
  onClose,
  onSubmit,
  defaultValues = {
    name: "",
    description: "",
    image: "",
    stadeId: "",
    category: "culture",
    price: "",
    address: "",
    rating: 4,
    website: "",
  },
  dialogTitle,
  submitButtonText,
}: ActivityFormDialogProps) {
  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  function handleSubmit(values: ActivityFormValues) {
    onSubmit(values);
    form.reset();
    toast.success("Activité sauvegardée avec succès");
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">{dialogTitle}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de l'activité" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="culture">Culture</SelectItem>
                          <SelectItem value="sport">Sport</SelectItem>
                          <SelectItem value="nature">Nature</SelectItem>
                          <SelectItem value="divertissement">Divertissement</SelectItem>
                        </SelectContent>
                      </Select>
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
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="URL de l'image" {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description de l'activité"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stadeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stade</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un stade" />
                        </SelectTrigger>
                        <SelectContent>
                          {stades.map((stade) => (
                            <SelectItem key={stade.id} value={stade.id}>
                              {stade.nom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix</FormLabel>
                    <FormControl>
                      <Input placeholder="Prix (ex: Gratuit, 20 MAD)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input placeholder="Adresse de l'activité" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note (de 1 à 5)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="5"
                        step="0.1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site web (optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="URL du site web" {...field} />
                    </FormControl>
                    <FormDescription>Laissez vide si non applicable</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-6 flex justify-between gap-2">
              <Button type="button" variant="outline" onClick={onClose} className="border border-gray-300 w-full">
                Annuler
              </Button>
              <Button type="submit" className="w-full">
                {submitButtonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default ActivityFormDialog;
