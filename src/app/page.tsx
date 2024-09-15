import { unstable_noStore as noStore } from 'next/cache';

import Webcam from '@/components/Webcam';
import prisma from '@/lib/prisma';
import { dateToHour } from '@/utils/date';

const getClasses = async () => {
  const classes = await prisma.classroom.findMany();
  return classes;
};

export default async function Home() {
  noStore();
  const classes = await getClasses();
  const currClass = classes[0];

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Webcam />
        {dateToHour(currClass?.start_time)} - {dateToHour(currClass?.end_time)}
        {classes?.map((c) => (
          <div key={c.id}>
            {c.start_time.toISOString()} - {c.end_time.toISOString()} - {c.name}
          </div>
        ))}
      </main>
    </div>
  );
}
