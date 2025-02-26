import { User, InsertUser, Clinic, InsertClinic, Appointment, InsertAppointment } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

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
  
  // Appointment operations
  getAppointmentsByDoctor(doctorId: number): Promise<Appointment[]>;
  getAppointmentsByPatient(patientId: number): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, data: Partial<Appointment>): Promise<Appointment>;
  
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private clinics: Map<number, Clinic>;
  private appointments: Map<number, Appointment>;
  private currentId: { [key: string]: number };
  public sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.clinics = new Map();
    this.appointments = new Map();
    this.currentId = { users: 1, clinics: 1, appointments: 1 };
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { ...insertUser, id, status: "active" };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    const updated = { ...user, ...data };
    this.users.set(id, updated);
    return updated;
  }

  async deleteUser(id: number): Promise<void> {
    this.users.delete(id);
  }

  async getClinicsByDoctor(doctorId: number): Promise<Clinic[]> {
    return Array.from(this.clinics.values()).filter(
      (clinic) => clinic.doctorId === doctorId,
    );
  }

  async createClinic(clinic: InsertClinic): Promise<Clinic> {
    const id = this.currentId.clinics++;
    const newClinic: Clinic = { ...clinic, id };
    this.clinics.set(id, newClinic);
    return newClinic;
  }

  async updateClinic(id: number, data: Partial<Clinic>): Promise<Clinic> {
    const clinic = this.clinics.get(id);
    if (!clinic) throw new Error("Clinic not found");
    const updated = { ...clinic, ...data };
    this.clinics.set(id, updated);
    return updated;
  }

  async deleteClinic(id: number): Promise<void> {
    this.clinics.delete(id);
  }

  async getAppointmentsByDoctor(doctorId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (apt) => apt.doctorId === doctorId,
    );
  }

  async getAppointmentsByPatient(patientId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (apt) => apt.patientId === patientId,
    );
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const id = this.currentId.appointments++;
    const newAppointment: Appointment = { ...appointment, id };
    this.appointments.set(id, newAppointment);
    return newAppointment;
  }

  async updateAppointment(id: number, data: Partial<Appointment>): Promise<Appointment> {
    const appointment = this.appointments.get(id);
    if (!appointment) throw new Error("Appointment not found");
    const updated = { ...appointment, ...data };
    this.appointments.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
