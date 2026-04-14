'use client';

import { ActivityForm } from '@/components/ActivityForm';
import { updateActivity } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function EditActivityClient({ activity }: { activity: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    const result = await updateActivity(activity.id, data);
    if (result.success) {
      router.push('/logbook');
    } else {
      alert(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/logbook"
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Aktivitas</h1>
          <p className="text-gray-500 mt-1">Perbarui detail tugas dan aktivitas magang Anda.</p>
        </div>
      </div>

      <ActivityForm initialData={activity} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
