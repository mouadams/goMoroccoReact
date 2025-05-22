import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { useCreateEquipeMutation, useUpdateEquipeMutation } from '../../store/features/equipes/equipesApi';

interface EquipeFormData {
  nom: string;
  drapeau: string;
  groupe: string;
  points: number;
  joues: number;
  gagnes: number;
  nuls: number;
  perdus: number;
  buts_marques: number;
  buts_encaisses: number;
  difference_buts: number;
}

interface EquipesFormProps {
  open: boolean;
  onClose: () => void;
  equipe?: any; // For editing existing equipe
}

const initialFormData: EquipeFormData = {
  nom: '',
  drapeau: '',
  groupe: 'A',
  points: 0,
  joues: 0,
  gagnes: 0,
  nuls: 0,
  perdus: 0,
  buts_marques: 0,
  buts_encaisses: 0,
  difference_buts: 0,
};

const EquipesForm: React.FC<EquipesFormProps> = ({ open, onClose, equipe }) => {
  const [formData, setFormData] = useState<EquipeFormData>(initialFormData);
  const [createEquipe] = useCreateEquipeMutation();
  const [updateEquipe] = useUpdateEquipeMutation();

  useEffect(() => {
    if (equipe) {
      setFormData({
        nom: equipe.nom || '',
        drapeau: equipe.drapeau || '',
        groupe: equipe.groupe || 'A',
        points: equipe.points || 0,
        joues: equipe.joues || 0,
        gagnes: equipe.gagnes || 0,
        nuls: equipe.nuls || 0,
        perdus: equipe.perdus || 0,
        buts_marques: equipe.buts_marques || 0,
        buts_encaisses: equipe.buts_encaisses || 0,
        difference_buts: equipe.difference_buts || 0,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [equipe]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (equipe) {
        await updateEquipe({ id: equipe.id, equipe: formData }).unwrap();
      } else {
        await createEquipe(formData).unwrap();
      }
      onClose();
    } catch (error) {
      console.error('Failed to save equipe:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{equipe ? 'Modifier Équipe' : 'Nouvelle Équipe'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom de l'équipe"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Drapeau (URL)"
                name="drapeau"
                value={formData.drapeau}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Groupe</InputLabel>
                <Select
                  name="groupe"
                  value={formData.groupe}
                  onChange={handleChange}
                  label="Groupe"
                >
                  <MenuItem value="A">Groupe A</MenuItem>
                  <MenuItem value="B">Groupe B</MenuItem>
                  <MenuItem value="C">Groupe C</MenuItem>
                  <MenuItem value="D">Groupe D</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Points"
                name="points"
                value={formData.points}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Matchs joués"
                name="joues"
                value={formData.joues}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Matchs gagnés"
                name="gagnes"
                value={formData.gagnes}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Matchs nuls"
                name="nuls"
                value={formData.nuls}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Matchs perdus"
                name="perdus"
                value={formData.perdus}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Buts marqués"
                name="buts_marques"
                value={formData.buts_marques}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Buts encaissés"
                name="buts_encaisses"
                value={formData.buts_encaisses}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Différence de buts"
                name="difference_buts"
                value={formData.difference_buts}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained" color="primary">
            {equipe ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EquipesForm; 