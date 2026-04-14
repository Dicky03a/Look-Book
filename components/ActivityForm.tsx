'use client';

import { Activity } from '@/types';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';

interface ActivityFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

export function ActivityForm({ initialData, onSubmit, isSubmitting = false }: ActivityFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>('');
  const [formData, setFormData] = useState<any>({
    tugas: initialData?.tugas || '',
    prioritas: initialData?.prioritas || 'Medium',
    approval: initialData?.approval || '',
    persiapan: initialData?.persiapan || '',
    tanggalMulai: initialData?.tanggalMulai || new Date().toISOString().split('T')[0],
    tanggalAkhir: initialData?.tanggalAkhir || new Date().toISOString().split('T')[0],
    status: initialData?.status || 'To Do',
    pencapaian: initialData?.pencapaian || '',
    dokumentasi: initialData?.dokumentasi || '',
    catatan: initialData?.catatan || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (e.g., max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2MB');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev: any) => ({ ...prev, dokumentasi: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="tugas" className="block text-sm font-medium text-gray-700">Tugas / Aktivitas *</label>
          <textarea
            id="tugas"
            name="tugas"
            required
            rows={3}
            value={formData.tugas}
            onChange={handleChange}
            placeholder="Deskripsi mengenai pekerjaan atau aktivitas yang dilakukan..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="prioritas" className="block text-sm font-medium text-gray-700">Prioritas *</label>
          <select
            id="prioritas"
            name="prioritas"
            required
            value={formData.prioritas}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
          >
            <option value="Urgent">Urgent</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status *</label>
          <select
            id="status"
            name="status"
            required
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="tanggalMulai" className="block text-sm font-medium text-gray-700">Tanggal Mulai *</label>
          <input
            type="date"
            id="tanggalMulai"
            name="tanggalMulai"
            required
            value={formData.tanggalMulai}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="tanggalAkhir" className="block text-sm font-medium text-gray-700">Tanggal Akhir (Deadline) *</label>
          <input
            type="date"
            id="tanggalAkhir"
            name="tanggalAkhir"
            required
            value={formData.tanggalAkhir}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="approval" className="block text-sm font-medium text-gray-700">Approval (Atasan/Pembimbing) *</label>
          <input
            type="text"
            id="approval"
            name="approval"
            required
            value={formData.approval}
            onChange={handleChange}
            placeholder="Contoh: Pak Marshal"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="persiapan" className="block text-sm font-medium text-gray-700">Yang Perlu Disiapkan</label>
          <input
            type="text"
            id="persiapan"
            name="persiapan"
            value={formData.persiapan}
            onChange={handleChange}
            placeholder="Contoh: Kamera, Laptop, Capcut"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="pencapaian" className="block text-sm font-medium text-gray-700">Pencapaian / Progres</label>
          <textarea
            id="pencapaian"
            name="pencapaian"
            rows={2}
            value={formData.pencapaian}
            onChange={handleChange}
            placeholder="Detail mengenai hasil yang dicapai..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="dokumentasi" className="block text-sm font-medium text-gray-700">Dokumentasi (Upload File)</label>
          <input
            type="file"
            id="dokumentasi"
            name="dokumentasi"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {fileName && <p className="text-sm text-gray-500 mt-2">File terpilih: {fileName}</p>}
          {formData.dokumentasi && formData.dokumentasi.startsWith('data:image') && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Preview:</p>
              <img src={formData.dokumentasi} alt="Preview" className="max-h-48 rounded-lg border border-gray-200" />
            </div>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="catatan" className="block text-sm font-medium text-gray-700">Catatan Tambahan</label>
          <textarea
            id="catatan"
            name="catatan"
            rows={2}
            value={formData.catatan}
            onChange={handleChange}
            placeholder="Keterangan tambahan jika diperlukan..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Menyimpan...' : 'Simpan Aktivitas'}
        </button>
      </div>
    </form>
  );
}
