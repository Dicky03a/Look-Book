import { getActivity } from '@/app/actions';
import { ArrowLeft, Calendar, User, AlertCircle, CheckCircle2, FileText, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ViewActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const activity = await getActivity(id);

  if (!activity) {
    notFound();
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/logbook"
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detail Aktivitas</h1>
          </div>
        </div>
        <Link
          href={`/logbook/${activity.id}/edit`}
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
        >
          Edit Aktivitas
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-900">{activity.tugas}</h2>
            <span className={`shrink-0 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              activity.status === 'Selesai' ? 'bg-green-100 text-green-800' :
              activity.status === 'In Progress' ? 'bg-amber-100 text-amber-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {activity.status}
            </span>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4" />
                Prioritas
              </h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                activity.prioritas === 'Urgent' ? 'bg-red-100 text-red-800' :
                activity.prioritas === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {activity.prioritas}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4" />
                Jadwal
              </h3>
              <p className="text-gray-900">
                {new Date(activity.tanggalMulai).toLocaleDateString('id-ID', { dateStyle: 'long' })} 
                <span className="text-gray-400 mx-2">-</span> 
                {new Date(activity.tanggalAkhir).toLocaleDateString('id-ID', { dateStyle: 'long' })}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                <User className="w-4 h-4" />
                Approval (Atasan/Pembimbing)
              </h3>
              <p className="text-gray-900">{activity.approval}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4" />
                Yang Perlu Disiapkan
              </h3>
              <p className="text-gray-900">{activity.persiapan || '-'}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4" />
                Pencapaian / Progres
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg text-gray-900 whitespace-pre-wrap">
                {activity.pencapaian || 'Belum ada catatan pencapaian.'}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                <ImageIcon className="w-4 h-4" />
                Dokumentasi
              </h3>
              {activity.dokumentasi ? (
                activity.dokumentasi.startsWith('data:image') ? (
                  <div className="mt-2">
                    <img src={activity.dokumentasi} alt="Dokumentasi" className="max-w-full h-auto rounded-lg border border-gray-200" />
                  </div>
                ) : (
                  <a 
                    href={activity.dokumentasi} 
                    download="dokumentasi"
                    className="text-indigo-600 hover:text-indigo-800 hover:underline break-all inline-flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" /> Download File Dokumentasi
                  </a>
                )
              ) : (
                <p className="text-gray-500 italic">Tidak ada dokumentasi.</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Catatan Tambahan</h3>
              <p className="text-gray-900 whitespace-pre-wrap">{activity.catatan || '-'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
