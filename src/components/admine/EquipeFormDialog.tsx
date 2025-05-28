import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Equipe } from "@/data/equipes";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { fetchEquipes } from "@/features/apiSlice";
import { AppDispatch } from "@/store";

const formSchema = z.object({
  nom: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  drapeau: z.string().url({
    message: "Veuillez entrer une URL valide pour le drapeau.",
  }),
  groupe: z.string().min(1, {
    message: "Veuillez sélectionner un groupe.",
  }),
  confederation: z.string().min(2, {
    message: "Veuillez entrer la confédération.",
  }),
  abreviation: z.string().max(3, {
    message: "L'abréviation ne doit pas dépasser 3 caractères.",
  }).optional(),
  entraineur: z.string().optional(),
  rang: z.coerce.number().int().positive().optional(),
});

type EquipeFormValues = z.infer<typeof formSchema>;

interface EquipeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: EquipeFormValues) => void;
  editingEquipe?: Equipe | null;
  dialogTitle: string;
  submitButtonText: string;
}

export function EquipeFormDialog({
  open,
  onOpenChange,
  onSubmit,
  editingEquipe,
  dialogTitle,
  submitButtonText
}: EquipeFormDialogProps) {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const form = useForm<EquipeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: editingEquipe?.nom || "",
      drapeau: editingEquipe?.drapeau || "",
      groupe: editingEquipe?.groupe || "A",
      confederation: editingEquipe?.confederation || "CAF",
      abreviation: editingEquipe?.abreviation || "",
      entraineur: editingEquipe?.entraineur || "",
      rang: editingEquipe?.rang || undefined
    }
  });

  async function handleSubmit(values: EquipeFormValues) {
    try {
      const equipeData = {
        nom: values.nom,
        drapeau: values.drapeau,
        groupe: values.groupe,
        confederation: values.confederation,
        abreviation: values.abreviation || "",
        entraineur: values.entraineur || "",
        rang: values.rang || 0,
        points: 0,
        joues: 0,
        gagnes: 0,
        nuls: 0,
        perdus: 0,
        buts_marques: 0,
        buts_encaisses: 0,
        difference_buts: 0
      };

      if (editingEquipe) {
        const response = await fetch(`http://127.0.0.1:8000/api/equipes/${editingEquipe.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(equipeData),
        });

        if (response.status === 200 || response.status === 204) {
          toast({
            title: "Équipe mise à jour",
            description: "L'équipe a été mise à jour avec succès.",
          });
        } else {
          throw new Error('Failed to update equipe');
        }
      } else {
        const response = await fetch('http://127.0.0.1:8000/api/equipes/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(equipeData),
        });

        if (response.status === 200 || response.status === 201) {
          toast({
            title: "Équipe créée",
            description: "L'équipe a été créée avec succès.",
          });
        } else {
          throw new Error('Failed to create equipe');
        }
      }
      onSubmit(values);
      form.reset();
      onOpenChange(false);
      dispatch(fetchEquipes());
    } catch (error) {
      console.error('Failed to save equipe:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Server response:', error.response.data);
        toast({
          title: "Erreur",
          description: "Une erreur s'est produite lors de l'opération.",
          variant: "destructive",
        });
      }
    }
  }

  const handleDelete = async () => {
    if (!editingEquipe) return;
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette équipe ?')) {
      try {
        const response = await axios.delete(`http://127.0.0.1:8000/api/equipes/${editingEquipe.id}`);
        if (response.status === 200 || response.status === 204) {
          toast({
            title: "Équipe supprimée",
            description: "L'équipe a été supprimée avec succès.",
          });
          onOpenChange(false);
          dispatch(fetchEquipes());
        } else {
          throw new Error('Failed to delete equipe');
        }
      } catch (error) {
        console.error('Failed to delete equipe:', error);
        toast({
          title: "Erreur",
          description: "Une erreur s'est produite lors de la suppression.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                  <FormLabel>Nom de l'équipe</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Maroc" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="groupe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Groupe</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un groupe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">Groupe A</SelectItem>
                          <SelectItem value="B">Groupe B</SelectItem>
                          <SelectItem value="C">Groupe C</SelectItem>
                          <SelectItem value="D">Groupe D</SelectItem>
                          <SelectItem value="E">Groupe E</SelectItem>
                          <SelectItem value="F">Groupe F</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="abreviation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Abréviation</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: MAR" {...field} />
                    </FormControl>
                    <FormDescription>
                      Code à 3 lettres maximum
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="drapeau"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL du drapeau</FormLabel>
                  <FormControl>
                    <Input placeholder="https://exemple.com/drapeau.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="confederation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confédération</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une confédération" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CAF">CAF (Afrique)</SelectItem>
                          <SelectItem value="UEFA">UEFA (Europe)</SelectItem>
                          <SelectItem value="CONMEBOL">CONMEBOL (Amérique du Sud)</SelectItem>
                          <SelectItem value="CONCACAF">CONCACAF (Amérique du Nord)</SelectItem>
                          <SelectItem value="AFC">AFC (Asie)</SelectItem>
                          <SelectItem value="OFC">OFC (Océanie)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rang"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Classement FIFA</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" placeholder="Ex: 23" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="entraineur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entraîneur</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de l'entraîneur" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-between gap-2 mt-6">
              {editingEquipe && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={handleDelete}
                  className="w-full"
                >
                  Supprimer
                </Button>
              )}
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full border border-gray-300">
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

export default EquipeFormDialog;