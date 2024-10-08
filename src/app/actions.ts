/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client'
import * as faceapi from 'face-api.js';

import prismaClient from '@/lib/prisma';
import path from 'path';
import canvas from 'canvas';

interface SavePresenceArgs {
  userId: number;
  classroomId: number;
}

faceapi.env.monkeyPatch({
  Canvas: canvas.Canvas as any,
  Image: canvas.Image as any,
  ImageData: canvas.ImageData as any
});

export const loadFaces =  async () => {
  const modelsPath = path.resolve('./public/models');
  const imagePath = path.resolve('./public/images');

  await Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromDisk(modelsPath),
    faceapi.nets.faceLandmark68Net.loadFromDisk(modelsPath),
    faceapi.nets.ssdMobilenetv1.loadFromDisk(modelsPath),
  ]);

  const labels = [
    { id: 1, label: 'outro' },
    { id: 2, label: 'lucas2' },
    { id: 3, label: 'gloria' },
    { id: 4, label: 'angelera' },
    { id: 5, label: 'dedezan' },
    { id: 6, label: 'morrice' },
  ];

  const label = labels[0].label;
  // const img = await faceapi.fetchImage(`${imagePath}/${label}.jpg`);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const img: any = await canvas.loadImage(`${imagePath}/${label}.jpg`);

  const faceDescription = await faceapi.detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!faceDescription) {
    throw new Error(`no faces detected for ${label}`);
  }

  const faceDescriptors = [faceDescription.descriptor];
  const descriptor = new faceapi.LabeledFaceDescriptors(label, faceDescriptors);

  console.log('---- descriptor', descriptor);
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

export const uploadImage = async (form: FormData) => {
  console.log('********* uploadImage', form)
}
