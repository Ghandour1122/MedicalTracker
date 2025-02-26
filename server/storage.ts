import { 
  users, clinics, appointments,
  type User, type InsertUser, 
  type Clinic, type InsertClinic,
  type Appointment, type InsertAppointment,
  UserRole 
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User>;
  deleteUser(id: number): Promise<void>;

  // Clinic operations
  getClinicsByDoctor(doctorId: number): Promise<Clinic[]>;
  createClinic(clinic: InsertClinic): Promise<Clinic>;
  updateClinic(id: number, data: Partial<Clinic>): Promise<Clinic>;
  deleteClinic(id: number): Promise<void>;
  getDoctors(): Promise<User[]>;

  // Appointment operations
  getAppointmentsByDoctor(doctorId: number): Promise<Appointment[]>;
  getAppointmentsByPatient(patientId: number): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, data: Partial<Appointment>): Promise<Appointment>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  public sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async getClinicsByDoctor(doctorId: number): Promise<Clinic[]> {
    return await db.select().from(clinics).where(eq(clinics.doctorId, doctorId));
  }

  async createClinic(insertClinic: InsertClinic): Promise<Clinic> {
    try {
      const [newClinic] = await db
        .insert(clinics)
        .values(insertClinic)
        .returning();
      return newClinic;
    } catch (error) {
      console.error("Database error creating clinic:", error);
      throw error;
    }
  }

  async updateClinic(id: number, data: Partial<Clinic>): Promise<Clinic> {
    const [clinic] = await db
      .update(clinics)
      .set(data)
      .where(eq(clinics.id, id))
      .returning();
    return clinic;
  }

  async deleteClinic(id: number): Promise<void> {
    await db.delete(clinics).where(eq(clinics.id, id));
  }

  async getAppointmentsByDoctor(doctorId: number): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(eq(appointments.doctorId, doctorId));
  }

  async getAppointmentsByPatient(patientId: number): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(eq(appointments.patientId, patientId));
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db
      .insert(appointments)
      .values(appointment)
      .returning();
    return newAppointment;
  }

  async updateAppointment(id: number, data: Partial<Appointment>): Promise<Appointment> {
    const [appointment] = await db
      .update(appointments)
      .set(data)
      .where(eq(appointments.id, id))
      .returning();
    return appointment;
  }

  async getDoctors(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(eq(users.role, UserRole.DOCTOR));
  }
}

export const storage = new DatabaseStorage();