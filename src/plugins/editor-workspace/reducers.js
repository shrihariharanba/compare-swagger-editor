import {
  EDITOR_WORKSPACE_SET_VIEW_MODE,
  EDITOR_WORKSPACE_SET_COMPARE_SNAPSHOT,
  EDITOR_WORKSPACE_CLEAR_COMPARE_SNAPSHOT,
  WORKSPACE_VIEW_MODES,
} from './actions.js';

export const initialState = {
  viewMode: WORKSPACE_VIEW_MODES.Standard,
  compareSnapshot: null,
};

const reducers = {
  [EDITOR_WORKSPACE_SET_VIEW_MODE]: (state, action) => {
    return state.set('viewMode', action.payload);
  },
  [EDITOR_WORKSPACE_SET_COMPARE_SNAPSHOT]: (state, action) => {
    return state.set('compareSnapshot', action.payload);
  },
  [EDITOR_WORKSPACE_CLEAR_COMPARE_SNAPSHOT]: (state) => {
    return state.set('compareSnapshot', null);
  },
};

export default reducers;
