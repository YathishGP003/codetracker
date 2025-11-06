/**
 * Example API Routes for Prisma
 * 
 * Since Prisma Client cannot run in the browser, you need to create
 * backend API routes. This file shows examples of how to structure them.
 * 
 * For a Vite React app, you have several options:
 * 1. Create a separate Express.js/Fastify backend
 * 2. Use Vite's proxy to connect to a backend server
 * 3. Migrate to Next.js which has built-in API routes
 * 4. Use serverless functions (Vercel, Netlify, etc.)
 * 
 * Example with Express.js:
 */

import type { Request, Response } from 'express';
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from '@/services/db-service';

// Example: GET /api/students
export async function getStudentsHandler(req: Request, res: Response) {
  try {
    const students = await getAllStudents();
    res.json(students);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

// Example: GET /api/students/:id
export async function getStudentHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const student = await getStudentById(id);
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json(student);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

// Example: POST /api/students
export async function createStudentHandler(req: Request, res: Response) {
  try {
    const { name, email, phoneNumber, codeforcesHandle } = req.body;
    
    if (!name || !email || !codeforcesHandle) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, email, codeforcesHandle' 
      });
    }
    
    const student = await createStudent({
      name,
      email,
      phoneNumber,
      codeforcesHandle,
    });
    
    res.status(201).json(student);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

// Example: PUT /api/students/:id
export async function updateStudentHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const student = await updateStudent(id, updateData);
    res.json(student);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

// Example: DELETE /api/students/:id
export async function deleteStudentHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await deleteStudent(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Example Express.js server setup:
 * 
 * // server/index.ts
 * import express from 'express';
 * import cors from 'cors';
 * import {
 *   getStudentsHandler,
 *   getStudentHandler,
 *   createStudentHandler,
 *   updateStudentHandler,
 *   deleteStudentHandler,
 * } from './api/example-routes';
 * 
 * const app = express();
 * app.use(cors());
 * app.use(express.json());
 * 
 * app.get('/api/students', getStudentsHandler);
 * app.get('/api/students/:id', getStudentHandler);
 * app.post('/api/students', createStudentHandler);
 * app.put('/api/students/:id', updateStudentHandler);
 * app.delete('/api/students/:id', deleteStudentHandler);
 * 
 * const PORT = process.env.PORT || 3001;
 * app.listen(PORT, () => {
 *   console.log(`Server running on http://localhost:${PORT}`);
 * });
 * 
 * Then update your Vite config to proxy API requests:
 * 
 * // vite.config.ts
 * export default defineConfig({
 *   // ... other config
 *   server: {
 *     proxy: {
 *       '/api': {
 *         target: 'http://localhost:3001',
 *         changeOrigin: true,
 *       },
 *     },
 *   },
 * });
 */

