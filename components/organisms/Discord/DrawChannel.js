// Draw Channel Component (Excalidraw simulation)
import { useState, useEffect } from "react"
import {
    Edit3,
} from "lucide-react"
import ExcalidrawWrapper from '@/components/Excalidraw/excalidraw';

export default function DrawChannel({ channel }) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b bg-muted/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Drawing Board: {channel.name}</h3>
          </div>
        </div>
  
        <div className="flex-1 p-4 flex">
          <ExcalidrawWrapper />
        </div>
      </div>
    )
  }