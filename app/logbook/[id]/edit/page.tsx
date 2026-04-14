import { getActivity } from '@/app/actions';
import { EditActivityClient } from './EditActivityClient';
import { notFound } from 'next/navigation';

export default async function EditActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const activity = await getActivity(id);

  if (!activity) {
    notFound();
  }

  return <EditActivityClient activity={activity} />;
}
