/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {JSX} from 'react';

import {
  $isAutoLinkNode,
  $isLinkNode,
  LinkNode,
  TOGGLE_LINK_COMMAND,
} from '@lexical/link';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {
  $findMatchingParent,
  $wrapNodeInElement,
  mergeRegister,
} from '@lexical/utils';
import {
  $createParagraphNode,
  $createRangeSelection,
  $getSelection,
  $insertNodes,
  $isNodeSelection,
  $isRootOrShadowRoot,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  createCommand,
  DRAGOVER_COMMAND,
  DRAGSTART_COMMAND,
  DROP_COMMAND,
  getDOMSelection,
  isHTMLElement,
  LexicalCommand,
  LexicalEditor,
} from 'lexical';
import {useEffect, useRef, useState} from 'react';
import * as React from 'react';

import landscapeImage from '../../images/landscape.jpg';
import yellowFlowerImage from '../../images/yellow-flower.jpg';
import {
  $createImageNode,
  $isImageNode,
  ImageNode,
  ImagePayload,
} from '../../nodes/ImageNode';
import Button from '../../ui/Button';
import {DialogActions, DialogButtonsList} from '../../ui/Dialog';
import FileInput from '../../ui/FileInput';
import TextInput from '../../ui/TextInput';

export type InsertImagePayload = Readonly<ImagePayload>;

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand('INSERT_IMAGE_COMMAND');

export function InsertImageUriDialogBody({
  onClick,
}: {
  onClick: (payload: InsertImagePayload) => void;
}) {
  const [src, setSrc] = useState('');
  const [altText, setAltText] = useState('');

  const isDisabled = src === '';

  return (
    <>
      <TextInput
        label="Image URL"
        placeholder="i.e. https://source.unsplash.com/random"
        onChange={setSrc}
        value={src}
        data-test-id="image-modal-url-input"
      />
      <TextInput
        label="Alt Text"
        placeholder="Random unsplash image"
        onChange={setAltText}
        value={altText}
        data-test-id="image-modal-alt-text-input"
      />
      <DialogActions>
        <Button
          data-test-id="image-modal-confirm-btn"
          disabled={isDisabled}
          onClick={() => onClick({altText, src})}>
          Confirm
        </Button>
      </DialogActions>
    </>
  );
}

