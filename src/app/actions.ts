'use server';

import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client'

import prismaClient from '@/lib/prisma';

interface SavePresenceArgs {
  userId: number;
  classroomId: number;
}

export const create = async () => {
  const startTime = new Date('2021-10-01T14:00:00');
  const endTime = new Date('2021-10-01T15:00:00');

  const create = await prismaClient.classroom.create({
    data: {
      name: 'Aula 3',
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
    },
  });
  console.log('create', create);

  revalidatePath('classes');
};

export const savePresence = async ({ userId, classroomId }: SavePresenceArgs) => {
  try {
    await prismaClient.presence.create({
      data: {
        user_id: userId,
        classroom_id: classroomId,
      },
    });
    return true;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return false;
      }
    }

    console.log('--- erro inseperado', error);
  }
}
