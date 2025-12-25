/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {JSX} from 'react';

// Stub implementation for katex
// This provides a minimal implementation to prevent module resolution errors
const katex = {
  render: (equation: string, element: HTMLElement, options?: any) => {
    // Display equation as plain text instead of rendering LaTeX
    element.textContent = equation;
    element.style.fontFamily = 'monospace';
    element.style.backgroundColor = '#f0f0f0';
    element.style.padding = '2px 4px';
    element.style.borderRadius = '3px';
    if (options?.displayMode) {
      element.style.display = 'block';
      element.style.margin = '8px 0';
    }
  },
};
import * as React from 'react';
import {useEffect, useRef} from 'react';

export default function KatexRenderer({
  equation,
  inline,
  onDoubleClick,
}: Readonly<{
  equation: string;
  inline: boolean;
  onDoubleClick: () => void;
}>): JSX.Element {
  const katexElementRef = useRef(null);

  useEffect(() => {
    const katexElement = katexElementRef.current;

    if (katexElement !== null) {
      katex.render(equation, katexElement, {
        displayMode: !inline, // true === block display //
        errorColor: '#cc0000',
        output: 'html',
        strict: 'warn',
        throwOnError: false,
        trust: false,
      });
    }
  }, [equation, inline]);

  return (
    // We use an empty image tag either side to ensure Android doesn't try and compose from the
    // inner text from Katex. There didn't seem to be any other way of making this work,
    // without having a physical space.
    <>
      <img
        src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        width="0"
        height="0"
        alt=""
      />
      <span
        role="button"
        tabIndex={-1}
        onDoubleClick={onDoubleClick}
        ref={katexElementRef}
      />
      <img
        src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        width="0"
        height="0"
        alt=""
      />
    </>
  );
}
