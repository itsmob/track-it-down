import {
  createContext,
  PropsWithChildren,
  useContext,
  useReducer,
} from 'react';
import { Action, routineReducer, Routine, SECTION } from './routineReducer';

const RoutineContext = createContext<Routine>({
  name: 'Rutina 1',
  exercises: {
    [SECTION.warmup]: [],
    [SECTION.main]: [],
    [SECTION.cooldown]: [],
  },
});

const RoutineDispatchContext = createContext<React.Dispatch<Action> | null>(
  null
);

export function RoutineProvider({ children }: PropsWithChildren) {
  const [routine, dispatch] = useReducer(routineReducer, {
    name: 'Rutina 1',
    exercises: {
      [SECTION.warmup]: [],
      [SECTION.main]: [],
      [SECTION.cooldown]: [],
    },
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
