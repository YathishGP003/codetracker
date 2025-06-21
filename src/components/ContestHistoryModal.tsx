import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Student } from "@/types/Student";
import { useDarkMode } from "@/contexts/DarkModeContext";
import ContestHistory from "@/components/ContestHistory";

interface ContestHistoryModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

const ContestHistoryModal: React.FC<ContestHistoryModalProps> = ({
  student,
  isOpen,
  onClose,
}) => {
  const { isDarkMode } = useDarkMode();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-4xl max-h-[90vh] overflow-y-auto ${
          isDarkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-gray-200"
        }`}
      >
        {student && (
          <>
            <DialogHeader>
              <DialogTitle
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {student.name}'s Contest
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <ContestHistory student={student} />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContestHistoryModal;
