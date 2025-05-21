
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

  function handleSubmit(values: EquipeFormValues) {
    onSubmit(values);
    if (!editingEquipe) {
      form.reset({
        nom: "",
        drapeau: "",
        groupe: "A",
        confederation: "CAF",
        abreviation: "",
        entraineur: "",
        rang: undefined
      });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">{dialogTitle}</DialogTitle>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <DialogFooter className="mt-6 flex justify-between gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border border-gray-300 w-full">
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
