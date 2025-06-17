
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Student } from '@/types/Student';
import { useDarkMode } from '@/contexts/DarkModeContext';

interface EditStudentDialogProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => void;
}

const EditStudentDialog: React.FC<EditStudentDialogProps> = ({
  student,
  isOpen,
  onClose,
  onSave
}) => {
  const { isDarkMode } = useDarkMode();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    codeforcesHandle: '',
    isActive: true,
    emailEnabled: true
  });

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        email: student.email,
        phoneNumber: student.phoneNumber,
        codeforcesHandle: student.codeforcesHandle,
        isActive: student.isActive,
        emailEnabled: student.emailEnabled
      });
    }
  }, [student]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    const updatedStudent: Student = {
      ...student,
      ...formData
    };

    onSave(updatedStudent);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-md ${
        isDarkMode 
          ? 'bg-slate-900 border-slate-800 text-white' 
          : 'bg-white border-gray-200 text-gray-900'
      }`}>
        <DialogHeader>
          <DialogTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
            Edit Student
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
              Full Name *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              className={`${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              className={`${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className={`${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="handle" className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
              Codeforces Handle *
            </Label>
            <Input
              id="handle"
              type="text"
              value={formData.codeforcesHandle}
              onChange={(e) => handleInputChange('codeforcesHandle', e.target.value)}
              required
              className={`${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="active" className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
              Active Student
            </Label>
            <Switch
              id="active"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleInputChange('isActive', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="emails" className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
              Email Notifications
            </Label>
            <Switch
              id="emails"
              checked={formData.emailEnabled}
              onCheckedChange={(checked) => handleInputChange('emailEnabled', checked)}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStudentDialog;
