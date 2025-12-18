'use client'

import dynamic from 'next/dynamic'

// Bọc Editor gốc bằng shell App để cung cấp đầy đủ LexicalComposerContext
// nhưng App đã được chỉnh lại để bỏ link ngoài lề và chỉ hiển thị editor + toolbar.
const PlaygroundApp = dynamic(
  () => import('@/public/lexical-playground/src/App'),
  { ssr: false },
)

export type LexicalEditorProps = {
  initialHtml?: string
  onChange?: (html: string) => void
}

export function LexicalEditor(_props: LexicalEditorProps) {
  return (
    <div className="lexical-playground-wrapper">
      <PlaygroundApp />
    </div>
  )
}

