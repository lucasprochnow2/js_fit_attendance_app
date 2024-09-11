"use client";

import { useRef } from 'react';
import Webcam from "react-webcam";

import { processImages } from '@/app/actions';

export default function Home() {
  const webcamRef = useRef<Webcam>(null);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">

        <Webcam audio={false} ref={webcamRef} style={{ width: '300px', height: '250px' }} />

        <button className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded' onClick={() => processImages()}>
          Clique para reconhecer a face
        </button>
      </main>
    </div>
  );
}
