
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/hooks/use-language";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Le nom doit contenir au moins 3 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères.",
  }),
  role: z.enum(["admin", "editor", "viewer"], {
    required_error: "Veuillez sélectionner un rôle.",
  }),
  isActive: z.boolean().default(true),
});

export type UserFormValues = z.infer<typeof formSchema>;

interface UserFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: UserFormValues) => void;
  defaultValues?: Partial<UserFormValues>;
  dialogTitle: string;
  submitButtonText: string;
}

export function UserFormDialog({
  isOpen,
  onClose,
  onSubmit,
  defaultValues = {
    name: "",
    email: "",
    password: "",
    role: "viewer" as const,
    isActive: true,
  },
  dialogTitle,
  submitButtonText,
}: UserFormDialogProps) {
  const { t } = useLanguage();
  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues as UserFormValues,
  });

  function handleSubmit(values: UserFormValues) {
    onSubmit(values);
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">{dialogTitle}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Nom complet')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('Nom de l\'utilisateur')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Mot de passe')}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormDescription>
                    {t('Minimum 6 caractères, utilisez des lettres, chiffres et symboles')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Rôle')}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('Sélectionner un rôle')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">{t('Administrateur')}</SelectItem>
                        <SelectItem value="editor">{t('Éditeur')}</SelectItem>
                        <SelectItem value="viewer">{t('Utilisateur')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    {t('Admin: tous les droits / Éditeur: peut modifier / Utilisateur: lecture seule')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">{t('Compte actif')}</FormLabel>
                    <FormDescription>
                      {t('Désactivez pour suspendre temporairement l\'accès de l\'utilisateur')}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6 flex justify-between gap-2">
              <Button type="button" variant="outline" onClick={onClose} className="border border-gray-300 w-full">
                {t('Annuler')}
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

export default UserFormDialog;
