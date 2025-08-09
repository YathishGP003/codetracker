import React, { useState } from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import {
  useStudents,
  useUpdateStudent,
  useDeleteStudent,
  useDeleteMultipleStudents,
  useToggleStudentStatus,
} from "@/hooks/useStudentData";
import { useSyncAllStudents, useSyncStudent } from "@/hooks/useStudentSync";
import EditStudentDialog from "@/components/EditStudentDialog";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import TopNavbar from "@/components/TopNavbar";
import { StudentActionBar } from "@/components/manage-students/StudentActionBar";
import { BulkActionsBar } from "@/components/manage-students/BulkActionsBar";
import { StudentTableRow } from "@/components/manage-students/StudentTableRow";
import { EmptyStudentsState } from "@/components/manage-students/EmptyStudentsState";
import InactivityMonitor from "@/components/InactivityMonitor";
import CronScheduler from "@/components/CronScheduler";
import RealTimeSyncManager from "@/components/RealTimeSyncManager";

const ManageStudents = () => {
  const { isDarkMode } = useDarkMode();
  const { data: students, isLoading } = useStudents();
  const syncStudentMutation = useSyncStudent();
  const syncAllMutation = useSyncAllStudents();
  const updateStudentMutation = useUpdateStudent();
  const deleteStudentMutation = useDeleteStudent();
  const deleteMultipleMutation = useDeleteMultipleStudents();
  const toggleStatusMutation = useToggleStudentStatus();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [editingStudent, setEditingStudent] = useState<any>(null);

  const filteredStudents =
    students?.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.codeforcesHandle
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    ) || [];

  const handleSyncStudent = (studentId: string, handle: string) => {
    console.log("Syncing student:", studentId, handle);
    syncStudentMutation.mutate({ studentId, handle });
  };

  const handleSyncAll = () => {
    console.log("Syncing all students...");
    syncAllMutation.mutate();
  };

  const handleEditStudent = (student: any) => {
    setEditingStudent(student);
  };

  const handleUpdateStudent = (updatedStudent: any) => {
    // Check if codeforcesHandle has changed
    const originalStudent = students?.find((s) => s.id === updatedStudent.id);
    const handleChanged =
      originalStudent &&
      originalStudent.codeforcesHandle !== updatedStudent.codeforcesHandle;

    updateStudentMutation.mutate(
      {
        id: updatedStudent.id,
        name: updatedStudent.name,
        email: updatedStudent.email,
        phoneNumber: updatedStudent.phoneNumber,
        codeforcesHandle: updatedStudent.codeforcesHandle,
        isActive: updatedStudent.isActive,
        emailEnabled: updatedStudent.emailEnabled,
      },
      {
        onSuccess: () => {
          if (handleChanged) {
            console.log(
              `Codeforces handle updated for ${updatedStudent.name}. Triggering real-time sync...`
            );
            syncStudentMutation.mutate(
              {
                studentId: updatedStudent.id,
                handle: updatedStudent.codeforcesHandle,
              },
              {
                onSuccess: () => {
                  toast({
                    title: "Student & Codeforces Data Updated",
                    description: `Student ${updatedStudent.name}'s information and Codeforces data have been updated.`,
                  });
                },
                onError: (error) => {
                  toast({
                    title: "Student Updated, Codeforces Sync Failed",
                    description: `Student ${updatedStudent.name}'s information updated, but Codeforces data sync failed: ${error.message}. It will be synced with the next cron.`,
                    variant: "destructive",
                  });
                },
              }
            );
          } else {
            toast({
              title: "Student Updated",
              description: "Student information has been updated successfully.",
            });
          }
          setEditingStudent(null);
        },
        onError: (error) => {
          toast({
            title: "Update Failed",
            description: `Failed to update student: ${error.message}`,
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleDeleteStudent = (studentId: string) => {
    deleteStudentMutation.mutate(studentId);
  };

  const handleDeleteSelected = () => {
    if (selectedStudents.length > 0) {
      deleteMultipleMutation.mutate(selectedStudents);
      setSelectedStudents([]);
    }
  };

  const handleActivateSelected = () => {
    if (selectedStudents.length > 0) {
      toggleStatusMutation.mutate({
        studentIds: selectedStudents,
        isActive: true,
      });
    }
  };

  const handleDeactivateSelected = () => {
    if (selectedStudents.length > 0) {
      toggleStatusMutation.mutate({
        studentIds: selectedStudents,
        isActive: false,
      });
    }
  };

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((s) => s.id));
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Codeforces Handle",
      "Current Rating",
      "Max Rating",
      "Status",
      "Email Enabled",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredStudents.map((student) =>
        [
          `"${student.name}"`,
          `"${student.email}"`,
          `"${student.phoneNumber}"`,
          `"${student.codeforcesHandle}"`,
          student.currentRating,
          student.maxRating,
          student.isActive ? "Active" : "Inactive",
          student.emailEnabled ? "Yes" : "No",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `students_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "CSV Exported",
      description: `Downloaded data for ${filteredStudents.length} students.`,
    });
  };

  if (isLoading) {
    return (
      <div
        className={`min-h-screen ${isDarkMode ? "bg-slate-950" : "bg-gray-50"}`}
      >
        <TopNavbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
            <p className={isDarkMode ? "text-slate-300" : "text-gray-600"}>
              Loading students...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-slate-950" : "bg-gray-50"}`}
    >
      <TopNavbar />

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            } mb-2`}
          >
            Manage Students
          </h1>
          <p
            className={`text-lg ${
              isDarkMode ? "text-slate-400" : "text-gray-600"
            }`}
          >
            Comprehensive student management and data synchronization
          </p>
        </div>

        <StudentActionBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSyncAll={handleSyncAll}
          onExportCSV={exportToCSV}
          isSyncing={syncAllMutation.isPending}
        />

        {/* Sync management (moved from Dashboard) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CronScheduler />
          <RealTimeSyncManager />
        </div>

        <div
          className={`rounded-2xl overflow-hidden ${
            isDarkMode ? "bg-slate-900/50" : "bg-white"
          } border ${isDarkMode ? "border-slate-800" : "border-gray-200"}`}
        >
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <h2
                className={`text-xl font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Students ({filteredStudents.length})
              </h2>

              {selectedStudents.length > 0 && (
                <BulkActionsBar
                  selectedCount={selectedStudents.length}
                  onActivateSelected={handleActivateSelected}
                  onDeactivateSelected={handleDeactivateSelected}
                  onDeleteSelected={handleDeleteSelected}
                  isToggling={toggleStatusMutation.isPending}
                />
              )}
            </div>
          </div>

          {filteredStudents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={
                        selectedStudents.length === filteredStudents.length &&
                        filteredStudents.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Codeforces Handle</TableHead>
                  <TableHead>Current Rating</TableHead>
                  <TableHead>Max Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <StudentTableRow
                    key={student.id}
                    student={student}
                    isSelected={selectedStudents.includes(student.id)}
                    onSelect={handleSelectStudent}
                    onSync={handleSyncStudent}
                    onEdit={handleEditStudent}
                    onDelete={handleDeleteStudent}
                    isSyncing={syncStudentMutation.isPending}
                  />
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyStudentsState searchTerm={searchTerm} />
          )}
        </div>

        <div className="mt-8">
          <InactivityMonitor />
        </div>
      </div>

      <EditStudentDialog
        student={editingStudent}
        isOpen={!!editingStudent}
        onClose={() => setEditingStudent(null)}
        onSave={handleUpdateStudent}
      />
    </div>
  );
};

export default ManageStudents;
