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
type StateConfigValue<T> = T extends { parse: (v: any) => infer R } ? R : any;
type StateValueOrUpdater<T> = T | ((prev: T) => T);
import * as React from 'react';

export type Options = ReadonlyArray<Option>;

export type Option = Readonly<{
  text: string;
  uid: string;
  votes: Array<string>;
}>;

const PollComponent = React.lazy(() => import('./PollComponent'));

function createUID(): string {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substring(0, 5);
}

export function createPollOption(text = ''): Option {
  return {
    text,
    uid: createUID(),
    votes: [],
  };
}

function cloneOption(
  option: Option,
  text: string,
  votes?: Array<string>,
): Option {
  return {
    text,
    uid: option.uid,
    votes: votes || Array.from(option.votes),
  };
}

export type SerializedPollNode = Spread<
  {
    question: string;
    options: Options;
  },
  SerializedLexicalNode
>;

function $convertPollElement(
  domNode: HTMLSpanElement,
): DOMConversionOutput | null {
  const question = domNode.getAttribute('data-lexical-poll-question');
  const options = domNode.getAttribute('data-lexical-poll-options');
  if (question !== null && options !== null) {
    const node = $createPollNode(question, JSON.parse(options));
    return {node};
  }
  return null;
}

function parseOptions(json: unknown): Options {
  const options = [];
  if (Array.isArray(json)) {
    for (const row of json) {
      if (
        row &&
        typeof row.text === 'string' &&
        typeof row.uid === 'string' &&
        Array.isArray(row.votes) &&
        row.votes.every((v: unknown) => typeof v === 'string')
      ) {
        options.push(row);
      }
    }
  }
  return options;
}

export class PollNode extends DecoratorNode<JSX.Element> {
  __question: string;
  __options: Options;

  static getType(): string {
    return 'poll';
  }

  static clone(node: PollNode): PollNode {
    return new PollNode(node.__question, node.__options);
  }

  static importJSON(serializedNode: SerializedPollNode): PollNode {
    const {question, options} = serializedNode;
    return $createPollNode(question || '', parseOptions(options || []));
  }

  static importDOM() {
    return {
      span: (domNode: HTMLElement) => {
        if (domNode.getAttribute('data-lexical-poll-question') !== null) {
          return {
                conversion: $convertPollElement,
            priority: 2 as 0 | 1 | 2 | 3 | 4,
          };
        }
        return null;
      },
    };
  }

  constructor(question: string = '', options: Options = []) {
    super();
    this.__question = question;
    this.__options = options;
  }

  exportJSON(): SerializedPollNode {
    return {
      question: this.__question,
      options: this.__options,
      type: 'poll',
      version: 1,
    };
  }

  getQuestion(): string {
    return this.__question;
  }

  setQuestion(valueOrUpdater: string | ((prev: string) => string)): this {
    const writable = this.getWritable();
    if (typeof valueOrUpdater === 'function') {
      writable.__question = valueOrUpdater(this.__question);
    } else {
      writable.__question = valueOrUpdater;
  }
    return this;
  }

  getOptions(): Options {
    return this.__options;
  }

  setOptions(valueOrUpdater: Options | ((prev: Options) => Options)): this {
    const writable = this.getWritable();
    if (typeof valueOrUpdater === 'function') {
      writable.__options = valueOrUpdater(this.__options);
    } else {
      writable.__options = valueOrUpdater;
    }
    return this;
  }

  addOption(option: Option): this {
    return this.setOptions((options: Options) => [...options, option]);
  }

  deleteOption(option: Option): this {
    return this.setOptions((prevOptions: Options) => {
      const index = prevOptions.indexOf(option);
      if (index === -1) {
        return prevOptions;
      }
      const options = Array.from(prevOptions);
      options.splice(index, 1);
      return options;
    });
  }

  setOptionText(option: Option, text: string): this {
    return this.setOptions((prevOptions: Options) => {
      const clonedOption = cloneOption(option, text);
      const options = Array.from(prevOptions);
      const index = options.indexOf(option);
      options[index] = clonedOption;
      return options;
    });
  }

  toggleVote(option: Option, username: string): this {
    return this.setOptions((prevOptions: Options) => {
      const index = prevOptions.indexOf(option);
      if (index === -1) {
        return prevOptions;
      }
      const votes = option.votes;
      const votesClone = Array.from(votes);
      const voteIndex = votes.indexOf(username);
      if (voteIndex === -1) {
        votesClone.push(username);
      } else {
        votesClone.splice(voteIndex, 1);
      }
      const clonedOption = cloneOption(option, option.text, votesClone);
      const options = Array.from(prevOptions);
      options[index] = clonedOption;
      return options;
    });
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('span');
    element.setAttribute('data-lexical-poll-question', this.getQuestion());
    element.setAttribute(
      'data-lexical-poll-options',
      JSON.stringify(this.getOptions()),
    );
    return {element};
  }

  createDOM(): HTMLElement {
    const elem = document.createElement('span');
    elem.style.display = 'inline-block';
    return elem;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): JSX.Element {
    return (
      <PollComponent
        question={this.getQuestion()}
        options={this.getOptions()}
        nodeKey={this.__key}
      />
    );
  }
}

export function $createPollNode(question: string, options: Options): PollNode {
  return new PollNode(question, options);
}

export function $isPollNode(
  node: LexicalNode | null | undefined,
): node is PollNode {
  return node instanceof PollNode;
}
