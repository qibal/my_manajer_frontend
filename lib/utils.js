import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatTime = (timestamp, locale = 'en-US') => {
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? '' : date.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit', hour12: true });
};

export const formatDate = (timestamp, locale = 'en-GB') => {
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? '' : date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
};

export const formatDateTime = (timestamp, locale = 'en-GB') => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: false, // Menggunakan format 24 jam secara default
    };
    return date.toLocaleDateString(locale, options) + ' ' + date.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit', hour12: false });
};

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
