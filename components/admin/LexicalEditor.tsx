'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

// Bọc Editor gốc bằng shell App để cung cấp đầy đủ LexicalComposerContext
// nhưng App đã được chỉnh lại để bỏ link ngoài lề và chỉ hiển thị editor + toolbar.
const PlaygroundApp = dynamic(
  () => import('@/public/lexical-playground/src/App'),
  { ssr: false },
)

export type LexicalEditorProps = {
  initialHtml?: string
  onChange?: (html: string) => void
  defaultMode?: 'lexical' | 'raw-html'
  rawHtmlFromDb?: string // Raw HTML directly from database, not processed by Lexical
}

type EditorMode = 'lexical' | 'raw-html'

export function LexicalEditor(props: LexicalEditorProps) {
  const [editorMode, setEditorMode] = useState<EditorMode>(props.defaultMode || 'lexical')
  // Use rawHtmlFromDb if available, otherwise fallback to initialHtml
  const [rawHtmlContent, setRawHtmlContent] = useState(
    props.rawHtmlFromDb !== undefined ? props.rawHtmlFromDb : (props.initialHtml || '')
  )

  // Sync rawHtmlContent when rawHtmlFromDb changes (direct from DB)
  useEffect(() => {
    if (props.rawHtmlFromDb !== undefined) {
      // Always use raw HTML from DB when available
      setRawHtmlContent(props.rawHtmlFromDb)
    } else if (props.initialHtml !== undefined) {
      // Fallback to initialHtml if rawHtmlFromDb not provided
      setRawHtmlContent(props.initialHtml)
    }
  }, [props.rawHtmlFromDb, props.initialHtml])

  // Handle raw HTML changes
  const handleRawHtmlChange = (newHtml: string) => {
    setRawHtmlContent(newHtml)
    if (props.onChange) {
      props.onChange(newHtml)
    }
  }

  // When in Raw HTML mode, always use rawHtmlFromDb if available (direct from DB)
  // This ensures we show the original HTML from database, not processed by Lexical
  useEffect(() => {
    if (editorMode === 'raw-html' && props.rawHtmlFromDb !== undefined) {
      // Always use raw HTML from DB when in Raw HTML mode
      setRawHtmlContent(props.rawHtmlFromDb)
    }
  }, [editorMode, props.rawHtmlFromDb])

  // Handle mode switch
  const handleModeSwitch = (mode: EditorMode) => {
    setEditorMode(mode)
    // When switching to raw HTML mode, always use raw HTML from DB (not from Lexical)
    if (mode === 'raw-html') {
      // Always prioritize raw HTML from DB - this is the original HTML from database
      const htmlToUse = props.rawHtmlFromDb !== undefined ? props.rawHtmlFromDb : rawHtmlContent
      setRawHtmlContent(htmlToUse)
      // Don't trigger onChange here - let user edit first
    }
    // When switching to Lexical mode, apply current rawHtmlContent to Lexical
    if (mode === 'lexical' && typeof window !== 'undefined' && (window as any).__lexicalSetHtml) {
      // Use current rawHtmlContent (which may have been edited in Raw HTML mode)
      (window as any).__lexicalSetHtml(rawHtmlContent)
    }
  }

  return (
    <div className="lexical-editor-wrapper">
      {/* Mode Toggle */}
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
        <span className="text-xs font-medium text-gray-600">Editor Mode:</span>
        <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
          <button
            type="button"
            onClick={() => handleModeSwitch('lexical')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              editorMode === 'lexical'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="material-icons-outlined text-sm mr-1 align-middle">edit</span>
            Lexical Editor
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch('raw-html')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              editorMode === 'raw-html'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="material-icons-outlined text-sm mr-1 align-middle">code</span>
            Raw HTML
          </button>
        </div>
      </div>

      {/* Lexical Editor Mode */}
      {editorMode === 'lexical' && (
        <div className="lexical-playground-wrapper">
          <PlaygroundApp 
            initialHtml={props.initialHtml} 
            onChange={props.onChange}
          />
        </div>
      )}

      {/* Raw HTML Editor Mode */}
      {editorMode === 'raw-html' && (
        <div className="raw-html-editor">
          <textarea
            value={rawHtmlContent}
            onChange={(e) => handleRawHtmlChange(e.target.value)}
            className="w-full min-h-[500px] p-4 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-y"
            style={{ fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6' }}
            placeholder="Paste or type your HTML code here. This will be saved directly without Lexical processing."
          />
          <div className="mt-2 text-xs text-gray-500">
            💡 Tip: HTML will be saved as-is without any processing. Perfect for custom HTML with scripts, event handlers, etc.
          </div>
        </div>
      )}
    </div>
  )
}

