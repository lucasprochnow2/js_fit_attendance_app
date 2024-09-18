'use client';

import React, {
  useRef,
  useCallback,
  useEffect,
  useState,
  useContext,
  useMemo,
} from 'react';
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

import { savePresence } from '@/app/actions';
import { AttendanceContext } from '@/context/AttendanceContext';
import { Button } from '@/components/ui/button';

const WebcamComponent: React.FC = () => {
  const [faceMatcher, setFaceMatcher] = useState<FaceMatcher | null>(null);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [isModelsLoading, setIsModelsLoading] = useState<boolean>(true);
  const [presenceSaved, setPresenceSaved] = useState<string | null>(null);

  const { currentClass } = useContext(AttendanceContext);

  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const labels = useMemo(
    () => [
      { id: 1, label: 'outro' },
      { id: 2, label: 'lucas2' },
      { id: 3, label: 'gloria' },
      { id: 4, label: 'angelera' },
      { id: 5, label: 'dedezan' },
      { id: 6, label: 'morrice' },
    ],
    []
  );

  const processImagesForRecognition = useCallback(async () => {
    let labeledFaceDescriptors = [];
    labeledFaceDescriptors = await Promise.all(
      labels.map(async ({ label }) => {
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
  }, [labels]);

  const loadRecognizedFaces = useCallback(async () => {
    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;

    if (canvas && video && faceMatcher && currentClass?.id) {
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
          const drawBox = new draw.DrawBox(detection.box, {
            label: '',
          });
          drawBox.draw(canvas);

          const bestMatch = faceMatcher.findBestMatch(descriptor);
          const user = labels.find((label) => label.label === bestMatch.label);

          if (user) {
            const presResult = await savePresence({
              userId: user.id,
              classroomId: currentClass.id,
            });
            if (presResult) {
              setPresenceSaved(user.label);
              setInterval(() => setPresenceSaved(null), 5000);
            }
          }
        }
      }
    }
  }, [faceMatcher, currentClass, labels]);

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

  // useEffect(() => {
  //   if (faceMatcher) {
  //     setInterval(loadRecognizedFaces, 1000);
  //   }
  // }, [faceMatcher, loadRecognizedFaces]);

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
      {presenceSaved && <div>Presença salva {presenceSaved}!</div>}
      {currentClass?.id && (
        <Button onClick={() => loadRecognizedFaces()}>Salvar presença</Button>
      )}
    </>
  );
};

export default WebcamComponent;
