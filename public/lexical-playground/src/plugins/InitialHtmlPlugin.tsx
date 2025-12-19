/**
 * Plugin to load initial HTML content into the editor
 */
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$generateNodesFromDOM} from '@lexical/html';
import {$getRoot} from 'lexical';
import {useEffect, useRef} from 'react';

type InitialHtmlPluginProps = {
  initialHtml?: string;
};

export default function InitialHtmlPlugin({
  initialHtml,
}: InitialHtmlPluginProps): null {
  const [editor] = useLexicalComposerContext();
  const lastInitialHtmlRef = useRef<string | undefined>(undefined);
  const hasLoadedRef = useRef<boolean>(false);

  useEffect(() => {
    
    // Only load if we have initialHtml and haven't loaded it yet
    // OR if initialHtml has changed from outside (not from user editing)
    if (!initialHtml || initialHtml.trim() === '') {
      return;
    }

    // If we've already loaded this exact initialHtml, don't reload
    // This prevents clearing editor when user is typing
    if (hasLoadedRef.current && lastInitialHtmlRef.current === initialHtml) {
      console.log('⚠️ Already loaded this HTML, skipping to prevent clearing editor')
      return;
    }

    // Only load if this is a new initialHtml (from props change, not from onChange)
    // Check if initialHtml is different from what we last loaded
    if (lastInitialHtmlRef.current !== undefined && lastInitialHtmlRef.current === initialHtml) {
      console.log('⚠️ HTML same as last loaded, skipping')
      return;
    }

    // Load initial HTML when editor is ready
    const timeoutId = setTimeout(() => {
      console.log('✅ Loading HTML into editor...')
      editor.update(
        () => {
          try {
            const root = $getRoot();
            const currentChildrenCount = root.getChildrenSize();
            console.log('Root children count before:', currentChildrenCount)
            
            // Only clear if editor already has content (from previous load)
            // If editor is empty, we can just append
            if (currentChildrenCount > 0) {
              root.clear();
            }
            
            const parser = new DOMParser();
            const dom = parser.parseFromString(initialHtml, 'text/html');
            const nodes = $generateNodesFromDOM(editor, dom);
            
            console.log('Generated nodes count:', nodes.length)
            
            root.append(...nodes);
            
            console.log('Root children count after:', root.getChildrenSize())
            console.log('✅ HTML loaded successfully')
            
            lastInitialHtmlRef.current = initialHtml;
            hasLoadedRef.current = true;
          } catch (error) {
            console.error('❌ Error loading initial HTML:', error);
          }
        },
        {discrete: true},
      );
    }, 300); // Delay to ensure editor is ready

    return () => clearTimeout(timeoutId);
  }, [editor, initialHtml]);

  return null;
}

