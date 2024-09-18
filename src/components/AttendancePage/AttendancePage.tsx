'use client';
import { useState } from 'react';

import Webcam from '@/components/Webcam';
import ClassesSelector from '@/components/ClassesSelector';
import { AttendanceContext } from '@/context/AttendanceContext';
import { FormattedClasses } from '@/utils/date';

type Props = {
  classes: FormattedClasses;
};

const AttendancePage: React.FC<Props> = ({ classes }) => {
  const [currentClass, setCurrentClass] = useState(classes.carouselItems[1]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <AttendanceContext.Provider value={{ currentClass, setCurrentClass }}>
          <Webcam />
          <ClassesSelector classes={classes} />
        </AttendanceContext.Provider>
      </main>
    </div>
  );
};

export default AttendancePage;
