"use client"

import dynamic from 'next/dynamic';
import '@excalidraw/excalidraw/index.css';

const Excalidraw = dynamic(
  async () => (await import('@excalidraw/excalidraw')).Excalidraw,
  { ssr: false }
);

export default function ExcalidrawWrapper() {
  return <div className="flex-1 border border-border rounded-md overflow-hidden">
  <Excalidraw
    UIOptions={{
        canvasActions: {
            changeViewBackgroundColor: true,
            clearCanvas: true,
            export: { saveFileToDisk: true, as :true, png: true, svg: true },
            loadScene: true,
            toggleTheme: true,
            json: true,
            clipboard: true,
            library: false,
        }
    }}
  />
</div>
}
