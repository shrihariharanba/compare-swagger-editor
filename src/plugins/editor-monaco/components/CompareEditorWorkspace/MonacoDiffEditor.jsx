import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import * as monaco from 'monaco-editor';
import noop from 'lodash/noop.js';

import seVsDarkTheme from '../../themes/se-vs-dark.js';
import seVsLightTheme from '../../themes/se-vs-light.js';
import { useMount, useSmoothResize, useUpdate } from '../MonacoEditor/hooks.js';

const MonacoDiffEditor = ({
  originalValue,
  modifiedValue,
  theme,
  language,
  onOriginalChange = noop,
  onMount = noop,
  onWillUnmount = noop,
  onChange = noop,
  onEditorMarkersDidChange = noop,
}) => {
  const containerRef = useRef(null);
  const diffEditorRef = useRef(null);
  const originalSubscriptionRef = useRef(null);
  const modifiedSubscriptionRef = useRef(null);
  const originalValueRef = useRef(originalValue);
  const modifiedValueRef = useRef(modifiedValue);
  const preventCreation = useRef(false);
  const [isEditorReady, setIsEditorReady] = useState(false);

  const applyWrappingOptions = useCallback(() => {
    const diffEditor = diffEditorRef.current;

    if (!diffEditor) {
      return;
    }

    diffEditor.updateOptions({
      wordWrap: 'on',
      diffWordWrap: 'on',
      wordWrapOverride1: 'on',
      wordWrapOverride2: 'on',
      wrappingStrategy: 'advanced',
    });

    diffEditor.getOriginalEditor().updateOptions({
      wordWrap: 'on',
      wrappingStrategy: 'advanced',
    });

    diffEditor.getModifiedEditor().updateOptions({
      wordWrap: 'on',
      wrappingStrategy: 'advanced',
    });
  }, []);

  const createEditor = useCallback(() => {
    if (!containerRef.current) return;
    if (preventCreation.current) return;

    const originalModel = monaco.editor.createModel(originalValue, language);
    const modifiedModel = monaco.editor.createModel(modifiedValue, language);

    diffEditorRef.current = monaco.editor.createDiffEditor(containerRef.current, {
      theme,
      renderSideBySide: true,
      splitViewDefaultRatio: 0.5,
      useInlineViewWhenSpaceIsLimited: false,
      renderSideBySideInlineBreakpoint: 0,
      originalEditable: true,
      enableSplitViewResizing: true,
      wordWrap: 'on',
      diffWordWrap: 'on',
      wordWrapOverride1: 'on',
      wordWrapOverride2: 'on',
      wrappingStrategy: 'advanced',
      minimap: {
        enabled: true,
      },
      renderOverviewRuler: true,
      glyphMargin: true,
      fixedOverflowWidgets: true,
      ignoreTrimWhitespace: false,
    });

    diffEditorRef.current.setModel({
      original: originalModel,
      modified: modifiedModel,
    });
    applyWrappingOptions();

    originalModel.updateOptions({ tabSize: 2 });
    modifiedModel.updateOptions({ tabSize: 2 });
    setIsEditorReady(true);
    preventCreation.current = true;
  }, [applyWrappingOptions, language, modifiedValue, originalValue, theme]);

  const disposeEditor = useCallback(() => {
    const modifiedEditor = diffEditorRef.current.getModifiedEditor();
    const model = diffEditorRef.current.getModel();

    onWillUnmount(modifiedEditor, monaco);
    originalSubscriptionRef.current?.dispose();
    modifiedSubscriptionRef.current?.dispose();
    diffEditorRef.current.setModel(null);
    model?.original?.dispose();
    model?.modified?.dispose();
    diffEditorRef.current.dispose();
    diffEditorRef.current = null;
  }, [onWillUnmount]);

  useMount(() => {
    return () => {
      if (diffEditorRef.current) {
        disposeEditor();
      }
    };
  });

  useMount(() => {
    monaco.editor.defineTheme('se-vs-dark', seVsDarkTheme);
    monaco.editor.defineTheme('se-vs-light', seVsLightTheme);
  });

  useUpdate(
    () => {
      const model = diffEditorRef.current.getModel();

      monaco.editor.setModelLanguage(model.original, language);
      monaco.editor.setModelLanguage(model.modified, language);
    },
    [language],
    isEditorReady
  );

  useUpdate(
    () => {
      const model = diffEditorRef.current.getModel();

      originalValueRef.current = originalValue;

      if (model && originalValue !== model.original.getValue()) {
        model.original.setValue(originalValue);
      }
    },
    [originalValue],
    isEditorReady
  );

  useUpdate(
    () => {
      const model = diffEditorRef.current.getModel();

      modifiedValueRef.current = modifiedValue;

      if (model && modifiedValue !== model.modified.getValue()) {
        model.modified.setValue(modifiedValue);
      }
    },
    [modifiedValue],
    isEditorReady
  );

  useUpdate(
    () => {
      monaco.editor.setTheme(theme);
    },
    [theme],
    isEditorReady
  );

  useEffect(() => {
    if (!isEditorReady) return undefined;

    const disposable = monaco.editor.onDidChangeMarkers((uris) => {
      const modifiedModel = diffEditorRef.current?.getModel()?.modified;

      if (!modifiedModel) {
        return;
      }

      const hasModifiedModelChanged = uris.find((uri) => String(uri) === String(modifiedModel.uri));

      if (hasModifiedModelChanged) {
        const markers = monaco.editor.getModelMarkers({ resource: modifiedModel.uri });
        onEditorMarkersDidChange(markers);
      }
    });

    return () => {
      disposable.dispose();
    };
  }, [isEditorReady, onEditorMarkersDidChange]);

  useEffect(() => {
    if (!isEditorReady) {
      return;
    }

    originalSubscriptionRef.current?.dispose();
    originalSubscriptionRef.current = diffEditorRef.current
      .getOriginalEditor()
      .onDidChangeModelContent((event) => {
        const editorValue = diffEditorRef.current.getOriginalEditor().getValue();

        if (originalValueRef.current !== editorValue) {
          originalValueRef.current = editorValue;
          onOriginalChange(editorValue, event);
        }
      });
  }, [isEditorReady, onOriginalChange]);

  useEffect(() => {
    if (!isEditorReady) {
      return;
    }

    modifiedSubscriptionRef.current?.dispose();
    modifiedSubscriptionRef.current = diffEditorRef.current
      .getModifiedEditor()
      .onDidChangeModelContent((event) => {
        const editorValue = diffEditorRef.current.getModifiedEditor().getValue();

        if (modifiedValueRef.current !== editorValue) {
          modifiedValueRef.current = editorValue;
          onChange(editorValue, event);
        }
      });
  }, [isEditorReady, onChange]);

  useEffect(() => {
    if (isEditorReady) {
      applyWrappingOptions();
      diffEditorRef.current.layout();
    }
  }, [applyWrappingOptions, isEditorReady]);

  useEffect(() => {
    if (isEditorReady) {
      onMount(diffEditorRef.current.getModifiedEditor());
    }
  }, [isEditorReady, onMount]);

  useEffect(() => {
    if (!isEditorReady) {
      createEditor();
    }
  }, [createEditor, isEditorReady]);

  useSmoothResize({ eventName: 'editorcontainerresize', editorRef: diffEditorRef });

  return <div ref={containerRef} className="swagger-editor__compare-editor-monaco" />;
};

MonacoDiffEditor.propTypes = {
  originalValue: PropTypes.string.isRequired,
  modifiedValue: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
  onOriginalChange: PropTypes.func,
  onMount: PropTypes.func,
  onWillUnmount: PropTypes.func,
  onChange: PropTypes.func,
  onEditorMarkersDidChange: PropTypes.func,
};

export default MonacoDiffEditor;
