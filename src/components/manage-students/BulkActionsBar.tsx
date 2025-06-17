
import React from 'react';
import { UserCheck, UserX, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useDarkMode } from '@/contexts/DarkModeContext';

interface BulkActionsBarProps {
  selectedCount: number;
  onActivateSelected: () => void;
  onDeactivateSelected: () => void;
  onDeleteSelected: () => void;
  isToggling: boolean;
}

export const BulkActionsBar = ({
  selectedCount,
  onActivateSelected,
  onDeactivateSelected,
  onDeleteSelected,
  isToggling
}: BulkActionsBarProps) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="flex items-center gap-2">
      <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
        {selectedCount} selected
      </span>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onActivateSelected}
        disabled={isToggling}
      >
        <UserCheck size={16} className="mr-1" />
        Activate
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onDeactivateSelected}
        disabled={isToggling}
      >
        <UserX size={16} className="mr-1" />
        Deactivate
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="destructive">
            <Trash2 size={16} className="mr-1" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Students</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedCount} selected students? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={onDeleteSelected}
            >
              Delete Students
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
