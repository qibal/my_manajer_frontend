// Document Channel Component (Tiptap simulation)
import { useState, useEffect } from "react"
import {
    FileText,
} from "lucide-react"
import { SimpleEditor } from "@/components/TipTap/tiptap-templates/simple/simple-editor"
import "@/styles/tiptap.scss"

export default function DocumentChannel({ channel }) {
    return (
        <div className="flex flex-col h-full bg-white text-black">
          <div className="p-2 border-b">
              <h3 className="font-semibold text-center">{channel.name}</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
          <SimpleEditor />;
          </div>
        </div>
    )
  }