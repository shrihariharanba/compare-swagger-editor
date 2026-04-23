import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import MonacoDiffEditor from './MonacoDiffEditor.jsx';
import { WORKSPACE_VIEW_MODES } from '../../../editor-workspace/actions.js';

const CompareEditorWorkspace = ({
  getComponent,
  editorActions,
  editorSelectors,
  editorWorkspaceActions,
  editorWorkspaceSelectors,
  EditorContentOrigin,
  useElementResize,
}) => {
  const ThemeSelection = getComponent('ThemeSelection', true);
  const ValidationPane = getComponent('ValidationPane', true);
  const content = editorSelectors.selectContent();
  const theme = editorSelectors.selectTheme();
  const language = editorSelectors.selectLanguage();
  const compareSnapshot = editorWorkspaceSelectors.selectCompareSnapshot();
  const compareContainerRef = useElementResize({ eventName: 'editorcontainerresize' });

  const handleEditorDidMount = useCallback(
    (editor) => {
      editor.focus();
      editorActions.editorSetup(editor, 'monaco');
    },
    [editorActions]
  );

  const handleEditorWillUnmount = useCallback(
    (editor) => {
      editorActions.editorTearDown(editor, 'monaco');
    },
    [editorActions]
  );

  const handleChangeEditorValue = useCallback(
    (newValue) => {
      editorActions.setContentDebounced(newValue, EditorContentOrigin.Editor);
    },
    [editorActions, EditorContentOrigin]
  );

  const handleChangeOriginalValue = useCallback(
    (newValue) => {
      editorWorkspaceActions.setCompareSnapshot(newValue);
    },
    [editorWorkspaceActions]
  );

  const handleEditorMarkersDidChange = useCallback(
    (markers) => {
      editorActions.setMarkers(markers);
    },
    [editorActions]
  );

  const handleRefreshSnapshot = useCallback(() => {
    editorWorkspaceActions.setCompareSnapshot(content);
  }, [content, editorWorkspaceActions]);

  const handleStandardView = useCallback(() => {
    editorWorkspaceActions.setViewMode(WORKSPACE_VIEW_MODES.Standard);
  }, [editorWorkspaceActions]);

  return (
    <div className="swagger-editor__compare-editor-workspace">
      <div className="swagger-editor__compare-editor-workspace-toolbar">
        <div className="swagger-editor__compare-editor-workspace-copy">
          <span className="swagger-editor__compare-editor-workspace-title">Compare mode</span>
          <span className="swagger-editor__compare-editor-workspace-subtitle">
            Edit either side and keep the rendered OpenAPI preview on the right.
          </span>
        </div>
        <div className="swagger-editor__compare-editor-workspace-actions">
          {ThemeSelection && <ThemeSelection />}
          <button
            type="button"
            className="swagger-editor__compare-editor-button"
            onClick={handleRefreshSnapshot}
          >
            Refresh Snapshot
          </button>
          <button
            type="button"
            className="swagger-editor__compare-editor-button swagger-editor__compare-editor-button--secondary"
            onClick={handleStandardView}
          >
            Standard View
          </button>
        </div>
      </div>
      <div className="swagger-editor__compare-editor-workspace-legend">
        <span>Editable Compare Spec</span>
        <span>Editable Current Spec</span>
      </div>
      <div className="swagger-editor__compare-editor-container" ref={compareContainerRef}>
        <MonacoDiffEditor
          originalValue={compareSnapshot ?? content}
          modifiedValue={content}
          language={language}
          theme={theme}
          onOriginalChange={handleChangeOriginalValue}
          onChange={handleChangeEditorValue}
          onMount={handleEditorDidMount}
          onWillUnmount={handleEditorWillUnmount}
          onEditorMarkersDidChange={handleEditorMarkersDidChange}
        />
      </div>
      {ValidationPane && (
        <div className="swagger-editor__compare-editor-validation">
          <ValidationPane alwaysDisplayHeading />
        </div>
      )}
    </div>
  );
};

CompareEditorWorkspace.propTypes = {
  getComponent: PropTypes.func.isRequired,
  useElementResize: PropTypes.func.isRequired,
  editorActions: PropTypes.shape({
    editorSetup: PropTypes.func.isRequired,
    editorTearDown: PropTypes.func.isRequired,
    setContentDebounced: PropTypes.func.isRequired,
    setMarkers: PropTypes.func.isRequired,
  }).isRequired,
  editorSelectors: PropTypes.shape({
    selectContent: PropTypes.func.isRequired,
    selectLanguage: PropTypes.func.isRequired,
    selectTheme: PropTypes.func.isRequired,
  }).isRequired,
  editorWorkspaceActions: PropTypes.shape({
    setCompareSnapshot: PropTypes.func.isRequired,
    setViewMode: PropTypes.func.isRequired,
  }).isRequired,
  editorWorkspaceSelectors: PropTypes.shape({
    selectCompareSnapshot: PropTypes.func.isRequired,
  }).isRequired,
  EditorContentOrigin: PropTypes.shape({
    Editor: PropTypes.string.isRequired,
  }).isRequired,
};

export default CompareEditorWorkspace;
