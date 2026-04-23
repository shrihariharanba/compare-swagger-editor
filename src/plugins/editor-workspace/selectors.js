import { createSelector } from 'reselect';

import { WORKSPACE_VIEW_MODES } from './actions.js';
import { initialState } from './reducers.js';

export const selectViewMode = (state) => state.get('viewMode', initialState.viewMode);

export const selectIsCompareMode = createSelector(selectViewMode, (viewMode) => {
  return viewMode === WORKSPACE_VIEW_MODES.Compare;
});

export const selectCompareSnapshot = (state) => {
  return state.get('compareSnapshot', initialState.compareSnapshot);
};

export const selectHasCompareSnapshot = createSelector(selectCompareSnapshot, (compareSnapshot) => {
  return compareSnapshot !== null;
});
