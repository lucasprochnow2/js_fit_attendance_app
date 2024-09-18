import { Classroom } from '@prisma/client';
import { createContext, Dispatch, SetStateAction } from 'react';

import { DefaultCurrentClass } from '@/utils/date';

export type CurrentClass = Classroom | DefaultCurrentClass;

type DefaultState = {
  currentClass?: CurrentClass;
  setCurrentClass?: Dispatch<SetStateAction<CurrentClass>>;
};

const defaultState: DefaultState = {
  currentClass: undefined,
  setCurrentClass: undefined,
};

export const AttendanceContext = createContext(defaultState);
