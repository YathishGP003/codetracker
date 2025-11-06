/**
 * Database Service Layer
 * 
 * This service provides a clean interface for database operations using Prisma.
 * Since Prisma Client cannot run in the browser, this service should be used
 * in a backend API or server-side code.
 * 
 * For client-side usage, create API routes that use these functions.
 */

import { prisma } from "@/lib/db";
import type { Student, Contest, Problem, SyncLog, AppSetting, Profile } from "@prisma/client";

// ==================== Student Operations ====================

export async function getAllStudents() {
  return prisma.student.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      contests: {
        orderBy: { contestDate: "desc" },
        take: 10,
      },
      problems: {
        orderBy: { solvedAt: "desc" },
        take: 10,
      },
    },
  });
}

export async function getStudentById(id: string) {
  return prisma.student.findUnique({
    where: { id },
    include: {
      contests: {
        orderBy: { contestDate: "desc" },
      },
      problems: {
        orderBy: { solvedAt: "desc" },
      },
      syncLogs: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
}

export async function getStudentByCodeforcesHandle(handle: string) {
  return prisma.student.findUnique({
    where: { codeforcesHandle: handle },
  });
}

export async function createStudent(data: {
  name: string;
  email: string;
  phoneNumber?: string;
  codeforcesHandle: string;
}) {
  return prisma.student.create({
    data: {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      codeforcesHandle: data.codeforcesHandle,
    },
  });
}

export async function updateStudent(
  id: string,
  data: Partial<{
    name: string;
    email: string;
    phoneNumber: string;
    codeforcesHandle: string;
    currentRating: number;
    maxRating: number;
    isActive: boolean;
    emailEnabled: boolean;
    lastSubmissionDate: Date;
  }>
) {
  return prisma.student.update({
    where: { id },
    data: {
      ...data,
      lastUpdated: new Date(),
    },
  });
}

export async function deleteStudent(id: string) {
  return prisma.student.delete({
    where: { id },
  });
}

// ==================== Contest Operations ====================

export async function getContestsByStudentId(studentId: string) {
  return prisma.contest.findMany({
    where: { studentId },
    orderBy: { contestDate: "desc" },
  });
}

export async function createContest(data: {
  studentId: string;
  contestId: number;
  contestName: string;
  contestDate: Date;
  rating?: number;
  ratingChange?: number;
  rank?: number;
  problemsSolved?: number;
  totalProblems?: number;
}) {
  return prisma.contest.create({
    data,
  });
}

export async function getContestByStudentAndContestId(
  studentId: string,
  contestId: number
) {
  return prisma.contest.findFirst({
    where: {
      studentId,
      contestId,
    },
  });
}

// ==================== Problem Operations ====================

export async function getProblemsByStudentId(studentId: string) {
  return prisma.problem.findMany({
    where: { studentId },
    orderBy: { solvedAt: "desc" },
  });
}

export async function createProblem(data: {
  studentId: string;
  problemId: string;
  problemName: string;
  solvedAt: Date;
  contestId?: number;
  problemIndex?: string;
  rating?: number;
  tags?: string[];
  verdict?: string;
  programmingLanguage?: string;
}) {
  return prisma.problem.create({
    data,
  });
}

export async function getProblemByStudentAndProblemId(
  studentId: string,
  problemId: string
) {
  return prisma.problem.findFirst({
    where: {
      studentId,
      problemId,
    },
  });
}

// ==================== Sync Log Operations ====================

export async function createSyncLog(data: {
  studentId?: string;
  syncType: string;
  status: string;
  message?: string;
  contestsFetched?: number;
  problemsFetched?: number;
}) {
  return prisma.syncLog.create({
    data,
  });
}

export async function getSyncLogsByStudentId(studentId: string) {
  return prisma.syncLog.findMany({
    where: { studentId },
    orderBy: { createdAt: "desc" },
  });
}

// ==================== App Settings Operations ====================

export async function getAppSetting(key: string) {
  return prisma.appSetting.findUnique({
    where: { settingKey: key },
  });
}

export async function setAppSetting(key: string, value: any) {
  return prisma.appSetting.upsert({
    where: { settingKey: key },
    update: { settingValue: value },
    create: {
      settingKey: key,
      settingValue: value,
    },
  });
}

// ==================== Profile Operations ====================

export async function getProfile(id: string) {
  return prisma.profile.findUnique({
    where: { id },
  });
}

export async function getProfileByUsername(username: string) {
  return prisma.profile.findUnique({
    where: { username },
  });
}

export async function createProfile(data: {
  id: string;
  fullName?: string;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}) {
  return prisma.profile.create({
    data,
  });
}

export async function updateProfile(
  id: string,
  data: Partial<{
    fullName: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
  }>
) {
  return prisma.profile.update({
    where: { id },
    data,
  });
}

// ==================== Utility Functions ====================

export async function getInactiveStudents(daysThreshold: number = 7) {
  // This would use the database function
  // For now, we'll use Prisma query
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);

  return prisma.student.findMany({
    where: {
      emailEnabled: true,
      isActive: true,
      OR: [
        { lastSubmissionDate: null },
        { lastSubmissionDate: { lt: thresholdDate } },
      ],
    },
    orderBy: {
      lastSubmissionDate: "asc",
    },
  });
}

