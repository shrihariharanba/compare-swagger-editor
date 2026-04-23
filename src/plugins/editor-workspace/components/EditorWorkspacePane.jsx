import { useEffect } from 'react';
import PropTypes from 'prop-types';

const EditorWorkspacePane = ({
  getComponent,
  editorSelectors,
  editorWorkspaceActions,
  editorWorkspaceSelectors,
}) => {
  const EditorPane = getComponent('EditorPane', true);
  const CompareEditorWorkspace = getComponent('CompareEditorWorkspace', true);
  const isCompareMode = editorWorkspaceSelectors.selectIsCompareMode();
  const compareSnapshot = editorWorkspaceSelectors.selectCompareSnapshot();
  const content = editorSelectors.selectContent();

  useEffect(() => {
    if (isCompareMode && CompareEditorWorkspace && compareSnapshot === null) {
      editorWorkspaceActions.setCompareSnapshot(content);
    }
  }, [CompareEditorWorkspace, compareSnapshot, content, editorWorkspaceActions, isCompareMode]);

  if (isCompareMode && CompareEditorWorkspace) {
    return <CompareEditorWorkspace />;
  }

  return <EditorPane />;
};

EditorWorkspacePane.propTypes = {
  getComponent: PropTypes.func.isRequired,
  editorSelectors: PropTypes.shape({
    selectContent: PropTypes.func.isRequired,
  }).isRequired,
  editorWorkspaceActions: PropTypes.shape({
    setCompareSnapshot: PropTypes.func.isRequired,
  }).isRequired,
  editorWorkspaceSelectors: PropTypes.shape({
    selectIsCompareMode: PropTypes.func.isRequired,
    selectCompareSnapshot: PropTypes.func.isRequired,
  }).isRequired,
};

export default EditorWorkspacePane;
