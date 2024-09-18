import type { Classroom } from '@prisma/client';

export type DefaultCurrentClass = {
  name: string;
  start_time: undefined;
  end_time: undefined;
  id: undefined;
};

export type FormattedClasses = {
  carouselItems: [
    Classroom | DefaultCurrentClass,
    Classroom | DefaultCurrentClass,
    Classroom | undefined
  ];
};

const defaultCurrent: DefaultCurrentClass = {
  id: undefined,
  name: 'Sem aula no momento',
  start_time: undefined,
  end_time: undefined,
};

export function dateToHour(date?: Date): string {
  if (!date) return '';

  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  const dateWithoutTZ = new Date(date.getTime() + userTimezoneOffset);

  const hours = dateWithoutTZ.getHours().toString().padStart(2, '0');
  const minutes = dateWithoutTZ.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}

export function formatClasses(classes: Classroom[]): FormattedClasses {
  if (!classes.length)
    return {
      carouselItems: [defaultCurrent, defaultCurrent, undefined],
    };

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  let previousClass: Classroom | undefined;
  let currentClass: Classroom | undefined;
  let nextClass: Classroom | undefined;

  for (const classroom of classes) {
    const startTimezoneOffset =
      classroom.start_time.getTimezoneOffset() * 60000;
    const startWithoutTZ = new Date(
      classroom.start_time.getTime() + startTimezoneOffset
    );
    const endTimezoneOffset = classroom.end_time.getTimezoneOffset() * 60000;
    const endWithoutTZ = new Date(
      classroom.end_time.getTime() + endTimezoneOffset
    );

    const classStartHour = startWithoutTZ.getHours();
    const classStartMinute = startWithoutTZ.getMinutes();
    const classEndHour = endWithoutTZ.getHours();
    const classEndMinute = endWithoutTZ.getMinutes();

    if (
      classStartHour < currentHour ||
      (classStartHour === currentHour && classStartMinute <= currentMinute)
    ) {
      if (
        classEndHour > currentHour ||
        (classEndHour === currentHour && classEndMinute >= currentMinute)
      ) {
        currentClass = classroom;
      } else {
        previousClass = classroom;
      }
    } else {
      const nextHour = currentHour + 1;
      if (
        classStartHour === nextHour ||
        (classStartHour === currentHour && classStartMinute > currentMinute)
      ) {
        nextClass = classroom;
      }
      break;
    }
  }

  return {
    carouselItems: [
      previousClass || defaultCurrent,
      currentClass || defaultCurrent,
      nextClass,
    ],
  };
}
