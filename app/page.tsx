import { getActivities } from '@/app/actions';
import { CheckCircle2, Clock, ListTodo, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const activities = await getActivities();

  const totalActivities = activities.length;
  const completedActivities = activities.filter(a => a.status === 'Selesai').length;
  const inProgressActivities = activities.filter(a => a.status === 'In Progress').length;
  const todoActivities = activities.filter(a => a.status === 'To Do').length;

  const completionRate = totalActivities === 0 ? 0 : Math.round((completedActivities / totalActivities) * 100);

  const recentActivities = [...activities].slice(0, 5);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Ringkasan aktivitas magang Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Tugas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalActivities}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              <ListTodo className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Selesai</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{completedActivities}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{inProgressActivities}</p>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Tingkat Penyelesaian</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{completionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h2>
          <Link href="/logbook" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            Lihat Semua
          </Link>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivities.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Belum ada aktivitas yang dicatat.</div>
          ) : (
            recentActivities.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-900">{activity.tugas}</h3>
                    <p className="text-sm text-gray-500 mt-1">Approval: {activity.approval}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                    activity.status === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
