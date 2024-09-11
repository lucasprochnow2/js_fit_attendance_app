"use client";

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
} from 'face-api.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from "react-webcam";
import path from 'path'

export default function Home() {
  const [faceMatcher, setFaceMatcher] = useState<FaceMatcher | null>(null);
  const [isLoadingModels, setIsLoadingModels] = useState<boolean>(true);

  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadModels = async () => {
    setIsLoadingModels(true);

    const MODEL_URL = path.join(__dirname, '/models');

    await Promise.all([
      loadSsdMobilenetv1Model(MODEL_URL),
      loadFaceLandmarkModel(MODEL_URL),
      loadFaceRecognitionModel(MODEL_URL),
    ]);

    setIsLoadingModels(false);
  };

  const processImagesForRecognition = useCallback(async () => {
    const labels = ['outro', 'lucas2', 'gloria', 'angelera', 'dedezan'];

    let labeledFaceDescriptors = [];
    labeledFaceDescriptors = await Promise.all(
      labels.map(async (label) => {
        const img = await fetchImage(`/images/${label}.jpg`);
        const faceDescription = await detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!faceDescription) {
          throw new Error(`no faces detected for ${label}`);
        }

        const faceDescriptors = [faceDescription.descriptor];
        return new LabeledFaceDescriptors(label, faceDescriptors);
      })
    );

    const faceMatcher = new FaceMatcher(labeledFaceDescriptors, 0.6);

    setFaceMatcher(faceMatcher);
  }, []);

  const loadRecognizedFaces = async () => {
    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;

    if (
        canvas &&
        video &&
        faceMatcher
    ) {
      video.width = 300
      video.height = 250

      const resultsQuery = await detectSingleFace(video)
        .withFaceLandmarks()
        .withFaceDescriptor();

      matchDimensions(canvas, video);

      const result = resizeResults(resultsQuery, {
        width: video.width,
        height: video.height,
      });

      if (result) {
        const { descriptor, detection } = result;
        const bestMatch = faceMatcher.findBestMatch(descriptor);
        const drawBox = new draw.DrawBox(detection.box, {
          label: bestMatch.toString(),
        });

        drawBox.draw(canvas);
      }
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  useEffect(() => {
    if (!isLoadingModels)
      processImagesForRecognition();
  }, [isLoadingModels, processImagesForRecognition]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">

        <Webcam audio={false} ref={webcamRef} style={{ width: '300px', height: '250px' }} />
        <canvas ref={canvasRef} style={{ position: 'absolute', width: '300px', height: '250px' }} />

        <button className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded' onClick={loadRecognizedFaces}>
          Clique para reconhecer a face
        </button>
      </main>
    </div>
  );
}
