
import { Button } from '@/components/ui/button';
import { RefreshCw, Users, Zap } from 'lucide-react';
import { useSyncStudentData, useSyncAllStudents } from '@/hooks/useStudentData';

interface SyncButtonProps {
  studentId?: string;
  handle?: string;
  variant?: 'single' | 'all' | 'comprehensive';
  size?: 'sm' | 'default' | 'lg';
}

export const SyncButton = ({ 
  studentId, 
  handle, 
  variant = 'single',
  size = 'sm'
}: SyncButtonProps) => {
  const syncStudentMutation = useSyncStudentData();
  const syncAllMutation = useSyncAllStudents();

  const handleSync = () => {
    if (variant === 'all' || variant === 'comprehensive') {
      syncAllMutation.mutate();
    } else if (studentId && handle) {
      syncStudentMutation.mutate({ studentId, handle });
    }
  };

  const isLoading = (variant === 'all' || variant === 'comprehensive') 
    ? syncAllMutation.isPending 
    : syncStudentMutation.isPending;

  const getButtonText = () => {
    if (isLoading) {
      switch (variant) {
        case 'comprehensive':
          return 'Comprehensive Sync...';
        case 'all':
          return 'Syncing All...';
        default:
          return 'Syncing...';
      }
    }
    
    switch (variant) {
      case 'comprehensive':
        return 'Enhanced Sync';
      case 'all':
        return 'Sync All Students';
      default:
        return 'Sync';
    }
  };

  const getIcon = () => {
    if (variant === 'comprehensive') {
      return <Zap className="w-4 h-4 mr-2" />;
    } else if (variant === 'all') {
      return <Users className="w-4 h-4 mr-2" />;
    } else {
      return (
        <RefreshCw 
          className={`w-4 h-4 ${size !== 'sm' ? 'mr-2' : ''} ${isLoading ? 'animate-spin' : ''}`} 
        />
      );
    }
  };

  return (
    <Button
      onClick={handleSync}
      disabled={isLoading || (variant === 'single' && (!studentId || !handle))}
      size={size}
      variant={variant === 'all' || variant === 'comprehensive' ? 'default' : 'outline'}
    >
      {getIcon()}
      {size !== 'sm' && getButtonText()}
    </Button>
  );
};
