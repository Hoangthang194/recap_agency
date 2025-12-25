/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {JSX} from 'react';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {useLexicalNodeSelection} from '@lexical/react/useLexicalNodeSelection';
import {mergeRegister} from '@lexical/utils';
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  NodeKey,
} from 'lexical';
import {useCallback, useEffect, useRef, useState} from 'react';
import * as React from 'react';

import {$isAffiliateButtonNode, AffiliateButtonNode} from './AffiliateButtonNode';
import useModal from '../hooks/useModal';
import Button from '../ui/Button';
import {DialogActions} from '../ui/Dialog';
import TextInput from '../ui/TextInput';
import DropDown, {DropDownItem} from '../ui/DropDown';

function AffiliateButtonEditor({
  onClose,
  buttonNode,
}: {
  onClose: () => void;
  buttonNode: AffiliateButtonNode;
}): JSX.Element {
  const [url, setUrl] = useState(buttonNode.getURL());
  const [text, setText] = useState(buttonNode.getText());
  const [backgroundColor, setBackgroundColor] = useState(buttonNode.getBackgroundColor());
  const [textColor, setTextColor] = useState(buttonNode.getTextColor());
  const [size, setSize] = useState(buttonNode.getSize());
  const [editor] = useLexicalComposerContext();

  const handleOnConfirm = () => {
    if (url && text) {
      editor.update(() => {
        // Get fresh node reference in update context
        const node = $getNodeByKey(buttonNode.getKey());
        if ($isAffiliateButtonNode(node)) {
          node.setURL(url);
          node.setText(text);
          node.setBackgroundColor(backgroundColor);
          node.setTextColor(textColor);
          node.setSize(size);
        }
      });
      onClose();
    }
  };

  return (
    <>
      <TextInput
        label="Button Text"
        placeholder="Click here"
        onChange={setText}
        value={text}
        data-test-id="affiliate-button-text-input"
      />
      <TextInput
        label="URL"
        placeholder="https://example.com"
        onChange={setUrl}
        value={url}
        data-test-id="affiliate-button-url-input"
      />
      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>Background Color</label>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            style={{ width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>Text Color</label>
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            style={{ width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}
          />
        </div>
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>Size</label>
        <DropDown
          buttonClassName="toolbar-item"
          buttonLabel={size.charAt(0).toUpperCase() + size.slice(1)}
          buttonAriaLabel="Button size">
          <DropDownItem onClick={() => setSize('small')} className="item">
            <span className="text">Small</span>
          </DropDownItem>
          <DropDownItem onClick={() => setSize('medium')} className="item">
            <span className="text">Medium</span>
          </DropDownItem>
          <DropDownItem onClick={() => setSize('large')} className="item">
            <span className="text">Large</span>
          </DropDownItem>
        </DropDown>
      </div>
      <div style={{ marginBottom: '12px', padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Preview:</div>
        <a
          href={url || '#'}
          style={{
            display: 'inline-block',
            padding: size === 'small' ? '8px 16px' : size === 'large' ? '16px 32px' : '12px 24px',
            backgroundColor: backgroundColor,
            color: textColor,
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: size === 'small' ? '14px' : size === 'large' ? '18px' : '16px',
          }}
          onClick={(e) => e.preventDefault()}
        >
          {text || 'Click here'}
        </a>
      </div>
      <DialogActions>
        <Button
          data-test-id="affiliate-button-confirm-btn"
          onClick={handleOnConfirm}
          disabled={!url || !text}>
          Confirm
        </Button>
      </DialogActions>
    </>
  );
}

export default function AffiliateButtonComponent({
  url,
  text,
  backgroundColor,
  textColor,
  size,
  nodeKey,
}: {
  url: string;
  text: string;
  backgroundColor: string;
  textColor: string;
  size: 'small' | 'medium' | 'large';
  nodeKey: NodeKey;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const buttonRef = useRef<HTMLAnchorElement | null>(null);

  const onDelete = useCallback(
    (event: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        event.preventDefault();
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if ($isAffiliateButtonNode(node)) {
            node.remove();
          }
        });
      }
      return false;
    },
    [editor, isSelected, nodeKey],
  );

  const handleEdit = useCallback(() => {
    editor.getEditorState().read(() => {
      const buttonNode = $getNodeByKey(nodeKey) as AffiliateButtonNode;
      if (buttonNode) {
        setIsModalOpen(true);
      }
    });
  }, [editor, nodeKey]);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CLICK_COMMAND,
        (event: MouseEvent) => {
          const buttonElement = buttonRef.current;
          // Check if click is on button or edit button
          const target = event.target as HTMLElement;
          const isEditButton = target.closest('button[title="Edit button"]');
          
          if (isEditButton) {
            // Edit button click is handled by onClick handler
            return false;
          }
          
          if (buttonElement && (event.target === buttonElement || buttonElement.contains(target))) {
            event.preventDefault();
            event.stopPropagation();
            
            if (event.shiftKey) {
              setSelected(!isSelected);
            } else {
              clearSelection();
              setSelected(true);
            }
            if (event.detail === 2) {
              // Double click to edit
              handleEdit();
            }
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [clearSelection, editor, isSelected, nodeKey, onDelete, setSelected, handleEdit]);

  return (
    <>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <a
          ref={buttonRef}
          href={url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: size === 'small' ? '8px 16px' : size === 'large' ? '16px 32px' : '12px 24px',
            backgroundColor: backgroundColor,
            color: textColor,
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: size === 'small' ? '14px' : size === 'large' ? '18px' : '16px',
            cursor: 'pointer',
            outline: isSelected ? '2px solid #3b82f6' : 'none',
            outlineOffset: '2px',
            position: 'relative',
          }}
          onClick={(e) => {
            // Always prevent navigation in editor mode
            e.preventDefault();
            e.stopPropagation();
            
            if (e.detail === 2) {
              // Double click to edit
              handleEdit();
            } else {
              // Single click to select
              // The CLICK_COMMAND handler will handle selection
            }
          }}
          title={isSelected ? 'Double-click to edit, or click edit button' : 'Click to select, double-click to edit'}
        >
          {text || 'Click here'}
        </a>
        {isSelected && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleEdit();
            }}
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: '2px solid white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              padding: 0,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              zIndex: 10,
            }}
            title="Edit button"
          >
            ✎
          </button>
        )}
      </div>
      {isModalOpen && (
        <AffiliateButtonModal
          editor={editor}
          nodeKey={nodeKey}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

function AffiliateButtonModal({
  editor,
  nodeKey,
  onClose,
}: {
  editor: any;
  nodeKey: string;
  onClose: () => void;
}): JSX.Element {
  const [buttonNode, setButtonNode] = useState<AffiliateButtonNode | null>(null);

  useEffect(() => {
    editor.getEditorState().read(() => {
      const node = $getNodeByKey(nodeKey) as AffiliateButtonNode;
      if (node) {
        setButtonNode(node);
      }
    });
  }, [editor, nodeKey]);

  if (!buttonNode) {
    return <></>;
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Edit Affiliate Button</h2>
        <AffiliateButtonEditor
          buttonNode={buttonNode}
          onClose={onClose}
        />
      </div>
    </div>
  );
}

