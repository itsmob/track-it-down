import { Routine } from './RoutineProvider';

export type Action = {
  type: 'routine-name-changed';
  payload: {
    routineName?: string;
  };
};

export const routineReducer: (state: Routine, action: Action) => Routine = (
  routineState,
  action
) => {
  switch (action.type) {
    case 'routine-name-changed': {
      if (!action.payload.routineName)
        throw Error('routineName: ' + action.payload.routineName);
      return {
        ...routineState,
        name: action.payload.routineName,
      };
    }

    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
};
