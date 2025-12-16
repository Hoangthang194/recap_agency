/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import './lineHeight.css';

import {LexicalEditor} from 'lexical';
import * as React from 'react';
import {
  $getSelection,
  $isRangeSelection,
} from 'lexical';
import {
  $patchStyleText,
} from '@lexical/selection';
import {SKIP_SELECTION_FOCUS_TAG} from './utils';
import {isKeyboardInput} from '../../utils/focusUtils';

export const MIN_ALLOWED_LINE_HEIGHT = 0.5;
export const MAX_ALLOWED_LINE_HEIGHT = 3.0;
export const DEFAULT_LINE_HEIGHT = 1.5;
export const LINE_HEIGHT_STEP = 0.1;

function parseLineHeight(input: string): number | null {
  // Support both unitless (1.5) and with unit (1.5em, 150%)
  const match = input.match(/^(\d+(?:\.\d+)?)(?:em|%)?$/);
  if (!match) return null;
  
  const value = Number(match[1]);
  // If it's a percentage, convert to decimal (150% -> 1.5)
  if (input.includes('%')) {
    return value / 100;
  }
  return value;
}

export function parseLineHeightForToolbar(input: string): string {
  const parsed = parseLineHeight(input);
  if (parsed === null) {
    return '';
  }
  return String(parsed);
}

function updateLineHeightInSelection(
  editor: LexicalEditor,
  lineHeight: string,
  skipRefocus: boolean = false,
) {
  editor.update(
    () => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          'line-height': lineHeight,
        });
      }
    },
    skipRefocus ? {tag: SKIP_SELECTION_FOCUS_TAG} : undefined,
  );
}

export default function LineHeight({
  selectionLineHeight,
  disabled,
  editor,
}: {
  selectionLineHeight: string;
  disabled: boolean;
  editor: LexicalEditor;
}) {
  const [inputValue, setInputValue] = React.useState<string>(selectionLineHeight || String(DEFAULT_LINE_HEIGHT));
  const [inputChangeFlag, setInputChangeFlag] = React.useState<boolean>(false);
  const [isMouseMode, setIsMouseMode] = React.useState(false);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const inputValueNumber = Number(inputValue);

    if (e.key === 'Tab') {
      return;
    }
    if (['e', 'E', '+', '-'].includes(e.key) || isNaN(inputValueNumber)) {
      e.preventDefault();
      setInputValue(String(DEFAULT_LINE_HEIGHT));
      return;
    }
    setInputChangeFlag(true);
    if (e.key === 'Enter' || e.key === 'Escape') {
      e.preventDefault();
      updateLineHeightByInputValue(inputValueNumber, !isMouseMode);
    }
  };

  const handleInputBlur = () => {
    setIsMouseMode(false);

    if (inputValue !== '' && inputChangeFlag) {
      const inputValueNumber = Number(inputValue);
      updateLineHeightByInputValue(inputValueNumber);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    setIsMouseMode(true);
  };

  const updateLineHeightByInputValue = (
    inputValueNumber: number,
    skipRefocus: boolean = false,
  ) => {
    let updatedLineHeight = inputValueNumber;
    if (inputValueNumber > MAX_ALLOWED_LINE_HEIGHT) {
      updatedLineHeight = MAX_ALLOWED_LINE_HEIGHT;
    } else if (inputValueNumber < MIN_ALLOWED_LINE_HEIGHT) {
      updatedLineHeight = MIN_ALLOWED_LINE_HEIGHT;
    }

    setInputValue(String(updatedLineHeight));
    updateLineHeightInSelection(
      editor,
      String(updatedLineHeight),
      skipRefocus,
    );
    setInputChangeFlag(false);
  };

  const handleDecrement = () => {
    const currentValue = Number(inputValue) || DEFAULT_LINE_HEIGHT;
    const newValue = Math.max(MIN_ALLOWED_LINE_HEIGHT, currentValue - LINE_HEIGHT_STEP);
    setInputValue(String(newValue));
    updateLineHeightInSelection(editor, String(newValue));
  };

  const handleIncrement = () => {
    const currentValue = Number(inputValue) || DEFAULT_LINE_HEIGHT;
    const newValue = Math.min(MAX_ALLOWED_LINE_HEIGHT, currentValue + LINE_HEIGHT_STEP);
    setInputValue(String(newValue));
    updateLineHeightInSelection(editor, String(newValue));
  };

  React.useEffect(() => {
    if (selectionLineHeight) {
      setInputValue(selectionLineHeight);
    }
  }, [selectionLineHeight]);

  return (
    <>
      <button
        type="button"
        disabled={
          disabled ||
          (selectionLineHeight !== '' &&
            Number(inputValue) <= MIN_ALLOWED_LINE_HEIGHT)
        }
        onClick={(e) => {
          e.preventDefault();
          handleDecrement();
        }}
        className="toolbar-item line-height-decrement"
        aria-label="Decrease line height"
        title="Decrease line height">
        <i className="format minus-icon" />
      </button>

      <input
        type="number"
        title="Line height"
        value={inputValue}
        disabled={disabled}
        className="toolbar-item line-height-input"
        min={MIN_ALLOWED_LINE_HEIGHT}
        max={MAX_ALLOWED_LINE_HEIGHT}
        step={LINE_HEIGHT_STEP}
        onChange={(e) => setInputValue(e.target.value)}
        onClick={handleClick}
        onKeyDown={handleKeyPress}
        onBlur={handleInputBlur}
      />

      <button
        type="button"
        disabled={
          disabled ||
          (selectionLineHeight !== '' &&
            Number(inputValue) >= MAX_ALLOWED_LINE_HEIGHT)
        }
        onClick={(e) => {
          e.preventDefault();
          handleIncrement();
        }}
        className="toolbar-item line-height-increment"
        aria-label="Increase line height"
        title="Increase line height">
        <i className="format add-icon" />
      </button>
    </>
  );
}

