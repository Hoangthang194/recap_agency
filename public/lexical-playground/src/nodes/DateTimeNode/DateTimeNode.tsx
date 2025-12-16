/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {JSX} from 'react';

import {
  DecoratorNode,
  DOMConversionOutput,
  DOMExportOutput,
  LexicalNode,
  SerializedLexicalNode,
  Spread,
} from 'lexical';
// Stub for state config system (not available in current Lexical version)
const createState = (_name: string, _config: any) => ({});
const $getState = (_node: any, _state: any) => null;
const $setState = (_node: any, _state: any, _value: any) => _node;
const buildImportMap = (map: any) => map;
type StateConfigValue<T> = Date;
type StateValueOrUpdater<T> = Date | ((prev: Date) => Date);
import * as React from 'react';

const DateTimeComponent = React.lazy(() => import('./DateTimeComponent'));

const getDateTimeText = (dateTime: Date | undefined) => {
  if (dateTime === undefined || !(dateTime instanceof Date) || isNaN(dateTime.getTime())) {
    return '';
  }
  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();
  return (
    dateTime.toDateString() +
    (hours === 0 && minutes === 0
      ? ''
      : ` ${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}`)
  );
};

export type SerializedDateTimeNode = Spread<
  {
    dateTime?: string;
  },
  SerializedLexicalNode
>;

function $convertDateTimeElement(
  domNode: HTMLElement,
): DOMConversionOutput | null {
  const dateTimeValue = domNode.getAttribute('data-lexical-datetime');
  if (dateTimeValue) {
    const node = $createDateTimeNode(new Date(Date.parse(dateTimeValue)));
    return {node};
  }
  const gDocsDateTimePayload = domNode.getAttribute('data-rich-links');
  if (!gDocsDateTimePayload) {
    return null;
  }
  const parsed = JSON.parse(gDocsDateTimePayload);
  const parsedDate = Date.parse(parsed?.dat_df?.dfie_dt || '');
  if (isNaN(parsedDate)) {
    return null;
  }
  const node = $createDateTimeNode(new Date(parsedDate));
  return {node};
}

export class DateTimeNode extends DecoratorNode<JSX.Element> {
  __dateTime: Date | undefined;

  static getType(): string {
    return 'datetime';
  }

  static clone(node: DateTimeNode): DateTimeNode {
    return new DateTimeNode(node.__dateTime);
  }

  static importJSON(serializedNode: SerializedDateTimeNode): DateTimeNode {
    const {dateTime} = serializedNode;
    const node = $createDateTimeNode(
      dateTime ? new Date(dateTime) : new Date(),
    );
    return node;
  }

  static importDOM() {
    return {
      span: (domNode: HTMLElement) => {
        if (
          domNode.getAttribute('data-lexical-datetime') !== null ||
          // GDocs Support
          (domNode.getAttribute('data-rich-links') !== null &&
            JSON.parse(domNode.getAttribute('data-rich-links') || '{}').type ===
              'date')
        ) {
          return {
                conversion: $convertDateTimeElement,
            priority: 2 as 0 | 1 | 2 | 3 | 4,
          };
        }
        return null;
      },
    };
  }

  constructor(dateTime?: Date) {
    super();
    this.__dateTime = dateTime;
  }

  exportJSON(): SerializedDateTimeNode {
    return {
      dateTime: this.__dateTime?.toISOString(),
      type: 'datetime',
      version: 1,
    };
  }

  getDateTime(): Date | undefined {
    return this.__dateTime;
  }

  setDateTime(valueOrUpdater: Date | ((prev: Date | undefined) => Date)): this {
    const writable = this.getWritable();
    if (typeof valueOrUpdater === 'function') {
      writable.__dateTime = valueOrUpdater(this.__dateTime);
    } else {
      writable.__dateTime = valueOrUpdater;
    }
    return this;
  }

  getTextContent(): string {
    const dateTime = this.getDateTime();
    return getDateTimeText(dateTime);
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('span');
    element.textContent = getDateTimeText(this.getDateTime());
    element.setAttribute(
      'data-lexical-datetime',
      this.getDateTime()?.toString() || '',
    );
    return {element};
  }

  createDOM(): HTMLElement {
    const element = document.createElement('span');
    element.setAttribute(
      'data-lexical-datetime',
      this.getDateTime()?.toString() || '',
    );
    element.style.display = 'inline-block';
    return element;
  }

  updateDOM(): false {
    return false;
  }

  isInline(): boolean {
    return true;
  }

  decorate(): JSX.Element {
    return (
      <DateTimeComponent dateTime={this.getDateTime()} nodeKey={this.__key} />
    );
  }
}

export function $createDateTimeNode(dateTime: Date): DateTimeNode {
  return new DateTimeNode().setDateTime(dateTime);
}

export function $isDateTimeNode(
  node: LexicalNode | null | undefined,
): node is DateTimeNode {
  return node instanceof DateTimeNode;
}
