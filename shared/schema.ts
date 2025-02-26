import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const UserRole = {
  PROJECT_OWNER: "PROJECT_OWNER",
  DOCTOR: "DOCTOR",
  PATIENT: "PATIENT",
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().$type<UserRoleType>(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  specialization: text("specialization"), // For doctors
  bio: text("bio"),
  status: text("status").default("active"),
});

export const clinics = pgTable("clinics", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  doctorId: integer("doctor_id").notNull(),
  schedule: json("schedule").$type<{
    [key: string]: { start: string; end: string };
  }>(),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  doctorId: integer("doctor_id").notNull(),
  clinicId: integer("clinic_id").notNull(),
  datetime: timestamp("datetime").notNull(),
  status: text("status").default("pending"),
  reason: text("reason"),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  clinics: many(clinics),
  doctorAppointments: many(appointments, { relationName: "doctorAppointments" }),
  patientAppointments: many(appointments, { relationName: "patientAppointments" }),
}));

export const clinicsRelations = relations(clinics, ({ one }) => ({
  doctor: one(users, {
    fields: [clinics.doctorId],
    references: [users.id],
  }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  patient: one(users, {
    fields: [appointments.patientId],
    references: [users.id],
    relationName: "patientAppointments",
  }),
  doctor: one(users, {
    fields: [appointments.doctorId],
    references: [users.id],
    relationName: "doctorAppointments",
  }),
  clinic: one(clinics, {
    fields: [appointments.clinicId],
    references: [clinics.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
  fullName: true,
  email: true,
  phone: true,
  specialization: true,
  bio: true,
});

export const insertClinicSchema = createInsertSchema(clinics);
export const insertAppointmentSchema = createInsertSchema(appointments);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Clinic = typeof clinics.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;