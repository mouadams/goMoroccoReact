import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useGetEquipesQuery, useDeleteEquipeMutation } from '../../store/features/equipes/equipesApi';
import EquipesForm from './EquipesForm';

const EquipesList: React.FC = () => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedEquipe, setSelectedEquipe] = useState<any>(null);
  const { data: equipes, isLoading, error } = useGetEquipesQuery();
  const [deleteEquipe] = useDeleteEquipeMutation();

  const handleOpenForm = (equipe?: any) => {
    setSelectedEquipe(equipe);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setSelectedEquipe(null);
    setOpenForm(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette équipe ?')) {
      try {
        await deleteEquipe(id).unwrap();
      } catch (error) {
        console.error('Failed to delete equipe:', error);
      }
    }
  };

  if (isLoading) return <Typography>Chargement...</Typography>;
  if (error) return <Typography color="error">Erreur lors du chargement des équipes</Typography>;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Liste des Équipes</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpenForm()}>
          Nouvelle Équipe
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Drapeau</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Groupe</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>J</TableCell>
              <TableCell>G</TableCell>
              <TableCell>N</TableCell>
              <TableCell>P</TableCell>
              <TableCell>BM</TableCell>
              <TableCell>BE</TableCell>
              <TableCell>Diff</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {equipes?.map((equipe) => (
              <TableRow key={equipe.id}>
                <TableCell>
                  <img 
                    src={equipe.drapeau} 
                    alt={equipe.nom} 
                    style={{ width: 30, height: 20, objectFit: 'cover' }} 
                  />
                </TableCell>
                <TableCell>{equipe.nom}</TableCell>
                <TableCell>{equipe.groupe}</TableCell>
                <TableCell>{equipe.points}</TableCell>
                <TableCell>{equipe.joues}</TableCell>
                <TableCell>{equipe.gagnes}</TableCell>
                <TableCell>{equipe.nuls}</TableCell>
                <TableCell>{equipe.perdus}</TableCell>
                <TableCell>{equipe.buts_marques}</TableCell>
                <TableCell>{equipe.buts_encaisses}</TableCell>
                <TableCell>{equipe.difference_buts}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenForm(equipe)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(equipe.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <EquipesForm
        open={openForm}
        onClose={handleCloseForm}
        equipe={selectedEquipe}
      />
    </Box>
  );
};

export default EquipesList; 