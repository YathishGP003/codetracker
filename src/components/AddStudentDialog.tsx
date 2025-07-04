import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useCreateStudent, useSyncStudentData } from "@/hooks/useStudentData";

export const AddStudentDialog = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    codeforcesHandle: "",
  });

  const createStudentMutation = useCreateStudent();
  const syncStudentMutation = useSyncStudentData();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createStudentMutation.mutate(formData, {
      onSuccess: (data) => {
        if (data && data.id && data.codeforces_handle) {
          syncStudentMutation.mutate({
            studentId: data.id,
            codeforcesHandle: data.codeforces_handle,
          });
        }
        setOpen(false);
        setFormData({
          name: "",
          email: "",
          phoneNumber: "",
          codeforcesHandle: "",
        });
      },
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 shadow-lg flex items-center space-x-2 text-white font-bold text-base transition-all duration-300 hover:scale-105 hover:from-teal-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
        >
          {formData.codeforcesHandle && (
            <img
              src={`https://userpic.codeforces.org/${formData.codeforcesHandle}/avatar`}
              alt="CF Avatar"
              className="w-7 h-7 rounded-full object-cover border border-white mr-2 bg-white"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
          <Plus className="w-5 h-5 mr-2" />
          <span>Add Student</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="codeforcesHandle">Codeforces Handle</Label>
            <Input
              id="codeforcesHandle"
              value={formData.codeforcesHandle}
              onChange={(e) =>
                handleInputChange("codeforcesHandle", e.target.value)
              }
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createStudentMutation.isPending}>
              {createStudentMutation.isPending ? "Adding..." : "Add Student"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
