// components/HotelForm.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface HotelFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const HotelForm = ({ onSuccess, onCancel }: HotelFormProps) => {
  const [formData, setFormData] = useState({
    nom: '',
    ville: '',
    adresse: '',
    etoiles: '3',
    telephone: '',
    email: '',
    siteWeb: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/hotels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout de l\'hôtel');
      }

      toast({
        title: 'Succès',
        description: 'Hôtel ajouté avec succès',
      });
      onSuccess();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nom">Nom de l'hôtel</Label>
        <Input
          id="nom"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="ville">Ville</Label>
        <Input
          id="ville"
          name="ville"
          value={formData.ville}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="adresse">Adresse</Label>
        <Input
          id="adresse"
          name="adresse"
          value={formData.adresse}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="etoiles">Nombre d'étoiles</Label>
        <Select
          value={formData.etoiles}
          onValueChange={(value) => setFormData(prev => ({ ...prev, etoiles: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 étoile</SelectItem>
            <SelectItem value="2">2 étoiles</SelectItem>
            <SelectItem value="3">3 étoiles</SelectItem>
            <SelectItem value="4">4 étoiles</SelectItem>
            <SelectItem value="5">5 étoiles</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="telephone">Téléphone</Label>
        <Input
          id="telephone"
          name="telephone"
          type="tel"
          value={formData.telephone}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="siteWeb">Site Web</Label>
        <Input
          id="siteWeb"
          name="siteWeb"
          type="url"
          value={formData.siteWeb}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Envoi en cours...' : 'Ajouter l\'hôtel'}
        </Button>
      </div>
    </form>
  );
};