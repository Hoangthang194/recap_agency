/**
 * Plugin to expose functions for getting/setting HTML from Lexical editor
 */
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$generateHtmlFromNodes, $generateNodesFromDOM} from '@lexical/html';
import {$getRoot} from 'lexical';
import {useEffect} from 'react';

export default function HtmlEditorPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Expose function to get current HTML from Lexical editor
    (window as any).__lexicalGetHtml = () => {
      let html = '';
      editor.getEditorState().read(() => {
        html = $generateHtmlFromNodes(editor, null);
      });
      return html;
    };

    // Expose function to set HTML to Lexical editor
    (window as any).__lexicalSetHtml = (newHtml: string) => {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        
        const parser = new DOMParser();
        const dom = parser.parseFromString(newHtml, 'text/html');
        const nodes = $generateNodesFromDOM(editor, dom);
        root.append(...nodes);
      }, {
        discrete: true,
      });
    };

    return () => {
      delete (window as any).__lexicalGetHtml;
      delete (window as any).__lexicalSetHtml;
    };
  }, [editor]);

  return null;
}

