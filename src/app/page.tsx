import { unstable_noStore } from 'next/cache';

import prisma from '@/lib/prisma';
import { formatClasses, FormattedClasses } from '@/utils/date';
import AttendancePage from '@/components/AttendancePage';

const getClasses = async (): Promise<FormattedClasses> => {
  const classes = await prisma.classroom.findMany({
    orderBy: { start_time: 'asc' },
  });

  return formatClasses(classes);
};

export default async function Home() {
  unstable_noStore();
  const classes = await getClasses();

  return <AttendancePage classes={classes} />;
}
