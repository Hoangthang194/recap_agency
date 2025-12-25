/**
 * Plugin to emit onChange callback when editor content changes
 */
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$generateHtmlFromNodes} from '@lexical/html';
import {useEffect} from 'react';
import {$getRoot} from 'lexical';

type OnChangePluginProps = {
  onChange?: (html: string) => void;
};

export default function OnChangePlugin({
  onChange,
}: OnChangePluginProps): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!onChange) {
      return;
    }

    return editor.registerUpdateListener(({editorState}) => {
      editorState.read(() => {
        const root = $getRoot();
        const html = $generateHtmlFromNodes(editor, null);
        onChange(html);
      });
    });
  }, [editor, onChange]);

  return null;
}

