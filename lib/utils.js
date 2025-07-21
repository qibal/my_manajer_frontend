import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatTime = (timestamp) => new Date(timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
export const formatDate = (timestamp) => new Date(timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

import {
    Hash,
    Volume2,
    Edit3,
    FileText,
    Database,
    BarChart3,
} from "lucide-react"

export const getChannelIcon = (type) => {
    switch (type) {
        case "messages":
            return Hash;
        case "voices":
            return Volume2;
        case "drawings":
            return Edit3;
        case "documents":
            return FileText;
        case "databases":
            return Database;
        case "reports":
            return BarChart3;
        default:
            return Hash;
    }
};
