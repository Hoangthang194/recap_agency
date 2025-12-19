import { NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET() {
  try {
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    
    // Check if uploads directory exists
    if (!existsSync(uploadsDir)) {
      return NextResponse.json(
        {
          success: true,
          data: [],
          count: 0,
        },
        { status: 200 }
      )
    }

    // Read all files in uploads directory
    const files = await readdir(uploadsDir)
    
    // Filter only image files
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    const imageFiles = files
      .filter(file => {
        const ext = file.toLowerCase().substring(file.lastIndexOf('.'))
        return imageExtensions.includes(ext)
      })
      .map(file => ({
        fileName: file,
        url: `/uploads/${file}`,
        path: join(uploadsDir, file),
      }))
      .sort((a, b) => {
        // Sort by filename (newest first based on timestamp in filename)
        return b.fileName.localeCompare(a.fileName)
      })

    return NextResponse.json(
      {
        success: true,
        data: imageFiles,
        count: imageFiles.length,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error listing uploaded files:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to list uploaded files',
      },
      { status: 500 }
    )
  }
}