export function InsertImageUploadedDialogBody({
  onClick,
}: {
  onClick: (payload: InsertImagePayload) => void;
}) {
  const [src, setSrc] = useState('');
  const [altText, setAltText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<Array<{ fileName: string; url: string; path: string }>>([]);
  const [loadingImages, setLoadingImages] = useState(false);

  const isDisabled = src === '' || isUploading;

  // Load uploaded images
  const loadUploadedImages = async () => {
    setLoadingImages(true);
    try {
      const response = await fetch('/api/upload/list');
      const result = await response.json();
      if (result.success) {
        setUploadedImages(result.data || []);
      }
    } catch (err) {
      console.error('Error loading uploaded images:', err);
    } finally {
      setLoadingImages(false);
    }
  };

  const uploadImage = async (file: File) => {
    setIsUploading(true);
    setUploadError('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      const imageUrl = result.url;
      
      if (imageUrl) {
        const finalAltText = altText || file.name.replace(/\.[^/.]+$/, '');
        setSrc(imageUrl);
        // Refresh uploaded images list if picker is open
        if (showImagePicker) {
          loadUploadedImages();
        }
        // Auto-insert image into editor after successful upload
        onClick({altText: finalAltText, src: imageUrl});
      } else {
        throw new Error('No image URL returned from server');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Không thể upload ảnh. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
    }
  };

  const selectUploadedImage = (imgUrl: string, imgFileName: string) => {
    setSrc(imgUrl);
    if (!altText) {
      setAltText(imgFileName.replace(/\.[^/.]+$/, ''));
    }
    setShowImagePicker(false);
  };

  const loadImage = (files: FileList | null) => {
    if (files !== null && files.length > 0) {
      const file = files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError('File không phải là ảnh hợp lệ');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File ảnh không được lớn hơn 5MB');
        return;
      }
      
      // Set alt text from file name if not set
      if (!altText) {
        setAltText(file.name.replace(/\.[^/.]+$/, '')); // Remove extension
      }
      
      // Upload file immediately
      uploadImage(file);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <FileInput
            label="Upload Ảnh"
            onChange={loadImage}
            accept="image/*"
            data-test-id="image-modal-file-upload"
          />
        </div>
        <Button
          onClick={() => {
            setShowImagePicker(true);
            loadUploadedImages();
          }}>
          Chọn Ảnh Đã Upload
        </Button>
      </div>
      {isUploading && (
        <div style={{ padding: '10px', textAlign: 'center', color: '#666' }}>
          Đang upload ảnh...
        </div>
      )}
      {uploadError && (
        <div style={{ padding: '10px', color: '#d32f2f', fontSize: '14px' }}>
          {uploadError}
        </div>
      )}
      {src && !isUploading && (
        <div style={{ padding: '10px', textAlign: 'center' }}>
          <img 
            src={src} 
            alt="Preview" 
            style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }}
          />
        </div>
      )}
      <TextInput
        label="Alt Text"
        placeholder="Mô tả ảnh"
        onChange={setAltText}
        value={altText}
        data-test-id="image-modal-alt-text-input"
      />
      <DialogActions>
        <Button
          data-test-id="image-modal-file-upload-btn"
          disabled={isDisabled}
          onClick={() => onClick({altText, src})}>
          {isUploading ? 'Đang upload...' : 'Chèn Ảnh'}
        </Button>
      </DialogActions>

      {/* Image Picker Modal */}
      {showImagePicker && (
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
          onClick={() => setShowImagePicker(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              maxWidth: '800px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>Chọn Ảnh Đã Upload</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Button
                  onClick={loadUploadedImages}
                  disabled={loadingImages}
                  small>
                  Làm mới
                </Button>
                <button
                  onClick={() => setShowImagePicker(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '24px', padding: '0', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  ×
                </button>
              </div>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              {loadingImages ? (
                <div style={{ textAlign: 'center', padding: '48px' }}>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Đang tải danh sách ảnh...</div>
                </div>
              ) : uploadedImages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px' }}>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Chưa có ảnh nào được upload</div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '16px' }}>
                  {uploadedImages.map((img) => (
                    <div
                      key={img.fileName}
                      onClick={() => selectUploadedImage(img.url, img.fileName)}
                      style={{
                        position: 'relative',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: src === img.url ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        if (src !== img.url) {
                          e.currentTarget.style.borderColor = '#3b82f6';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (src !== img.url) {
                          e.currentTarget.style.borderColor = '#e5e7eb';
                        }
                      }}
                    >
                      <div style={{ aspectRatio: '1', backgroundColor: '#f3f4f6' }}>
                        <img
                          src={img.url}
                          alt={img.fileName}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      {src === img.url && (
                        <div style={{ position: 'absolute', top: '8px', right: '8px', color: '#3b82f6', backgroundColor: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                          ✓
                        </div>
                      )}
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', padding: '8px' }}>
                        <p style={{ fontSize: '11px', color: 'white', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img.fileName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                onClick={() => setShowImagePicker(false)}>
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function InsertImageDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
}): JSX.Element {
  const [mode, setMode] = useState<null | 'url' | 'file'>(null);
  const hasModifier = useRef(false);

  useEffect(() => {
    hasModifier.current = false;
    const handler = (e: KeyboardEvent) => {
      hasModifier.current = e.altKey;
    };
    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', handler);
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('keydown', handler);
      }
    };
  }, [activeEditor]);

  const onClick = (payload: InsertImagePayload) => {
    activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
    onClose();
  };

  return (
    <>
      {!mode && (
        <DialogButtonsList>
          <Button
            data-test-id="image-modal-option-sample"
            onClick={() =>
              onClick(
                hasModifier.current
                  ? {
                      altText:
                        'Daylight fir trees forest glacier green high ice landscape',
                      src: typeof landscapeImage === 'string' ? landscapeImage : (landscapeImage as any).src || '',
                    }
                  : {
                      altText: 'Yellow flower in tilt shift lens',
                      src: typeof yellowFlowerImage === 'string' ? yellowFlowerImage : (yellowFlowerImage as any).src || '',
                    },
              )
            }>
            Sample
          </Button>
          <Button
            data-test-id="image-modal-option-url"
            onClick={() => setMode('url')}>
            URL
          </Button>
          <Button
            data-test-id="image-modal-option-file"
            onClick={() => setMode('file')}>
            File
          </Button>
        </DialogButtonsList>
      )}
      {mode === 'url' && <InsertImageUriDialogBody onClick={onClick} />}
      {mode === 'file' && <InsertImageUploadedDialogBody onClick={onClick} />}
    </>
  );
}

export default function ImagesPlugin({
  captionsEnabled,
}: {
  captionsEnabled?: boolean;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagesPlugin: ImageNode not registered on editor');
    }

    return mergeRegister(
      editor.registerCommand<InsertImagePayload>(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const imageNode = $createImageNode(payload);
          $insertNodes([imageNode]);
          if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand<DragEvent>(
        DRAGSTART_COMMAND,
        (event) => {
          return $onDragStart(event);
        },
        COMMAND_PRIORITY_HIGH,
      ),
      editor.registerCommand<DragEvent>(
        DRAGOVER_COMMAND,
        (event) => {
          return $onDragover(event);
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand<DragEvent>(
        DROP_COMMAND,
        (event) => {
          return $onDrop(event, editor);
        },
        COMMAND_PRIORITY_HIGH,
      ),
    );
  }, [captionsEnabled, editor]);

  return null;
}

const TRANSPARENT_IMAGE =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
// Only create img element in browser environment
const img = typeof document !== 'undefined' ? document.createElement('img') : null;
if (img) {
  img.src = TRANSPARENT_IMAGE;
}

function $onDragStart(event: DragEvent): boolean {
  const node = $getImageNodeInSelection();
  if (!node) {
    return false;
  }
  const dataTransfer = event.dataTransfer;
  if (!dataTransfer) {
    return false;
  }
  dataTransfer.setData('text/plain', '_');
  if (img) {
    dataTransfer.setDragImage(img, 0, 0);
  }
  dataTransfer.setData(
    'application/x-lexical-drag',
    JSON.stringify({
      data: {
        altText: node.__altText,
        caption: node.__caption,
        height: node.__height,
        key: node.getKey(),
        maxWidth: node.__maxWidth,
        showCaption: node.__showCaption,
        src: node.__src,
        width: node.__width,
      },
      type: 'image',
    }),
  );

  return true;
}

function $onDragover(event: DragEvent): boolean {
  const node = $getImageNodeInSelection();
  if (!node) {
    return false;
  }
  if (!canDropImage(event)) {
    event.preventDefault();
  }
  return true;
}

function $onDrop(event: DragEvent, editor: LexicalEditor): boolean {
  const node = $getImageNodeInSelection();
  if (!node) {
    return false;
  }
  const data = getDragImageData(event);
  if (!data) {
    return false;
  }
  const existingLink = $findMatchingParent(
    node,
    (parent): parent is LinkNode =>
      !$isAutoLinkNode(parent) && $isLinkNode(parent),
  );
  event.preventDefault();
  if (canDropImage(event)) {
    const range = getDragSelection(event);
    node.remove();
    const rangeSelection = $createRangeSelection();
    if (range !== null && range !== undefined) {
      rangeSelection.applyDOMRange(range);
    }
    $setSelection(rangeSelection);
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, data);
    if (existingLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, existingLink.getURL());
    }
  }
  return true;
}

function $getImageNodeInSelection(): ImageNode | null {
  const selection = $getSelection();
  if (!$isNodeSelection(selection)) {
    return null;
  }
  const nodes = selection.getNodes();
  const node = nodes[0];
  return $isImageNode(node) ? node : null;
}

function getDragImageData(event: DragEvent): null | InsertImagePayload {
  const dragData = event.dataTransfer?.getData('application/x-lexical-drag');
  if (!dragData) {
    return null;
  }
  const {type, data} = JSON.parse(dragData);
  if (type !== 'image') {
    return null;
  }

  return data;
}

declare global {
  interface DragEvent {
    rangeOffset?: number;
    rangeParent?: Node;
  }
}

function canDropImage(event: DragEvent): boolean {
  const target = event.target;
  return !!(
    isHTMLElement(target) &&
    !target.closest('code, span.editor-image') &&
    isHTMLElement(target.parentElement) &&
    target.parentElement.closest('div.ContentEditable__root')
  );
}

function getDragSelection(event: DragEvent): Range | null | undefined {
  let range;
  // Stub: getDOMSelectionFromTarget doesn't exist, use getDOMSelection instead
  const domSelection = typeof window !== 'undefined' ? getDOMSelection(window) : null;
  if (typeof document !== 'undefined' && document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(event.clientX, event.clientY);
  } else if (event.rangeParent && domSelection !== null) {
    domSelection.collapse(event.rangeParent, event.rangeOffset || 0);
    range = domSelection.getRangeAt(0);
  } else {
    throw Error(`Cannot get the selection when dragging`);
  }

  return range;
}
