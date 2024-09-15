'use client';

import React, { useRef, useCallback, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
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
import path from 'path';

import create from '@/app/actions';

const WebcamComponent: React.FC = () => {
  const [faceMatcher, setFaceMatcher] = useState<FaceMatcher | null>(null);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [isModelsLoading, setIsModelsLoading] = useState<boolean>(true);

  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processImagesForRecognition = useCallback(async () => {
    const labels = [
      'outro',
      'lucas2',
      'gloria',
      'angelera',
      'dedezan',
      'morrice',
    ];

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
    setIsPageLoading(false);
  }, []);

  const loadRecognizedFaces = useCallback(async () => {
    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;

    if (canvas && video && faceMatcher) {
      video.width = 300;
      video.height = 250;

      const resultsQuery = await detectSingleFace(video)
        .withFaceLandmarks()
        .withFaceDescriptor();

      matchDimensions(canvas, video);

      if (resultsQuery) {
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
    }
  }, [faceMatcher]);

  useEffect(() => {
    const loadModels = async () => {
      setIsModelsLoading(true);

      const MODEL_URL = path.join(__dirname, '/models');

      await Promise.all([
        loadSsdMobilenetv1Model(MODEL_URL),
        loadFaceLandmarkModel(MODEL_URL),
        loadFaceRecognitionModel(MODEL_URL),
      ]);

      setIsModelsLoading(false);
    };

    setIsPageLoading(true);
    loadModels();
  }, []);

  useEffect(() => {
    if (!isModelsLoading) processImagesForRecognition();
  }, [isModelsLoading, processImagesForRecognition]);

  useEffect(() => {
    if (faceMatcher) {
      setInterval(loadRecognizedFaces, 1000);
    }
  }, [faceMatcher, loadRecognizedFaces]);

  return isPageLoading ? (
    <>Carregando página...</>
  ) : (
    <>
      <Webcam
        audio={false}
        ref={webcamRef}
        style={{ width: '300px', height: '250px' }}
      />
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', width: '300px', height: '250px' }}
      />

      <button onClick={() => create()}>Criar aula</button>
    </>
  );
};

export default WebcamComponent;
