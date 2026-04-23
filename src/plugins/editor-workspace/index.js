import EditorWorkspacePane from './components/EditorWorkspacePane.jsx';
import WorkspaceMenu from './components/WorkspaceMenu/WorkspaceMenu.jsx';
import { setViewMode, setCompareSnapshot, clearCompareSnapshot } from './actions.js';
import reducers from './reducers.js';
import {
  selectViewMode,
  selectIsCompareMode,
  selectCompareSnapshot,
  selectHasCompareSnapshot,
} from './selectors.js';
import setContentWrap from './wrap-actions.js';

const EditorWorkspacePlugin = () => ({
  components: {
    EditorWorkspacePane,
    TopBarWorkspaceMenu: WorkspaceMenu,
  },
  statePlugins: {
    editor: {
      wrapActions: {
        setContent: setContentWrap,
      },
    },
    editorWorkspace: {
      actions: {
        setViewMode,
        setCompareSnapshot,
        clearCompareSnapshot,
      },
      reducers,
      selectors: {
        selectViewMode,
        selectIsCompareMode,
        selectCompareSnapshot,
        selectHasCompareSnapshot,
      },
    },
  },
});

export default EditorWorkspacePlugin;
