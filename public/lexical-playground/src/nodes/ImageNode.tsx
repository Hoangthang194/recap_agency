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
  LexicalEditor,
  LexicalNode,
  NodeKey,
  RangeSelection,
  SerializedEditor,
  SerializedLexicalNode,
  Spread,
} from 'lexical';
import type {JSX} from 'react';

import {$insertGeneratedNodes} from '@lexical/clipboard';
import {HashtagNode} from '@lexical/hashtag';
import {$generateHtmlFromNodes, $generateNodesFromDOM} from '@lexical/html';
import {LinkNode} from '@lexical/link';
import {
  $applyNodeReplacement,
  $createRangeSelection,
  $getEditor,
  $getRoot,
  $isElementNode,
  $isParagraphNode,
  $selectAll,
  $setSelection,
  createEditor,
  DecoratorNode,
  LineBreakNode,
  ParagraphNode,
  RootNode,
  TextNode,
} from 'lexical';

// Stub for non-existent Lexical APIs
const SKIP_DOM_SELECTION_TAG = 'skip-dom-selection';
import * as React from 'react';

import {EmojiNode} from './EmojiNode';
import {KeywordNode} from './KeywordNode';

const ImageComponent = React.lazy(() => import('./ImageComponent'));

export interface ImagePayload {
  altText: string;
  caption?: LexicalEditor;
  height?: number;
  key?: NodeKey;
  maxWidth?: number;
  showCaption?: boolean;
  src: string;
  width?: number;
  captionsEnabled?: boolean;
}

function isGoogleDocCheckboxImg(img: HTMLImageElement): boolean {
  return (
    img.parentElement != null &&
    img.parentElement.tagName === 'LI' &&
    img.previousSibling === null &&
    img.getAttribute('aria-roledescription') === 'checkbox'
  );
}

function $convertImageElement(domNode: Node): null | DOMConversionOutput {
  const img = domNode as HTMLImageElement;
  const src = img.getAttribute('src');
  if (!src || src.startsWith('file:///') || isGoogleDocCheckboxImg(img)) {
    return null;
  }
  const {alt: altText, width, height} = img;
  const node = $createImageNode({altText, height, src, width});
  return {node};
}

export function $isCaptionEditorEmpty(): boolean {
  // Check if editor is empty by examining root children
  // Stub: $extendCaretToRange and $getChildCaret are not available in current Lexical version
  const root = $getRoot();
  const children = root.getChildren();
  
  // If no children, editor is empty
  if (children.length === 0) {
    return true;
  }
  
  // Check if all children are empty element nodes
  for (const child of children) {
    if (!$isElementNode(child)) {
      return false;
    }
    // If element has text content, it's not empty
    if (child.getTextContent().trim().length > 0) {
      return false;
    }
  }
  return true;
}

