import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { stades } from "@/data/stades";
import { equipes } from "@/data/equipes";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { createMatch, updateMatch } from "@/redux/matchesSlice";

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
  stadeId: number;
  equipe1: number;
  equipe2: number;
  date: string;
  heure: string;
  phase: string;
  groupe?: string;
  score1?: number;
  score2?: number;
  termine: boolean | number;
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
      // Format date to YYYY-MM-DD
      const formattedDate = new Date(formValues.date).toISOString().split('T')[0];
      // Format time to 24-hour
      const formattedTime = convertTo24Hour(formValues.heure);

      // Before conversion - log values
      console.log("Form values before conversion:", {
        stadeId: formValues.stadeId,
        equipe1: formValues.equipe1,
        equipe2: formValues.equipe2,
        typeStadeId: typeof formValues.stadeId,
        typeEquipe1: typeof formValues.equipe1,
        typeEquipe2: typeof formValues.equipe2
      });

      // Get the numeric IDs using our mappings
      const stadeId = Number(formValues.stadeId);
      const equipe1Id = Number(formValues.equipe1);
      const equipe2Id = Number(formValues.equipe2);

      // After conversion - check for NaN
      console.log("Values after mapping lookup:", {
        stadeId,
        equipe1Id,
        equipe2Id,
        isNaN_stadeId: isNaN(Number(stadeId)),
        isNaN_equipe1: isNaN(Number(equipe1Id)),
        isNaN_equipe2: isNaN(Number(equipe2Id))
      });

      // Find actual equipes and stade objects for better error messages
      const stade = stades.find(s => Number(s.id) === stadeId);
      const equipe1Obj = equipes.find(e => Number(e.id) === equipe1Id);
      const equipe2Obj = equipes.find(e => Number(e.id) === equipe2Id);

      // Verify values are valid numbers before submitting
      if (!stadeId || isNaN(Number(stadeId))) {
        throw new Error(`Stade invalide: ${formValues.stadeId}`);
      }
      if (!equipe1Id || isNaN(Number(equipe1Id))) {
        throw new Error(`Équipe 1 invalide: ${formValues.equipe1}`);
      }
      if (!equipe2Id || isNaN(Number(equipe2Id))) {
        throw new Error(`Équipe 2 invalide: ${formValues.equipe2}`);
      }

      // Prepare data for API submission
      const apiMatchData = {
        stadeId: stadeId,
        equipe1: equipe1Id,
        equipe2: equipe2Id,
        date: formattedDate,
        heure: formattedTime,
        phase: formValues.phase,
        termine: formValues.termine ? 1 : 0,
        groupe: formValues.phase === "Groupe" ? (formValues.groupe || "A") : undefined,
        score1: formValues.termine ? (formValues.score1 ?? 0) : undefined,
        score2: formValues.termine ? (formValues.score2 ?? 0) : undefined,
      };

      console.log("Submitting match data:", apiMatchData);
      
      if (editingMatchId) {
        await dispatch(updateMatch({ id: editingMatchId, matchData: apiMatchData as any })).unwrap();
      } else {
        await dispatch(createMatch(apiMatchData as any)).unwrap();
      }
      
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
        alert(`Une erreur s'est produite: ${error.message || JSON.stringify(error)}`);
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
      </DialogContent>
    </Dialog>
  );
}

export default MatchFormDialog;