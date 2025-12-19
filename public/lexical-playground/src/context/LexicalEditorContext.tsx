/**
 * Context to pass initialHtml and onChange props to Editor
 */
import {createContext, useContext} from 'react';

type LexicalEditorContextType = {
  initialHtml?: string;
  onChange?: (html: string) => void;
};

export const LexicalEditorContext = createContext<LexicalEditorContextType>({});

export function useLexicalEditorContext() {
  return useContext(LexicalEditorContext);
}

