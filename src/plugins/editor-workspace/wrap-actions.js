import { createSafeActionWrapper } from '../util/fn.js';

const setContent = createSafeActionWrapper((oriAction, system) => (content, contentOrigin) => {
  const { EditorContentOrigin, editorWorkspaceActions } = system;

  if (contentOrigin === EditorContentOrigin.Editor) {
    return;
  }

  editorWorkspaceActions.clearCompareSnapshot();
});

export default setContent;
