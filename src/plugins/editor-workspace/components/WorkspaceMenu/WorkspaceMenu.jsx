import { useCallback } from 'react';
import PropTypes from 'prop-types';

import { WORKSPACE_VIEW_MODES } from '../../actions.js';

const WorkspaceMenu = ({
  getComponent,
  editorSelectors,
  editorWorkspaceActions,
  editorWorkspaceSelectors,
}) => {
  const DropdownMenu = getComponent('DropdownMenu');
  const DropdownMenuItem = getComponent('DropdownMenuItem');
  const DropdownMenuItemDivider = getComponent('DropdownMenuItemDivider');
  const CompareEditorWorkspace = getComponent('CompareEditorWorkspace', true);
  const currentContent = editorSelectors.selectContent();
  const isCompareMode = editorWorkspaceSelectors.selectIsCompareMode();
  const hasCompareSnapshot = editorWorkspaceSelectors.selectHasCompareSnapshot();

  const handleStandardViewClick = useCallback(() => {
    editorWorkspaceActions.setViewMode(WORKSPACE_VIEW_MODES.Standard);
  }, [editorWorkspaceActions]);

  const handleCompareViewClick = useCallback(() => {
    if (!hasCompareSnapshot) {
      editorWorkspaceActions.setCompareSnapshot(currentContent);
    }

    editorWorkspaceActions.setViewMode(WORKSPACE_VIEW_MODES.Compare);
  }, [currentContent, editorWorkspaceActions, hasCompareSnapshot]);

  const handleRefreshSnapshotClick = useCallback(() => {
    editorWorkspaceActions.setCompareSnapshot(currentContent);
  }, [currentContent, editorWorkspaceActions]);

  if (!CompareEditorWorkspace) {
    return null;
  }

  return (
    <DropdownMenu label="View">
      <DropdownMenuItem onClick={handleStandardViewClick}>
        {isCompareMode ? 'Editor + Preview' : 'Editor + Preview (Active)'}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={handleCompareViewClick}>
        {isCompareMode ? 'Compare + Preview (Active)' : 'Compare + Preview'}
      </DropdownMenuItem>
      <DropdownMenuItemDivider />
      <DropdownMenuItem onClick={handleRefreshSnapshotClick}>
        Refresh Compare Snapshot
      </DropdownMenuItem>
    </DropdownMenu>
  );
};

WorkspaceMenu.propTypes = {
  getComponent: PropTypes.func.isRequired,
  editorSelectors: PropTypes.shape({
    selectContent: PropTypes.func.isRequired,
  }).isRequired,
  editorWorkspaceActions: PropTypes.shape({
    setCompareSnapshot: PropTypes.func.isRequired,
    setViewMode: PropTypes.func.isRequired,
  }).isRequired,
  editorWorkspaceSelectors: PropTypes.shape({
    selectHasCompareSnapshot: PropTypes.func.isRequired,
    selectIsCompareMode: PropTypes.func.isRequired,
  }).isRequired,
};

export default WorkspaceMenu;
