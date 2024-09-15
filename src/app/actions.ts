'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/lib/prisma';

const create = async () => {
  const startTime = new Date('2021-10-01T14:00:00');
  const endTime = new Date('2021-10-01T15:00:00');

  const create = await prisma.classroom.create({
    data: {
      name: 'Aula 3',
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
    },
  });
  console.log('create', create);

  revalidatePath('classes');
};

export default create;
