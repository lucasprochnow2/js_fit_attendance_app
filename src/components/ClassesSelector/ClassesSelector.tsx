'use client';

import React, { useContext, useEffect, useState } from 'react';

import { dateToHour, FormattedClasses } from '@/utils/date';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { AttendanceContext } from '@/context/AttendanceContext';

interface ClassesSelectorProps {
  classes: FormattedClasses;
}

const HorizontalClassesSelector: React.FC<ClassesSelectorProps> = ({
  classes,
}) => {
  const { setCurrentClass } = useContext(AttendanceContext);
  const [api, setApi] = useState<CarouselApi>();

  const isEmpty = classes.carouselItems.every((item) => !item);

  useEffect(() => {
    if (!api || !setCurrentClass) {
      return;
    }

    api.scrollTo(1);

    api.on('select', () => {
      const selected = classes.carouselItems[api.selectedScrollSnap()];
      if (selected) setCurrentClass(selected);
    });
  }, [api, setCurrentClass, classes]);

  if (isEmpty) {
    return (
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent className="-ml-4">
          <CarouselItem className="text-center">
            <span className="text-1xl font-semibold">Sem aulas no momento</span>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );
  }

  return (
    <Carousel setApi={setApi} className="w-full">
      <CarouselContent className="-ml-4">
        {classes.carouselItems.map((item, idx) => (
          <CarouselItem key={idx} className="text-center">
            <span className="text-1xl font-semibold">{item?.name}</span>
            {item?.start_time && item?.end_time && (
              <>
                <br />
                <span className="text-sm">
                  {dateToHour(item?.start_time)} - {dateToHour(item?.end_time)}
                </span>
              </>
            )}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default HorizontalClassesSelector;
