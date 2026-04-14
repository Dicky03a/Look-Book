import { getActivities } from '@/app/actions';
import { LogbookClient } from './LogbookClient';

export default async function LogbookPage() {
  const activities = await getActivities();

  return <LogbookClient initialActivities={activities} />;
}
