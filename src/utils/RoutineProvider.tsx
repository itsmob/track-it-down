import {
  createContext,
  PropsWithChildren,
  useContext,
  useReducer,
} from 'react';
import { Action, routineReducer } from './routineReducer';

export type Routine = {
  id?: string;
  name: string;
  exercises:
    | [
        {
          name: string;
          weight?: { amount: number; type: 'Lb' | 'Kg' };
          restTime?: number;
          repetitions?: number;
        },
      ]
    | [];
};

const RoutineContext = createContext<Routine>({
  name: 'Rutina 1',
  exercises: [],
});

const RoutineDispatchContext = createContext<React.Dispatch<Action> | null>(
  null
);

export function RoutineProvider({ children }: PropsWithChildren) {
  const [routine, dispatch] = useReducer(routineReducer, {
    name: 'Rutina 1',
    exercises: [],
  });

  return (
    <RoutineContext.Provider value={routine}>
      <RoutineDispatchContext.Provider value={dispatch}>
        {children}
      </RoutineDispatchContext.Provider>
    </RoutineContext.Provider>
  );
}

export const useRoutine = () => {
  try {
    const context = useContext(RoutineContext);
    return context;
  } catch (error) {
    console.log(
      'UseRoutine must be invoked within the RoutineContext provider'
    );
  }
};
export const useRoutineDispatch = () => {
  const context = useContext(RoutineDispatchContext);
  if (!context) throw new Error('Must be used within a RoutineProvider');
  return context;
};
