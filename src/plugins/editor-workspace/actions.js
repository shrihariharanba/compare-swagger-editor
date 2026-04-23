export const EDITOR_WORKSPACE_SET_VIEW_MODE = 'editor_workspace_set_view_mode';
export const EDITOR_WORKSPACE_SET_COMPARE_SNAPSHOT = 'editor_workspace_set_compare_snapshot';
export const EDITOR_WORKSPACE_CLEAR_COMPARE_SNAPSHOT = 'editor_workspace_clear_compare_snapshot';

export const WORKSPACE_VIEW_MODES = {
  Standard: 'standard',
  Compare: 'compare',
};

export const setViewMode = (mode = WORKSPACE_VIEW_MODES.Standard) => ({
  type: EDITOR_WORKSPACE_SET_VIEW_MODE,
  payload: mode,
});

export const setCompareSnapshot = (content = '') => ({
  type: EDITOR_WORKSPACE_SET_COMPARE_SNAPSHOT,
  payload: content,
});

export const clearCompareSnapshot = () => ({
  type: EDITOR_WORKSPACE_CLEAR_COMPARE_SNAPSHOT,
});
