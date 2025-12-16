/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import './index.css';

import {$isCodeNode} from '@lexical/code';
import {$getNearestNodeFromDOMNode, LexicalEditor} from 'lexical';
// Stub for prettier (not available)
type Options = {
  parser?: string;
  plugins?: any[];
  [key: string]: any;
};
import {useState} from 'react';

interface Props {
  lang: string;
  editor: LexicalEditor;
  getCodeDOMNode: () => HTMLElement | null;
}

// Stub for prettier parsers (not available)
const PRETTIER_PARSER_MODULES = {
  css: [() => Promise.resolve({ default: {} })],
  html: [() => Promise.resolve({ default: {} })],
  js: [
    () => Promise.resolve({ default: {} }),
    () => Promise.resolve({ default: {} }),
  ],
  markdown: [() => Promise.resolve({ default: {} })],
  typescript: [
    () => Promise.resolve({ default: {} }),
    () => Promise.resolve({ default: {} }),
  ],
} as const;

type LanguagesType = keyof typeof PRETTIER_PARSER_MODULES;

async function loadPrettierParserByLang(lang: string) {
  const dynamicImports = PRETTIER_PARSER_MODULES[lang as LanguagesType];
  const modules = await Promise.all(
    dynamicImports.map((dynamicImport) => dynamicImport()),
  );
  return modules;
}

// Stub for prettier format (not available)
async function loadPrettierFormat() {
  // Return a stub function that just returns the code as-is
  return (code: string, options?: Options) => {
    // Basic formatting: just return the code unchanged
    // In production, this would use prettier to format the code
    console.warn('Prettier is not available. Code formatting is disabled.');
    return code;
  };
}

const PRETTIER_OPTIONS_BY_LANG: Record<string, Options> = {
  css: {parser: 'css'},
  html: {parser: 'html'},
  js: {parser: 'babel'},
  markdown: {parser: 'markdown'},
  typescript: {parser: 'typescript'},
};

const LANG_CAN_BE_PRETTIER = Object.keys(PRETTIER_OPTIONS_BY_LANG);

export function canBePrettier(lang: string): boolean {
  return LANG_CAN_BE_PRETTIER.includes(lang);
}

function getPrettierOptions(lang: string): Options {
  const options = PRETTIER_OPTIONS_BY_LANG[lang];
  if (!options) {
    throw new Error(
      `CodeActionMenuPlugin: Prettier does not support this language: ${lang}`,
    );
  }

  return options;
}

export function PrettierButton({lang, editor, getCodeDOMNode}: Props) {
  const [syntaxError, setSyntaxError] = useState<string>('');
  const [tipsVisible, setTipsVisible] = useState<boolean>(false);

  async function handleClick(): Promise<void> {
    const codeDOMNode = getCodeDOMNode();
    if (!codeDOMNode) {
      return;
    }

    let content = '';
    editor.update(() => {
      const codeNode = $getNearestNodeFromDOMNode(codeDOMNode);
      if ($isCodeNode(codeNode)) {
        content = codeNode.getTextContent();
      }
    });
    if (content === '') {
      return;
    }

    try {
      const format = await loadPrettierFormat();
      const options = getPrettierOptions(lang);
      const prettierParsers = await loadPrettierParserByLang(lang);
      options.plugins = prettierParsers.map(
        (parser) => parser.default || parser,
      );
      const formattedCode = await format(content, options);

      editor.update(() => {
        const codeNode = $getNearestNodeFromDOMNode(codeDOMNode);
        if ($isCodeNode(codeNode)) {
          const selection = codeNode.select(0);
          selection.insertText(formattedCode);
          setSyntaxError('');
          setTipsVisible(false);
        }
      });
    } catch (error: unknown) {
      setError(error);
    }
  }

  function setError(error: unknown) {
    if (error instanceof Error) {
      setSyntaxError(error.message);
      setTipsVisible(true);
    } else {
      console.error('Unexpected error: ', error);
    }
  }

  function handleMouseEnter() {
    if (syntaxError !== '') {
      setTipsVisible(true);
    }
  }

  function handleMouseLeave() {
    if (syntaxError !== '') {
      setTipsVisible(false);
    }
  }

  return (
    <div className="prettier-wrapper">
      <button
        className="menu-item"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label="prettier">
        {syntaxError ? (
          <i className="format prettier-error" />
        ) : (
          <i className="format prettier" />
        )}
      </button>
      {tipsVisible ? (
        <pre className="code-error-tips">{syntaxError}</pre>
      ) : null}
    </div>
  );
}
