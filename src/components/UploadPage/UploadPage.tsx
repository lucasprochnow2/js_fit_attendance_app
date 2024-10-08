'use client';

import { useRef, useState } from 'react';
import Webcam from 'react-webcam';

import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';

interface Props {
  uploadImage: (file: FormData) => Promise<void>;
}

const AttendancePage: React.FC<Props> = ({ uploadImage }) => {
  const webcamRef = useRef<Webcam>(null);
  const [name, setName] = useState<string>('');

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const dataURLtoFile = (dataUrl: string, filename: string): File => {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : '';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const uploadImg = async () => {
    const imageSrc = webcamRef?.current?.getScreenshot();
    if (!imageSrc || !name) {
      console.log('No image or name');
      return;
    }

    const file = dataURLtoFile(imageSrc, 'webcam-image.png');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);

    try {
      await uploadImage(formData);
      console.log('Upload successful!');
    } catch (error) {
      console.error('Error uploading the image:', error);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={{ width: '300px', height: '250px' }}
        />
        <Input
          type="text"
          name="name"
          value={name}
          placeholder="Nome completo"
          onChange={onChangeName}
        />
        <Button onClick={() => uploadImg()}>Fazer upload</Button>
      </main>
    </div>
  );
};

export default AttendancePage;
