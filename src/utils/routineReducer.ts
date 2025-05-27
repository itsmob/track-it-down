export enum SECTION {
  warmup = 'Calentamiento',
  main = 'Fase media',
  cooldown = 'Vuelta a la calma',
}

type Exercise = {
  name: string;
  weight?: { amount: number; type: 'Lb' | 'Kg' };
  restTime?: number;
  repetitions?: number;
  section: SECTION;
};

export type Routine = {
  id?: string;
  name: string;
  exercises: {
    [SECTION.warmup]: Exercise[];
    [SECTION.main]: Exercise[];
    [SECTION.cooldown]: Exercise[];
  };
};

export type Action =
  | {
      type: 'ROUTINE_NAME_CHANGED';
      payload: { routineName: string };
    }
  | {
      type: 'ADD_EXERCISE';
      payload: { exercise: Exercise };
    }
  | {
      type: 'REMOVE_EXERCISE';
      payload: { section: SECTION; index: number };
    }
  | {
      type: 'UPDATE_EXERCISE';
      payload: {
        index: number;
        exerciseUpdated: Exercise;
      };
    };

export const routineReducer = (state: Routine, action: Action): Routine => {
  switch (action.type) {
    case 'ROUTINE_NAME_CHANGED':
      return {
        ...state,
        name: action.payload.routineName,
      };

    case 'ADD_EXERCISE': {
      const { exercise } = action.payload;
      return {
        ...state,
        exercises: {
          ...state.exercises,
          [exercise.section]: [...state.exercises[exercise.section], exercise],
        },
      };
    }

    case 'REMOVE_EXERCISE': {
      const { section, index } = action.payload;
      return {
        ...state,
        exercises: {
          ...state.exercises,
          [section]: state.exercises[section].filter((_, i) => i !== index),
        },
      };
    }

    case 'UPDATE_EXERCISE': {
      const { index, exerciseUpdated } = action.payload;
      const { section } = exerciseUpdated;
      return {
        ...state,
        exercises: {
          ...state.exercises,
          [section]: state.exercises[section].map((ex, i) =>
            i === index ? exerciseUpdated : ex
          ),
        },
      };
    }

    default:
      throw new Error(`Unknown action: ${(action as Action).type}`);
  }
};
