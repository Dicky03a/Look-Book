import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const activities = pgTable('activities', {
  id: uuid('id').defaultRandom().primaryKey(),
  tugas: text('tugas').notNull(),
  prioritas: varchar('prioritas', { length: 20 }).notNull(),
  approval: varchar('approval', { length: 255 }).notNull(),
  persiapan: text('persiapan'),
  tanggalMulai: varchar('tanggal_mulai', { length: 20 }).notNull(),
  tanggalAkhir: varchar('tanggal_akhir', { length: 20 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  pencapaian: text('pencapaian'),
  dokumentasi: text('dokumentasi'), // Will store Base64 string for file uploads
  catatan: text('catatan'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
