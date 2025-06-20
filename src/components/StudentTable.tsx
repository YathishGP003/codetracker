import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  Trash2,
  Plus,
  Filter,
  Mail,
  AlertCircle,
  Users,
  ExternalLink,
  Download,
  Edit,
} from "lucide-react";
import { Student } from "../types/Student";
import { useToast } from "@/hooks/use-toast";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { AddStudentDialog } from "@/components/AddStudentDialog";
import { SyncButton } from "@/components/SyncButton";
import StudentProfileModal from "@/components/StudentProfileModal";
import EditStudentDialog from "@/components/EditStudentDialog";
import { useCreateStudent, useDeleteStudent } from "@/hooks/useStudentData";

interface StudentTableProps {
  students: Student[];
}

const StudentTable: React.FC<StudentTableProps> = ({
  students: propStudents,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const { toast } = useToast();
  const { isDarkMode } = useDarkMode();
  const createStudent = useCreateStudent();
  const deleteStudent = useDeleteStudent();

  // Use real data from props, fallback to empty array
  const [students, setStudents] = useState<Student[]>(propStudents || []);

  // Update students when props change
  useEffect(() => {
    setStudents(propStudents || []);
  }, [propStudents]);

  // Function to add top Codeforces users
  const addTopCodeforcesUsers = async () => {
    const topUsers = [
      {
        name: "Gennady Korotkevich",
        email: "tourist@example.com",
        handle: "tourist",
      },
      { name: "Jiangly", email: "jiangly@example.com", handle: "jiangly" },
      {
        name: "Orz Devin Wang",
        email: "orzdevinwang@example.com",
        handle: "orzdevinwang",
      },
      {
        name: "Kevin114514",
        email: "kevin114514@example.com",
        handle: "Kevin114514",
      },
      {
        name: "Radewoosh",
        email: "radewoosh@example.com",
        handle: "Radewoosh",
      },
      { name: "Kevin Sun", email: "ksun48@example.com", handle: "ksun48" },
      { name: "maroonrk", email: "maroonrk@example.com", handle: "maroonrk" },
      { name: "Benjamin Qi", email: "benq@example.com", handle: "Benq" },
      {
        name: "Andrew He",
        email: "ecnerwala@example.com",
        handle: "ecnerwala",
      },
      { name: "Um_nik", email: "umnik@example.com", handle: "Um_nik" },
    ];

    try {
      for (const user of topUsers) {
        await createStudent.mutateAsync({
          name: user.name,
          email: user.email,
          codeforcesHandle: user.handle,
        });
      }
      toast({
        title: "Top Users Added",
        description: `Added ${topUsers.length} top Codeforces users to the system.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add some users. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getFilteredStudents = () => {
    let filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.codeforcesHandle
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

    switch (activeFilter) {
      case "active":
        filtered = filtered.filter((student) => student.isActive);
        break;
      case "inactive":
        filtered = filtered.filter((student) => !student.isActive);
        break;
      case "emails-on":
        filtered = filtered.filter((student) => student.emailEnabled);
        break;
      case "emails-off":
        filtered = filtered.filter((student) => !student.emailEnabled);
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredStudents = getFilteredStudents();

  const getRatingColor = (rating: number) => {
    if (rating >= 2100) return "text-red-400";
    if (rating >= 1900) return "text-orange-400";
    if (rating >= 1600) return "text-purple-400";
    if (rating >= 1400) return "text-blue-400";
    if (rating >= 1200) return "text-green-400";
    if (rating > 0) return "text-gray-400";
    return "text-gray-500";
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 3000) return "Legendary Grandmaster";
    if (rating >= 2600) return "International Grandmaster";
    if (rating >= 2400) return "Grandmaster";
    if (rating >= 2300) return "International Master";
    if (rating >= 2100) return "Master";
    if (rating >= 1900) return "Candidate Master";
    if (rating >= 1600) return "Expert";
    if (rating >= 1400) return "Specialist";
    if (rating >= 1200) return "Pupil";
    if (rating > 0) return "Newbie";
    return "Unrated";
  };

  const handleDeleteStudent = (studentId: string) => {
    deleteStudent.mutate(studentId);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(
      students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    setEditingStudent(null);
    toast({
      title: "Student Updated",
      description: "Student information has been updated successfully.",
    });
  };

  const handleToggleEmail = (studentId: string) => {
    setStudents(
      students.map((s) =>
        s.id === studentId ? { ...s, emailEnabled: !s.emailEnabled } : s
      )
    );
    toast({
      title: "Email Settings Updated",
      description: "Student email notification settings have been changed.",
    });
  };

  const handleSendReminder = (studentId: string) => {
    setStudents(
      students.map((s) =>
        s.id === studentId ? { ...s, reminderCount: s.reminderCount + 1 } : s
      )
    );
    toast({
      title: "Reminder Sent",
      description: "Reminder email has been sent to the student.",
    });
  };

  const handleViewStudent = (student: Student) => {
    if (!student || !student.id) return;
    setSelectedStudent(student);
    setIsProfileModalOpen(true);
  };

  const downloadCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone Number",
      "Codeforces Handle",
      "Current Rating",
      "Max Rating",
      "Status",
      "Last Updated",
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
          `"${student.lastUpdated}"`,
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
      title: "CSV Downloaded",
      description: `Downloaded data for ${filteredStudents.length} students.`,
    });
  };

  const filterOptions = [
    { value: "all", label: "All Students" },
    { value: "active", label: "Active Only" },
    { value: "inactive", label: "Inactive Only" },
    { value: "emails-on", label: "Emails Enabled" },
    { value: "emails-off", label: "Emails Disabled" },
  ];

  return (
    <>
      <div
        className={`rounded-3xl p-8 transition-all duration-500 ${
          isDarkMode
            ? "bg-slate-900/50 backdrop-blur-xl border border-slate-800/50"
            : "bg-white/80 backdrop-blur-xl border border-gray-200/50"
        }`}
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div>
            <h2
              className={`text-2xl font-bold mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Student Management
            </h2>
            <p className={isDarkMode ? "text-slate-400" : "text-gray-600"}>
              Monitor and track student progress across Codeforces platform
            </p>
          </div>

          <div className="flex items-center space-x-3 flex-wrap">
            {students.length === 0 && (
              <button
                onClick={addTopCodeforcesUsers}
                className={`px-4 py-3 rounded-2xl flex items-center space-x-2 transition-all duration-300 hover:scale-105 ${
                  isDarkMode
                    ? "bg-blue-900/50 hover:bg-blue-800/50 text-blue-400"
                    : "bg-blue-100 hover:bg-blue-200 text-blue-700"
                }`}
                title="Add Top CF Users"
              >
                <Users size={18} />
                <span>Add Top CF Users</span>
              </button>
            )}

            <button
              onClick={downloadCSV}
              className={`px-4 py-3 rounded-2xl flex items-center space-x-2 transition-all duration-300 hover:scale-105 ${
                isDarkMode
                  ? "bg-green-900/50 hover:bg-green-800/50 text-green-400"
                  : "bg-green-100 hover:bg-green-200 text-green-700"
              }`}
              title="Download CSV"
            >
              <Download size={18} />
              <span>CSV</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={`px-4 py-3 rounded-2xl flex items-center space-x-2 transition-all duration-300 hover:scale-105 ${
                  isDarkMode
                    ? "bg-slate-800/50 hover:bg-slate-700/50 text-slate-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                <Filter size={18} />
                <span>Filter</span>
              </button>

              {showFilterDropdown && (
                <div
                  className={`absolute right-0 mt-2 w-48 rounded-2xl shadow-lg border z-50 ${
                    isDarkMode
                      ? "bg-slate-900/95 border-slate-700/50 backdrop-blur-xl"
                      : "bg-white/95 border-gray-200/50 backdrop-blur-xl"
                  }`}
                >
                  <div className="py-2">
                    {filterOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setActiveFilter(option.value);
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                          activeFilter === option.value
                            ? isDarkMode
                              ? "bg-slate-800/50 text-teal-400"
                              : "bg-gray-100 text-teal-600"
                            : isDarkMode
                            ? "text-slate-300 hover:bg-slate-800/50"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <AddStudentDialog />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              isDarkMode ? "text-slate-400" : "text-gray-400"
            }`}
          />
          <input
            type="text"
            placeholder="Search students by name or Codeforces handle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-12 pr-4 py-4 rounded-2xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500/50 ${
              isDarkMode
                ? "bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-400"
                : "bg-white/50 border-gray-300/50 text-gray-900 placeholder-gray-500"
            }`}
          />
        </div>

        {/* Filter Status */}
        {activeFilter !== "all" && (
          <div className="mb-4 flex items-center justify-between">
            <span
              className={`text-sm ${
                isDarkMode ? "text-slate-400" : "text-gray-600"
              }`}
            >
              Showing {filteredStudents.length} of {students.length} students
              {activeFilter !== "all" &&
                ` (${
                  filterOptions.find((opt) => opt.value === activeFilter)?.label
                })`}
            </span>
            <button
              onClick={() => setActiveFilter("all")}
              className="text-sm text-teal-500 hover:text-teal-400 transition-colors"
            >
              Clear Filter
            </button>
          </div>
        )}

        {/* Empty State */}
        {students.length === 0 ? (
          <div className="text-center py-12">
            <Users
              size={48}
              className={`mx-auto mb-4 ${
                isDarkMode ? "text-slate-400" : "text-gray-400"
              }`}
            />
            <h3
              className={`text-lg font-semibold mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              No Students Added Yet
            </h3>
            <p
              className={`mb-6 ${
                isDarkMode ? "text-slate-400" : "text-gray-600"
              }`}
            >
              Get started by adding your first student or adding top Codeforces
              users
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={addTopCodeforcesUsers}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              >
                Add Top CF Users
              </button>
              <AddStudentDialog />
            </div>
          </div>
        ) : (
          /* Table */
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className={`border-b ${
                    isDarkMode ? "border-slate-700/50" : "border-gray-200/50"
                  }`}
                >
                  {[
                    "Name",
                    "CF Handle",
                    "Current Rating",
                    "Max Rating",
                    "Status",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className={`text-left py-4 px-4 font-semibold text-sm ${
                        isDarkMode ? "text-slate-300" : "text-gray-700"
                      }`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className={`border-b transition-all duration-300 hover:bg-opacity-50 ${
                      isDarkMode
                        ? "border-slate-700/30 hover:bg-slate-800/30"
                        : "border-gray-200/30 hover:bg-gray-100/30"
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center font-semibold text-white ${
                            student.isActive
                              ? "bg-gradient-to-br from-green-500 to-teal-500"
                              : "bg-gradient-to-br from-gray-500 to-slate-500"
                          }`}
                        >
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <div
                            className={`font-semibold ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            <a
                              href={`https://codeforces.com/profile/${student.codeforcesHandle}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline flex items-center space-x-1 hover:text-blue-500 transition-colors"
                            >
                              <span>{student.name}</span>
                              <ExternalLink size={14} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium">
                        {student.codeforcesHandle}
                      </span>
                    </td>
                    <td className={`py-4 px-4`}>
                      <div className="flex flex-col">
                        <span
                          className={`font-bold text-lg ${getRatingColor(
                            student.currentRating
                          )}`}
                        >
                          {student.currentRating || 0}
                        </span>
                        <span
                          className={`text-xs ${
                            isDarkMode ? "text-slate-400" : "text-gray-500"
                          }`}
                        >
                          {getRatingBadge(student.currentRating)}
                        </span>
                      </div>
                    </td>
                    <td className={`py-4 px-4`}>
                      <div className="flex flex-col">
                        <span
                          className={`font-bold text-lg ${getRatingColor(
                            student.maxRating
                          )}`}
                        >
                          {student.maxRating || 0}
                        </span>
                        <span
                          className={`text-xs ${
                            isDarkMode ? "text-slate-400" : "text-gray-500"
                          }`}
                        >
                          {getRatingBadge(student.maxRating)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col space-y-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
                            student.isActive
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {student.isActive ? "Active" : "Inactive"}
                        </span>
                        {student.reminderCount > 0 && (
                          <div className="flex items-center space-x-1 text-xs text-orange-400">
                            <AlertCircle size={12} />
                            <span>{student.reminderCount} reminders sent</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1 text-xs">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              student.emailEnabled
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {student.emailEnabled ? "Emails On" : "Emails Off"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewStudent(student)}
                          disabled={!student || !student.id}
                          className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                            isDarkMode
                              ? "bg-blue-900/50 text-blue-400 hover:bg-blue-800/50"
                              : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                          }`}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditStudent(student)}
                          className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                            isDarkMode
                              ? "bg-green-900/50 text-green-400 hover:bg-green-800/50"
                              : "bg-green-100 text-green-600 hover:bg-green-200"
                          }`}
                          title="Edit Student"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleSendReminder(student.id)}
                          className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                            isDarkMode
                              ? "bg-yellow-900/50 text-yellow-400 hover:bg-yellow-800/50"
                              : "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                          }`}
                          title="Send Reminder"
                        >
                          <Mail size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
                          className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                            isDarkMode
                              ? "bg-red-900/50 text-red-400 hover:bg-red-800/50"
                              : "bg-red-100 text-red-600 hover:bg-red-200"
                          }`}
                          title="Delete Student"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Overlay to close filter dropdown when clicking outside */}
        {showFilterDropdown && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowFilterDropdown(false)}
          />
        )}
      </div>

      <StudentProfileModal
        student={selectedStudent}
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedStudent(null);
        }}
      />

      <EditStudentDialog
        student={editingStudent}
        isOpen={!!editingStudent}
        onClose={() => setEditingStudent(null)}
        onSave={handleUpdateStudent}
      />
    </>
  );
};

export default StudentTable;
