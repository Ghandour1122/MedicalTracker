import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { UserRole } from "@shared/schema";

function ensureRole(roles: (typeof UserRole)[keyof typeof UserRole][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (!roles.includes(req.user.role)) return res.sendStatus(403);
    next();
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Project Owner Routes
  app.get("/api/doctors", ensureRole([UserRole.PROJECT_OWNER]), async (req, res) => {
    const doctors = await storage.getDoctors();
    res.json(doctors);
  });

  // Doctor Routes
  app.get("/api/clinics", ensureRole([UserRole.DOCTOR]), async (req, res) => {
    const clinics = await storage.getClinicsByDoctor(req.user.id);
    res.json(clinics);
  });

  app.post("/api/clinics", ensureRole([UserRole.DOCTOR]), async (req, res) => {
    try {
      const clinic = await storage.createClinic({
        ...req.body,
        doctorId: req.user.id,
      });
      res.json(clinic);
    } catch (error) {
      console.error("Error creating clinic:", error);
      res.status(500).json({ message: "Failed to create clinic" });
    }
  });

  app.get("/api/appointments/doctor", ensureRole([UserRole.DOCTOR]), async (req, res) => {
    const appointments = await storage.getAppointmentsByDoctor(req.user.id);
    res.json(appointments);
  });

  // Patient Routes
  app.get("/api/doctors/search", async (req, res) => {
    const doctors = await storage.getDoctors();
    res.json(doctors);
  });

  app.get("/api/appointments/patient", ensureRole([UserRole.PATIENT]), async (req, res) => {
    const appointments = await storage.getAppointmentsByPatient(req.user.id);
    res.json(appointments);
  });

  app.post("/api/appointments", ensureRole([UserRole.PATIENT]), async (req, res) => {
    const appointment = await storage.createAppointment({
      ...req.body,
      patientId: req.user.id,
    });
    res.json(appointment);
  });

  const httpServer = createServer(app);
  return httpServer;
}