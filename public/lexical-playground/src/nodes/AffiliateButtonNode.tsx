/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';
import type {JSX} from 'react';

import {
  $applyNodeReplacement,
  DecoratorNode,
} from 'lexical';

import * as React from 'react';

const AffiliateButtonComponent = React.lazy(() => import('./AffiliateButtonComponent'));

export interface AffiliateButtonPayload {
  url: string;
  text: string;
  backgroundColor: string;
  textColor: string;
  size: 'small' | 'medium' | 'large';
  key?: NodeKey;
}

function $convertAffiliateButtonElement(domNode: Node): null | DOMConversionOutput {
  const button = domNode as HTMLAnchorElement | HTMLButtonElement;
  
  if (button.tagName === 'A' || button.tagName === 'BUTTON') {
    const url = button.getAttribute('href') || '';
    const text = button.textContent || 'Click here';
    const backgroundColor = button.style.backgroundColor || '#3b82f6';
    const textColor = button.style.color || '#ffffff';
    const size = button.classList.contains('btn-large') ? 'large' : 
                 button.classList.contains('btn-small') ? 'small' : 'medium';
    
    const node = $createAffiliateButtonNode({ url, text, backgroundColor, textColor, size });
    return {node};
  }
  
  return null;
}

export type SerializedAffiliateButtonNode = Spread<
  {
    url: string;
    text: string;
    backgroundColor: string;
    textColor: string;
    size: 'small' | 'medium' | 'large';
  },
  SerializedLexicalNode
>;

export class AffiliateButtonNode extends DecoratorNode<JSX.Element> {
  __url: string;
  __text: string;
  __backgroundColor: string;
  __textColor: string;
  __size: 'small' | 'medium' | 'large';

  static getType(): string {
    return 'affiliate-button';
  }

  static clone(node: AffiliateButtonNode): AffiliateButtonNode {
    return new AffiliateButtonNode(
      node.__url,
      node.__text,
      node.__backgroundColor,
      node.__textColor,
      node.__size,
      node.__key,
    );
  }

  constructor(
    url: string,
    text: string,
    backgroundColor: string,
    textColor: string,
    size: 'small' | 'medium' | 'large',
    key?: NodeKey,
  ) {
    super(key);
    this.__url = url;
    this.__text = text;
    this.__backgroundColor = backgroundColor;
    this.__textColor = textColor;
    this.__size = size;
  }

  static importJSON(serializedNode: SerializedAffiliateButtonNode): AffiliateButtonNode {
    const {url, text, backgroundColor, textColor, size} = serializedNode;
    const node = $createAffiliateButtonNode({
      url,
      text,
      backgroundColor,
      textColor,
      size,
    });
    return node;
  }

  exportJSON(): SerializedAffiliateButtonNode {
    return {
      url: this.__url,
      text: this.__text,
      backgroundColor: this.__backgroundColor,
      textColor: this.__textColor,
      size: this.__size,
      type: 'affiliate-button',
      version: 1,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span');
    span.style.display = 'inline-block';
    return span;
  }

  updateDOM(): false {
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      a: (node: Node) => ({
        conversion: $convertAffiliateButtonElement,
        priority: 1,
      }),
      button: (node: Node) => ({
        conversion: $convertAffiliateButtonElement,
        priority: 0,
      }),
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('a');
    element.setAttribute('href', this.__url);
    element.textContent = this.__text;
    element.style.backgroundColor = this.__backgroundColor;
    element.style.color = this.__textColor;
    element.style.padding = this.__size === 'small' ? '8px 16px' : 
                           this.__size === 'large' ? '16px 32px' : '12px 24px';
    element.style.borderRadius = '8px';
    element.style.textDecoration = 'none';
    element.style.display = 'inline-block';
    element.style.fontWeight = '600';
    element.style.cursor = 'pointer';
    element.className = `affiliate-button btn-${this.__size}`;
    return {element};
  }

  getURL(): string {
    return this.__url;
  }

  setURL(url: string): void {
    const writable = this.getWritable();
    writable.__url = url;
  }

  getText(): string {
    return this.__text;
  }

  setText(text: string): void {
    const writable = this.getWritable();
    writable.__text = text;
  }

  getBackgroundColor(): string {
    return this.__backgroundColor;
  }

  setBackgroundColor(backgroundColor: string): void {
    const writable = this.getWritable();
    writable.__backgroundColor = backgroundColor;
  }

  getTextColor(): string {
    return this.__textColor;
  }

  setTextColor(textColor: string): void {
    const writable = this.getWritable();
    writable.__textColor = textColor;
  }

  getSize(): 'small' | 'medium' | 'large' {
    return this.__size;
  }

  setSize(size: 'small' | 'medium' | 'large'): void {
    const writable = this.getWritable();
    writable.__size = size;
  }

  decorate(): JSX.Element {
    return (
      <React.Suspense fallback={null}>
        <AffiliateButtonComponent
          url={this.__url}
          text={this.__text}
          backgroundColor={this.__backgroundColor}
          textColor={this.__textColor}
          size={this.__size}
          nodeKey={this.__key}
        />
      </React.Suspense>
    );
  }

  isInline(): boolean {
    return true;
  }
}

export function $createAffiliateButtonNode({
  url = '',
  text = 'Click here',
  backgroundColor = '#3b82f6',
  textColor = '#ffffff',
  size = 'medium',
  key,
}: AffiliateButtonPayload): AffiliateButtonNode {
  return $applyNodeReplacement(
    new AffiliateButtonNode(url, text, backgroundColor, textColor, size, key),
  );
}

export function $isAffiliateButtonNode(
  node: LexicalNode | null | undefined,
): node is AffiliateButtonNode {
  return node instanceof AffiliateButtonNode;
}

