'use server'

import { promises as fs } from 'fs';
import {
  FaceMatcher,
  LabeledFaceDescriptors,
  detectSingleFace,
  draw,
  loadFaceLandmarkModel,
  loadFaceRecognitionModel,
  loadSsdMobilenetv1Model,
  matchDimensions,
  resizeResults,
  fetchImage,
  nets,
} from 'face-api.js';

export async function processImages() {
  console.log('Processing images...');

  const MODEL_URL = process.cwd() + '/public/models';
  const IMAGES_URL = process.cwd() + '/public/images';

  await Promise.all([
    nets.ssdMobilenetv1.loadFromDisk(MODEL_URL),
    nets.faceLandmark68Net.loadFromDisk(MODEL_URL),
    nets.faceRecognitionNet.loadFromDisk(MODEL_URL),
  ]);

  const labels = ['outro', 'lucas2', 'gloria', 'angelera', 'dedezan'];
  const file = await fs.readFile(`${IMAGES_URL}/angelera.jpg`);

  // const image = await canvas.loadImage(file);
  const faceDescription = await detectSingleFace(image)
          .withFaceLandmarks()
          .withFaceDescriptor();

  console.log('Result...', faceDescription);
}
