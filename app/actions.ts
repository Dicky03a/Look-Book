'use server';

import { db } from '@/db';
import { activities } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { neon } from '@neondatabase/serverless';

let isInitialized = false;

async function initDb() {
  if (isInitialized || !process.env.DATABASE_URL) return;
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    await sql`
      CREATE TABLE IF NOT EXISTS activities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tugas TEXT NOT NULL,
        prioritas VARCHAR(20) NOT NULL,
        approval VARCHAR(255) NOT NULL,
        persiapan TEXT,
        tanggal_mulai VARCHAR(20) NOT NULL,
        tanggal_akhir VARCHAR(20) NOT NULL,
        status VARCHAR(50) NOT NULL,
        pencapaian TEXT,
        dokumentasi TEXT,
        catatan TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;
    
    isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

export async function getActivities() {
  if (!process.env.DATABASE_URL) return [];
  await initDb();
  
  try {
    return await db.select().from(activities).orderBy(desc(activities.createdAt));
  } catch (error) {
    console.error('Failed to get activities:', error);
    return [];
  }
}

export async function getActivity(id: string) {
  if (!process.env.DATABASE_URL) return null;
  
  try {
    const result = await db.select().from(activities).where(eq(activities.id, id));
    return result[0] || null;
  } catch (error) {
    console.error('Failed to get activity:', error);
    return null;
  }
}

export async function createActivity(data: any) {
  if (!process.env.DATABASE_URL) return { success: false, error: 'Database belum dikonfigurasi. Tambahkan DATABASE_URL di Secrets.' };
  
  try {
    await db.insert(activities).values(data);
    revalidatePath('/logbook');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to create activity:', error);
    return { success: false, error: 'Gagal menyimpan aktivitas' };
  }
}

export async function updateActivity(id: string, data: any) {
  if (!process.env.DATABASE_URL) return { success: false, error: 'Database belum dikonfigurasi. Tambahkan DATABASE_URL di Secrets.' };
  
  try {
    await db.update(activities).set(data).where(eq(activities.id, id));
    revalidatePath('/logbook');
    revalidatePath(`/logbook/${id}`);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to update activity:', error);
    return { success: false, error: 'Gagal memperbarui aktivitas' };
  }
}

export async function deleteActivity(id: string) {
  if (!process.env.DATABASE_URL) return { success: false, error: 'Database belum dikonfigurasi. Tambahkan DATABASE_URL di Secrets.' };
  
  try {
    await db.delete(activities).where(eq(activities.id, id));
    revalidatePath('/logbook');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete activity:', error);
    return { success: false, error: 'Gagal menghapus aktivitas' };
  }
}
