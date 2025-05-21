import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { stadeApi } from "@/services/apiStade";

interface DeleteStadeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  stadeId: number;
  stadeName: string;
  onSuccess?: () => void;
}

export function DeleteStadeDialog({
  isOpen,
  onClose,
  stadeId,
  stadeName,
  onSuccess,
}: DeleteStadeDialogProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await stadeApi.delete(stadeId);
      toast.success("Stade supprimé avec succès");
      onClose();
      onSuccess?.();
    } catch (error: any) {
      console.error("Error deleting stade:", error);
      toast.error(
        error.response?.data?.message || "Erreur lors de la suppression du stade"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Confirmer la suppression
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-gray-700">
            Êtes-vous sûr de vouloir supprimer le stade{" "}
            <span className="font-semibold">{stadeName}</span> ? Cette action est
            irréversible.
          </p>
        </div>
        <DialogFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="w-full"
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full"
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteStadeDialog; 