import React, { useState, useEffect } from "react";
import { Bell, BellOff, Mail, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface InactiveStudent {
  id: string;
  name: string;
  email: string;
  lastSubmission: Date;
  reminderCount: number;
  emailNotificationsEnabled: boolean;
}

const InactivityMonitor = () => {
  const { isDarkMode } = useDarkMode();
  const [inactiveStudents, setInactiveStudents] = useState<InactiveStudent[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchInactiveStudents();
  }, []);

  const fetchInactiveStudents = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to fetch inactive students
      // This should be called after each sync
      const response = await fetch("/api/inactive-students");
      const data = await response.json();
      setInactiveStudents(data);
    } catch (error) {
      console.error("Error fetching inactive students:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEmailNotifications = async (
    studentId: string,
    enabled: boolean
  ) => {
    try {
      // TODO: Implement API call to update email notification settings
      await fetch(`/api/students/${studentId}/notifications`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailNotificationsEnabled: enabled }),
      });

      setInactiveStudents((prev) =>
        prev.map((student) =>
          student.id === studentId
            ? { ...student, emailNotificationsEnabled: enabled }
            : student
        )
      );
    } catch (error) {
      console.error("Error updating notification settings:", error);
    }
  };

  const sendReminderEmail = async (studentId: string) => {
    try {
      // TODO: Implement API call to send reminder email
      await fetch(`/api/students/${studentId}/send-reminder`, {
        method: "POST",
      });

      setInactiveStudents((prev) =>
        prev.map((student) =>
          student.id === studentId
            ? { ...student, reminderCount: student.reminderCount + 1 }
            : student
        )
      );
    } catch (error) {
      console.error("Error sending reminder email:", error);
    }
  };

  return (
    <Card
      className={`relative overflow-hidden ${
        isDarkMode
          ? "bg-slate-900/70 border-slate-800/50 shadow-2xl"
          : "bg-white/90 border-gray-200/50 shadow-xl"
      } backdrop-blur-xl transition-all duration-300 hover:shadow-2xl`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-red-500/5"></div>

      <CardHeader className="relative z-10 pb-4">
        <CardTitle
          className={`flex items-center justify-between ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-red-600 shadow-lg">
              <Bell size={20} className="text-white" />
            </div>
            <div>
              <span className="text-lg font-semibold">Inactivity Monitor</span>
              <div className="flex items-center space-x-2 mt-1 text-amber-500">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                <span className="text-xs font-medium">Active</span>
              </div>
            </div>
          </div>
          <Badge
            variant="default"
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            {inactiveStudents.length} Inactive
          </Badge>
        </CardTitle>
        <CardDescription
          className={`${
            isDarkMode ? "text-slate-400" : "text-gray-600"
          } text-sm`}
        >
          Monitor and manage inactive students
        </CardDescription>
      </CardHeader>

      <CardContent className="relative z-10 space-y-4">
        {inactiveStudents.map((student) => (
          <div
            key={student.id}
            className={`p-4 rounded-xl ${
              isDarkMode
                ? "bg-slate-800/40 border border-slate-700/30"
                : "bg-gray-50/80 border border-gray-200/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3
                  className={`font-medium ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {student.name}
                </h3>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-slate-400" : "text-gray-500"
                  }`}
                >
                  {student.email}
                </p>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock
                    size={14}
                    className={isDarkMode ? "text-slate-400" : "text-gray-500"}
                  />
                  <span
                    className={isDarkMode ? "text-slate-400" : "text-gray-500"}
                  >
                    Last submission:{" "}
                    {new Date(student.lastSubmission).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={student.emailNotificationsEnabled}
                    onCheckedChange={(checked) =>
                      toggleEmailNotifications(student.id, checked)
                    }
                  />
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-slate-400" : "text-gray-500"
                    }`}
                  >
                    {student.emailNotificationsEnabled
                      ? "Notifications On"
                      : "Notifications Off"}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge
                    variant="outline"
                    className={
                      isDarkMode ? "border-slate-600" : "border-gray-300"
                    }
                  >
                    {student.reminderCount} reminders sent
                  </Badge>

                  <Button
                    onClick={() => sendReminderEmail(student.id)}
                    disabled={!student.emailNotificationsEnabled}
                    size="sm"
                    variant="outline"
                    className={`${
                      isDarkMode
                        ? "border-slate-600 hover:bg-slate-800 text-slate-300"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Reminder
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {inactiveStudents.length === 0 && (
          <div
            className={`text-center py-8 ${
              isDarkMode ? "text-slate-400" : "text-gray-500"
            }`}
          >
            <BellOff className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No inactive students found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InactivityMonitor;
