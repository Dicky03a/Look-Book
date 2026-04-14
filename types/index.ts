export type Priority = 'Urgent' | 'Medium' | 'Low';
export type Status = 'To Do' | 'In Progress' | 'Selesai';

export interface Activity {
  id: string;
  tugas: string;
  prioritas: Priority;
  approval: string;
  persiapan: string;
  tanggalMulai: string;
  tanggalAkhir: string;
  status: Status;
  pencapaian: string;
  dokumentasi: string;
  catatan: string;
}
