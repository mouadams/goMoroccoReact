
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import ActivityFormDialog from "../admine/ActivityFormDialog";
import { Activity, activities } from "@/data/activities";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLanguage } from "@/hooks/use-language";
import { toast } from "sonner";

export function ActivityManagement() {
  const { t } = useLanguage();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [activitiesList, setActivitiesList] = useState<Activity[]>(activities);

  const handleAddActivity = (values: Omit<Activity, "id">) => {
    const newActivity = {
      ...values,
      id: `activity-${Date.now()}`
    };
    
    setActivitiesList([...activitiesList, newActivity as Activity]);
    setIsAddDialogOpen(false);
    toast.success(t("Activité ajoutée avec succès"));
  };

  const handleEditActivity = (values: Activity) => {
    const updatedActivities = activitiesList.map(activity => 
      activity.id === values.id ? values : activity
    );
    
    setActivitiesList(updatedActivities);
    setIsEditDialogOpen(false);
    setCurrentActivity(null);
    toast.success(t("Activité mise à jour avec succès"));
  };

  const handleDeleteActivity = (id: string) => {
    const updatedActivities = activitiesList.filter(activity => activity.id !== id);
    setActivitiesList(updatedActivities);
    toast.success(t("Activité supprimée avec succès"));
  };

  const openEditDialog = (activity: Activity) => {
    setCurrentActivity(activity);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t("Gestion des activités")}</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> {t("Ajouter une activité")}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("Nom")}</TableHead>
              <TableHead>{t("Catégorie")}</TableHead>
              <TableHead>{t("Stade")}</TableHead>
              <TableHead>{t("Prix")}</TableHead>
              <TableHead>{t("Adresse")}</TableHead>
              <TableHead>{t("Note")}</TableHead>
              <TableHead className="text-right">{t("Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activitiesList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                  {t("Aucune activité disponible")}
                </TableCell>
              </TableRow>
            ) : (
              activitiesList.map(activity => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.name}</TableCell>
                  <TableCell>{t(activity.category)}</TableCell>
                  <TableCell>{activity.stadeId}</TableCell>
                  <TableCell>{activity.price}</TableCell>
                  <TableCell className="truncate max-w-xs">{activity.address}</TableCell>
                  <TableCell>{activity.rating.toFixed(1)}/5</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openEditDialog(activity)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteActivity(activity.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {isAddDialogOpen && (
        <ActivityFormDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSubmit={handleAddActivity}
          dialogTitle={t("Ajouter une activité")}
          submitButtonText={t("Ajouter")}
        />
      )}

      {isEditDialogOpen && currentActivity && (
        <ActivityFormDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setCurrentActivity(null);
          }}
          onSubmit={handleEditActivity}
          defaultValues={currentActivity}
          dialogTitle={t("Modifier l'activité")}
          submitButtonText={t("Mettre à jour")}
        />
      )}
    </div>
  );
}

export default ActivityManagement;
