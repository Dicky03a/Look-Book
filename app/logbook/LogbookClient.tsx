'use client';

import { Plus, Search, Edit2, Trash2, Eye, FileDown, FileText } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { deleteActivity } from '@/app/actions';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export function LogbookClient({ initialActivities }: { initialActivities: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredActivities = initialActivities.filter(activity => {
    const matchesSearch = activity.tugas.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          activity.approval.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || activity.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus aktivitas ini?')) {
      await deleteActivity(id);
    }
  };

  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Logbook');

    // Add headers
    worksheet.columns = [
      { header: 'Tugas', key: 'tugas', width: 30 },
      { header: 'Prioritas', key: 'prioritas', width: 15 },
      { header: 'Approval', key: 'approval', width: 20 },
      { header: 'Tanggal Mulai', key: 'mulai', width: 15 },
      { header: 'Tanggal Akhir', key: 'akhir', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Pencapaian', key: 'pencapaian', width: 30 },
      { header: 'Catatan', key: 'catatan', width: 30 },
      { header: 'Dokumentasi', key: 'dokumentasi', width: 25 }
    ];

    // Style headers
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    filteredActivities.forEach((activity, index) => {
      const rowIndex = index + 2; // Header is row 1
      
      worksheet.addRow({
        tugas: activity.tugas,
        prioritas: activity.prioritas,
        approval: activity.approval,
        mulai: new Date(activity.tanggalMulai).toLocaleDateString('id-ID'),
        akhir: new Date(activity.tanggalAkhir).toLocaleDateString('id-ID'),
        status: activity.status,
        pencapaian: activity.pencapaian || '-',
        catatan: activity.catatan || '-'
      });

      // Set row height to accommodate image
      worksheet.getRow(rowIndex).height = 80;
      worksheet.getRow(rowIndex).alignment = { vertical: 'middle', wrapText: true };

      if (activity.dokumentasi && activity.dokumentasi.startsWith('data:image')) {
        try {
          let extension = 'png';
          if (activity.dokumentasi.includes('image/jpeg') || activity.dokumentasi.includes('image/jpg')) {
            extension = 'jpeg';
          }

          const imageId = workbook.addImage({
            base64: activity.dokumentasi,
            extension: extension as 'png' | 'jpeg',
          });

          worksheet.addImage(imageId, {
            tl: { col: 8, row: rowIndex - 1 }, // col 8 is 'Dokumentasi' (0-indexed)
            ext: { width: 100, height: 100 },
            editAs: 'oneCell'
          });
        } catch (e) {
          console.error('Failed to add image to Excel', e);
          worksheet.getCell(`I${rowIndex}`).value = 'Image Error';
        }
      } else if (activity.dokumentasi) {
         worksheet.getCell(`I${rowIndex}`).value = 'File Document (Not Image)';
      } else {
         worksheet.getCell(`I${rowIndex}`).value = '-';
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'Logbook_Magang.xlsx');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF('landscape');
    
    doc.text('Logbook Magang', 14, 15);
    
    const tableData = filteredActivities.map(activity => [
      activity.tugas,
      activity.prioritas,
      activity.approval,
      new Date(activity.tanggalMulai).toLocaleDateString('id-ID'),
      new Date(activity.tanggalAkhir).toLocaleDateString('id-ID'),
      activity.status,
      activity.pencapaian || '-',
      activity.dokumentasi && activity.dokumentasi.startsWith('data:image') ? '' : (activity.dokumentasi ? 'Doc' : '-')
    ]);

    autoTable(doc, {
      head: [['Tugas', 'Prioritas', 'Approval', 'Mulai', 'Akhir', 'Status', 'Pencapaian', 'Dokumentasi']],
      body: tableData,
      startY: 20,
      styles: { fontSize: 8, minCellHeight: 25, valign: 'middle' },
      headStyles: { fillColor: [79, 70, 229] }, // indigo-600
      columnStyles: {
        7: { cellWidth: 30, halign: 'center' } // Dokumentasi column
      },
      didDrawCell: (data) => {
        if (data.column.index === 7 && data.cell.section === 'body') {
          const activity = filteredActivities[data.row.index];
          if (activity.dokumentasi && activity.dokumentasi.startsWith('data:image')) {
            const dim = 20; // 20x20 mm
            const x = data.cell.x + (data.cell.width - dim) / 2;
            const y = data.cell.y + (data.cell.height - dim) / 2;
            try {
              doc.addImage(activity.dokumentasi, x, y, dim, dim);
            } catch(e) {
              console.error("Failed to add image to PDF", e);
            }
          }
        }
      }
    });

    doc.save('Logbook_Magang.pdf');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Look Book Magang</h1>
          <p className="text-gray-500 mt-1">Catat dan kelola aktivitas harian magang Anda.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <FileDown className="w-5 h-5" />
            Export Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
          >
            <FileText className="w-5 h-5" />
            Export PDF
          </button>
          <Link 
            href="/logbook/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Tambah Aktivitas
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari tugas atau nama approval..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
          >
            <option value="All">Semua Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Tugas</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Prioritas</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Tanggal</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Approval</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada aktivitas yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredActivities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">{activity.tugas}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        activity.prioritas === 'Urgent' ? 'bg-red-100 text-red-800' :
                        activity.prioritas === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {activity.prioritas}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{new Date(activity.tanggalMulai).toLocaleDateString('id-ID')}</p>
                      <p className="text-xs text-gray-500">s/d {new Date(activity.tanggalAkhir).toLocaleDateString('id-ID')}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{activity.approval}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        activity.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                        activity.status === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {activity.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/logbook/${activity.id}`}
                          className="p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link 
                          href={`/logbook/${activity.id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(activity.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
