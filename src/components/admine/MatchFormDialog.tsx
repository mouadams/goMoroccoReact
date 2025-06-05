import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { createMatch, updateMatch, deleteMatch } from "@/redux/matchesSlice";
import { fetchMatches } from "@/features/apiSlice";
import { useToast } from "@/hooks/use-toast";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Assuming Match and other types are already defined correctly
type MatchFormValues = {
  equipe1: string;
  equipe2: string;
  stadeId: string;
  date: string;
  heure: string;
  phase: string;
  groupe?: string;
  score1?: number | null;
  score2?: number | null;
  termine: boolean;
};

type MatchFormErrors = Partial<Record<keyof MatchFormValues, string>>;

interface MatchFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: MatchFormValues;
  dialogTitle: string;
  submitButtonText: string;
  editingMatchId?: string | null;
}

interface Match {
  id?: string;
  equipe1: string;
  equipe2: string;
  date: string;
  heure: string;
  stadeId: string;
  phase: string;
  groupe?: string;
  score1?: number;
  score2?: number;
  termine: boolean;
}





export function MatchFormDialog({
  isOpen,
  onClose,
  defaultValues = {
    equipe1: "",
    equipe2: "",
    stadeId: "",
    date: new Date().toISOString().split("T")[0],
    heure: "17:00",
    phase: "Groupe",
    groupe: "A",
    score1: null,
    score2: null,
    termine: false,
  },
  dialogTitle,
  submitButtonText,
  editingMatchId = null,
}: MatchFormDialogProps) {
  const [formValues, setFormValues] = useState<MatchFormValues>(defaultValues);
  const [errors, setErrors] = useState<MatchFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const stades = useSelector((state: RootState) => state.api.stades);
  const equipes = useSelector((state: RootState) => state.api.equipes);
  const { toast } = useToast();

  useEffect(() => {
    if (defaultValues) {
      setFormValues({
        equipe1: defaultValues.equipe1?.toString() || "",
        equipe2: defaultValues.equipe2?.toString() || "",
        stadeId: defaultValues.stadeId?.toString() || "",
        date: defaultValues.date || new Date().toISOString().split("T")[0],
        heure: defaultValues.heure || "17:00",
        phase: defaultValues.phase || "Groupe",
        groupe: defaultValues.groupe || "A",
        score1: defaultValues.score1 ?? null,
        score2: defaultValues.score2 ?? null,
        termine: Boolean(defaultValues.termine),
      });
    }
  }, [defaultValues]);

  const convertTo24Hour = (timeString: string): string => {
    if (!timeString) return "17:00";

    // If already in 24-hour format (contains :)
    if (timeString.includes(':') && !timeString.includes('PM') && !timeString.includes('AM')) {
      return timeString;
    }

    // Handle 12-hour format conversion
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':');

    if (modifier === 'PM' && hours !== '12') {
      hours = String(parseInt(hours, 10) + 12);
    } else if (modifier === 'AM' && hours === '12') {
      hours = '00';
    }

    return `${hours.padStart(2, '0')}:${(minutes || '00')}`;
  };

  const handleChange = (field: keyof MatchFormValues, value: any) => {
    console.log('handleChange', field, value, typeof value);
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: MatchFormErrors = {};

    if (!formValues.equipe1) newErrors.equipe1 = "Veuillez sélectionner une équipe.";
    if (!formValues.equipe2) newErrors.equipe2 = "Veuillez sélectionner une équipe.";
    if (formValues.equipe1 === formValues.equipe2 && formValues.equipe1 !== "") {
      newErrors.equipe2 = "Les deux équipes ne peuvent pas être identiques.";
    }
    if (!formValues.stadeId) newErrors.stadeId = "Veuillez sélectionner un stade.";
    if (!formValues.date) newErrors.date = "Veuillez entrer une date.";
    if (!formValues.heure) newErrors.heure = "Veuillez entrer une heure.";
    if (!formValues.phase) newErrors.phase = "Veuillez sélectionner une phase.";
    if (formValues.phase === "Groupe" && !formValues.groupe) {
      newErrors.groupe = "Veuillez sélectionner un groupe.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const formattedDate = new Date(formValues.date).toISOString().split('T')[0];
      const formattedTime = convertTo24Hour(formValues.heure);

      const stadeId = Number(formValues.stadeId);
      const equipe1Id = Number(formValues.equipe1);
      const equipe2Id = Number(formValues.equipe2);

      if (isNaN(stadeId)) {
        throw new Error(`Stade invalide: ${formValues.stadeId}`);
      }
      if (isNaN(equipe1Id)) {
        throw new Error(`Équipe 1 invalide: ${formValues.equipe1}`);
      }
      if (isNaN(equipe2Id)) {
        throw new Error(`Équipe 2 invalide: ${formValues.equipe2}`);
      }

      // Prepare data for API submission
      const apiMatchData: Partial<Match> = {
        stadeId: String(stadeId),
        equipe1: String(equipe1Id),
        equipe2: String(equipe2Id),
        date: formattedDate,
        heure: formattedTime,
        phase: formValues.phase,
        termine: Boolean(formValues.termine),
        groupe: formValues.phase === "Groupe" ? (formValues.groupe || "A") : undefined,
        score1: formValues.termine ? (formValues.score1 ?? 0) : undefined,
        score2: formValues.termine ? (formValues.score2 ?? 0) : undefined,
      };

      console.log("Submitting match data:", apiMatchData);

      if (editingMatchId) {
        // Dispatch updateMatch and then fetchMatches
        await dispatch(updateMatch({
          id: editingMatchId,
          matchData: apiMatchData
        })).unwrap();
        toast({
          title: "Match mis à jour",
          description: "Le match a été mis à jour avec succès.",
        });
      } else {
        // For creation, make sure the type aligns with createMatch expected payload
        await dispatch(createMatch(apiMatchData as any)).unwrap();
        toast({
          title: "Match ajouté",
          description: "Le match a été ajouté avec succès.",
        });
      }
      dispatch(fetchMatches()); // Fetch matches after both create and update
      setFormValues(defaultValues);
      onClose();
    } catch (error: any) {
      console.error('Error:', error);
      if (error.response?.data?.errors) {
        console.log("Validation errors:", error.response.data.errors);
        const apiErrors = error.response.data.errors;
        const formattedErrors: MatchFormErrors = {};

        Object.keys(apiErrors).forEach(key => {
          const normalizedKey = key.replace(/_id$/, '') as keyof MatchFormValues;
          formattedErrors[normalizedKey] = apiErrors[key][0];
        });

        setErrors(formattedErrors);
      } else {
        toast({
          title: "Erreur",
          description: `Une erreur s'est produite: ${error.message || JSON.stringify(error)}`,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="mb-4 text-2xl font-bold text-center">{dialogTitle}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Teams selection */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Équipe 1</label>
                      <Select
                value={formValues.equipe1}
                onValueChange={(value) => handleChange("equipe1", value)}
                      >
                <SelectTrigger className={errors.equipe1 ? "border-red-500" : ""}>
                          <SelectValue placeholder="Sélectionner une équipe" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px] overflow-y-auto">
                          {equipes.map((equipe) => (
                    <SelectItem key={equipe.id} value={String(equipe.id)}>
                              {equipe.nom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
              {errors.equipe1 && <p className="text-xs text-red-500">{errors.equipe1}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Équipe 2</label>
                      <Select
                value={formValues.equipe2}
                onValueChange={(value) => handleChange("equipe2", value)}
                      >
                <SelectTrigger className={errors.equipe2 ? "border-red-500" : ""}>
                          <SelectValue placeholder="Sélectionner une équipe" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px] overflow-y-auto">
                          {equipes.map((equipe) => (
                    <SelectItem key={equipe.id} value={String(equipe.id)}>
                              {equipe.nom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
              {errors.equipe2 && <p className="text-xs text-red-500">{errors.equipe2}</p>}
            </div>
            </div>

          {/* Stadium selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Stade</label>
                    <Select
              value={formValues.stadeId}
              onValueChange={(value) => handleChange("stadeId", value)}
                    >
              <SelectTrigger className={errors.stadeId ? "border-red-500" : ""}>
                        <SelectValue placeholder="Sélectionner un stade" />
                      </SelectTrigger>
                      <SelectContent>
                        {stades.map((stade) => (
                  <SelectItem key={stade.id} value={String(stade.id)}>
                            {stade.nom}, {stade.ville}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
            {errors.stadeId && <p className="text-xs text-red-500">{errors.stadeId}</p>}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={formValues.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className={errors.date ? "border-red-500" : ""}
              />
              {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Heure</label>
              <Input
                type="time"
                value={formValues.heure}
                onChange={(e) => handleChange("heure", e.target.value)}
                className={errors.heure ? "border-red-500" : ""}
              />
              {errors.heure && <p className="text-xs text-red-500">{errors.heure}</p>}
            </div>
            </div>

          {/* Phase and Group selection */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Phase</label>
                      <Select
                value={formValues.phase}
                onValueChange={(value) => handleChange("phase", value)}
                      >
                <SelectTrigger className={errors.phase ? "border-red-500" : ""}>
                          <SelectValue placeholder="Sélectionner une phase" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Groupe">Phase de groupes</SelectItem>
                          <SelectItem value="Huitièmes">Huitièmes de finale</SelectItem>
                          <SelectItem value="Quarts">Quarts de finale</SelectItem>
                          <SelectItem value="Demi-finales">Demi-finales</SelectItem>
                          <SelectItem value="Match pour la 3e place">Match pour la 3e place</SelectItem>
                          <SelectItem value="Finale">Finale</SelectItem>
                        </SelectContent>
                      </Select>
              {errors.phase && <p className="text-xs text-red-500">{errors.phase}</p>}
            </div>

            {formValues.phase === "Groupe" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Groupe</label>
                        <Select
                  value={formValues.groupe || "A"}
                  onValueChange={(value) => handleChange("groupe", value)}
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
              </div>
              )}
            </div>

          {/* Match finished switch */}
          <div className="flex flex-row items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
              <label className="text-base font-medium">Match terminé</label>
              <p className="text-sm text-gray-500">
                      Indiquer si le match est terminé pour afficher le score
              </p>
                  </div>
                    <Switch
              checked={formValues.termine}
              onCheckedChange={(checked) => handleChange("termine", checked)}
            />
          </div>

          {/* Score fields */}
          {formValues.termine && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Score Équipe 1</label>
                <Input
                  type="number"
                  min="0"
                  value={formValues.score1 === null ? "" : formValues.score1}
                  onChange={(e) => {
                    const value = e.target.value === "" ? null : parseInt(e.target.value);
                    handleChange("score1", value);
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Score Équipe 2</label>
                <Input
                  type="number"
                  min="0"
                  value={formValues.score2 === null ? "" : formValues.score2}
                  onChange={(e) => {
                    const value = e.target.value === "" ? null : parseInt(e.target.value);
                    handleChange("score2", value);
                  }}
                />
              </div>
              </div>
            )}

          <DialogFooter className="flex justify-between gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose} className="w-full border border-gray-300">
                Annuler
              </Button>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "En cours..." : submitButtonText}
              </Button>
            </DialogFooter>
          </form>

        {editingMatchId && (
          <Button
            type="button"
            variant="destructive"
            onClick={async () => {
              if (window.confirm("Êtes-vous sûr de vouloir supprimer ce match ?")) {
                setIsSubmitting(true);
                try {
                  await dispatch(deleteMatch(editingMatchId)).unwrap();
                  dispatch(fetchMatches());
                  toast({
                    title: "Match supprimé",
                    description: "Le match a été supprimé avec succès.",
                  });
                  onClose();
                } catch (error) {
                  toast({
                    title: "Erreur",
                    description: "Une erreur s'est produite lors de la suppression.",
                    variant: "destructive",
                  });
                } finally {
                  setIsSubmitting(false);
                }
              }
            }}
            disabled={isSubmitting}
          >
            Supprimer
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default MatchFormDialog;