export type SerializedImageNode = Spread<
  {
    altText: string;
    caption: SerializedEditor;
    height?: number;
    maxWidth: number;
    showCaption: boolean;
    src: string;
    width?: number;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __width: 'inherit' | number;
  __height: 'inherit' | number;
  __maxWidth: number;
  __showCaption: boolean;
  __caption: LexicalEditor;
  // Captions cannot yet be used within editor cells
  __captionsEnabled: boolean;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__maxWidth,
      node.__width,
      node.__height,
      node.__showCaption,
      node.__caption,
      node.__captionsEnabled,
      node.__key,
    );
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const {altText, height, width, maxWidth, src, showCaption, caption} = serializedNode;
    const node = $createImageNode({
      altText,
      height,
      maxWidth,
      showCaption,
      src,
      width,
    });
    
    // Handle caption if present
    if (caption && node.__caption) {
      const nestedEditor = node.__caption;
      const editorState = nestedEditor.parseEditorState(caption.editorState);
      if (!editorState.isEmpty()) {
        nestedEditor.setEditorState(editorState);
      }
    }
    
    return node;
  }

  exportDOM(): DOMExportOutput {
    if (typeof document === 'undefined') {
      // Return a minimal element structure for SSR
      return {element: null};
    }
    const imgElement = document.createElement('img');
    imgElement.setAttribute('src', this.__src);
    imgElement.setAttribute('alt', this.__altText);
    imgElement.setAttribute('width', this.__width.toString());
    imgElement.setAttribute('height', this.__height.toString());

    if (this.__showCaption && this.__caption) {
      const captionEditor = this.__caption;
      const captionHtml = captionEditor.read(() => {
        if ($isCaptionEditorEmpty()) {
          return null;
        }
        // Don't serialize the wrapping paragraph if there is only one
        let selection: null | RangeSelection = null;
        const firstChild = $getRoot().getFirstChild();
        if (
          $isParagraphNode(firstChild) &&
          firstChild.getNextSibling() === null
        ) {
          selection = $createRangeSelection();
          selection.anchor.set(firstChild.getKey(), 0, 'element');
          selection.focus.set(
            firstChild.getKey(),
            firstChild.getChildrenSize(),
            'element',
          );
        }
        return $generateHtmlFromNodes(captionEditor, selection);
      });
      if (captionHtml) {
        const figureElement = document.createElement('figure');
        const figcaptionElement = document.createElement('figcaption');
        figcaptionElement.innerHTML = captionHtml;

        figureElement.appendChild(imgElement);
        figureElement.appendChild(figcaptionElement);

        return {element: figureElement};
      }
    }

    return {element: imgElement};
  }

  static importDOM(): DOMConversionMap | null {
    return {
      figcaption: () => ({
        conversion: () => ({node: null}),
        priority: 0,
      }),
      figure: () => ({
        conversion: (node) => {
          return {
            after: (childNodes) => {
              const imageNodes = childNodes.filter($isImageNode);
              const figcaption = node.querySelector('figcaption');
              if (figcaption) {
                for (const imgNode of imageNodes) {
                  imgNode.setShowCaption(true);
                  imgNode.__caption.update(
                    () => {
                      const editor = $getEditor();
                      // $generateNodesFromDOM expects Document, but we have HTMLElement
                      // Create a temporary document and clone the figcaption into it
                      if (typeof document !== 'undefined' && figcaption) {
                        const tempDoc = document.implementation.createHTMLDocument('');
                        const clonedFigcaption = figcaption.cloneNode(true) as HTMLElement;
                        tempDoc.body.appendChild(clonedFigcaption);
                        const nodes = $generateNodesFromDOM(editor, tempDoc);
                        $insertGeneratedNodes(
                          editor,
                          nodes,
                          $selectAll(),
                        );
                        $setSelection(null);
                      }
                    },
                    {tag: SKIP_DOM_SELECTION_TAG},
                  );
                }
              }
              return imageNodes;
            },
            node: null,
          };
        },
        priority: 0,
      }),
      img: () => ({
        conversion: $convertImageElement,
        priority: 0,
      }),
    };
  }

  constructor(
    src: string,
    altText: string,
    maxWidth: number,
    width?: 'inherit' | number,
    height?: 'inherit' | number,
    showCaption?: boolean,
    caption?: LexicalEditor,
    captionsEnabled?: boolean,
    key?: NodeKey,
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__maxWidth = maxWidth;
    this.__width = width || 'inherit';
    this.__height = height || 'inherit';
    this.__showCaption = showCaption || false;
    this.__caption =
      caption ||
      createEditor({
        namespace: 'Playground/ImageNodeCaption',
        nodes: [
          RootNode,
          TextNode,
          LineBreakNode,
          ParagraphNode,
          LinkNode,
          EmojiNode,
          HashtagNode,
          KeywordNode,
        ],
      });
    this.__captionsEnabled = captionsEnabled || captionsEnabled === undefined;
  }

  exportJSON(): SerializedImageNode {
    return {
      ...super.exportJSON(),
      altText: this.getAltText(),
      caption: this.__caption.toJSON(),
      height: this.__height === 'inherit' ? 0 : this.__height,
      maxWidth: this.__maxWidth,
      showCaption: this.__showCaption,
      src: this.getSrc(),
      width: this.__width === 'inherit' ? 0 : this.__width,
    };
  }

  setWidthAndHeight(
    width: 'inherit' | number,
    height: 'inherit' | number,
  ): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  setShowCaption(showCaption: boolean): void {
    const writable = this.getWritable();
    writable.__showCaption = showCaption;
  }

  // View

  createDOM(config: EditorConfig): HTMLElement {
    if (typeof document === 'undefined') {
      // Return a minimal element structure for SSR
      return {} as HTMLElement;
    }
    const span = document.createElement('span');
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM(): false {
    return false;
  }

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText;
  }

  decorate(): JSX.Element {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        height={this.__height}
        maxWidth={this.__maxWidth}
        nodeKey={this.getKey()}
        showCaption={this.__showCaption}
        caption={this.__caption}
        captionsEnabled={this.__captionsEnabled}
        resizable={true}
      />
    );
  }
}

export function $createImageNode({
  altText,
  height,
  maxWidth = 500,
  captionsEnabled,
  src,
  width,
  showCaption,
  caption,
  key,
}: ImagePayload): ImageNode {
  return $applyNodeReplacement(
    new ImageNode(
      src,
      altText,
      maxWidth,
      width,
      height,
      showCaption,
      caption,
      captionsEnabled,
      key,
    ),
  );
}

export function $isImageNode(
  node: LexicalNode | null | undefined,
): node is ImageNode {
  return node instanceof ImageNode;
}
