/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {JSX} from 'react';

import './ContentEditable.css';

import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$createParagraphNode, $getNearestNodeFromDOMNode, $getRoot} from 'lexical';
import * as React from 'react';

type Props = {
  className?: string;
  placeholderClassName?: string;
  placeholder: string;
};

export default function LexicalContentEditable({
  className,
  placeholder,
  placeholderClassName,
}: Props): JSX.Element {
  const [editor] = useLexicalComposerContext();

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    const rootElement = editor.getRootElement();
    if (!rootElement) {
      return;
    }

    const blocks = Array.from(rootElement.children) as HTMLElement[];
    if (blocks.length === 0) {
      return;
    }

    const clickY = event.clientY;

    // Nếu click nằm trong block hiện có -> để trình duyệt + Lexical xử lý mặc định
    for (const block of blocks) {
      const rect = block.getBoundingClientRect();
      if (clickY >= rect.top && clickY <= rect.bottom) {
        return;
      }
    }

    // Xác định block mục tiêu theo vị trí click
    let targetBlock: HTMLElement | null = null;

    if (clickY < blocks[0].getBoundingClientRect().top) {
      // Click phía trên đoạn đầu -> chọn đoạn đầu
      targetBlock = blocks[0];
    } else if (clickY > blocks[blocks.length - 1].getBoundingClientRect().bottom) {
      // Click dưới đoạn cuối -> đưa caret xuống đoạn cuối (hoặc tạo đoạn mới nếu cần)
      targetBlock = blocks[blocks.length - 1];
    } else {
      // Click giữa hai block -> chọn block phía dưới gần nhất
      for (let i = 0; i < blocks.length - 1; i++) {
        const currentRect = blocks[i].getBoundingClientRect();
        const nextRect = blocks[i + 1].getBoundingClientRect();
        if (clickY > currentRect.bottom && clickY < nextRect.top) {
          targetBlock = blocks[i + 1];
          break;
        }
      }
    }

    if (!targetBlock) {
      return;
    }

    editor.update(() => {
      const root = $getRoot();
      const node = $getNearestNodeFromDOMNode(targetBlock);
      if (!node) {
        // Nếu không map được node thì fallback: thêm đoạn mới ở cuối
        const paragraph = $createParagraphNode();
        root.append(paragraph);
        paragraph.selectStart();
        return;
      }

      const topLevel = node.getTopLevelElementOrThrow();
      // Đưa caret về đầu dòng của block được chọn
      const selectable = topLevel as unknown as {
        selectStart?: () => void;
        select?: () => void;
      };

      if (typeof selectable.selectStart === 'function') {
        selectable.selectStart();
      } else if (typeof selectable.select === 'function') {
        selectable.select();
      }
    });
  };

  return (
    <ContentEditable
      className={className ?? 'ContentEditable__root'}
      aria-placeholder={placeholder}
      onClick={handleClick}
      placeholder={
        <div className={placeholderClassName ?? 'ContentEditable__placeholder'}>
          {placeholder}
        </div>
      }
    />
  );
}
