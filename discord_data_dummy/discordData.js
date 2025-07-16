import {
    Hash,
    Volume2,
    Users,
    Settings,
    Plus,
    Search,
    MoreVertical,
    Pin,
    Maximize2,
    Minimize2,
    Send,
    Paperclip,
    Smile,
    Mic,
    MicOff,
    Video,
    VideoOff,
    PhoneOff,
    Edit3,
    FileText,
    Database,
    BarChart3,
    ArrowLeft,
    Headphones,
    Reply,
    Forward,
    Copy,
    Trash2,
    ThumbsUp,
    Flame,
    Heart,
    Pencil,
    Check,
    CheckCheck,
    SmilePlus,
    X,
    ChevronLeft,
    ChevronRight,
    UserPlus,
    Cog,
    ListTree,
    Bell,
    ChevronDown
} from "lucide-react"

export const businesses = [
  { id: 1, name: "TechCorp", avatar: "/placeholder.svg?height=48&width=48", initials: "TC", color: "bg-blue-500" },
  { id: 2, name: "DesignStudio", avatar: "/placeholder.svg?height=48&width=48", initials: "DS", color: "bg-purple-500" },
  { id: 3, name: "MarketingPro", avatar: "/placeholder.svg?height=48&width=48", initials: "MP", color: "bg-green-500" },
  { id: 4, name: "DataAnalytics", avatar: "/placeholder.svg?height=48&width=48", initials: "DA", color: "bg-orange-500" },
  { id: 5, name: "StartupHub", avatar: "/placeholder.svg?height=48&width=48", initials: "SH", color: "bg-red-500" },
  { id: 6, name: "ConsultingFirm", avatar: "/placeholder.svg?height=48&width=48", initials: "CF", color: "bg-indigo-500" },
  { id: 7, name: "FinanceGroup", avatar: "/placeholder.svg?height=48&width=48", initials: "FG", color: "bg-yellow-500" },
  { id: 8, name: "HealthTech", avatar: "/placeholder.svg?height=48&width=48", initials: "HT", color: "bg-pink-500" },
  { id: 9, name: "EduWorld", avatar: "/placeholder.svg?height=48&width=48", initials: "EW", color: "bg-teal-500" },
  { id: 10, name: "RetailGiant", avatar: "/placeholder.svg?height=48&width=48", initials: "RG", color: "bg-lime-500" },
  { id: 11, name: "AgroBiz", avatar: "/placeholder.svg?height=48&width=48", initials: "AB", color: "bg-green-700" },
  { id: 12, name: "TravelEase", avatar: "/placeholder.svg?height=48&width=48", initials: "TE", color: "bg-cyan-500" },
  { id: 13, name: "Foodies", avatar: "/placeholder.svg?height=48&width=48", initials: "FD", color: "bg-orange-700" },
  { id: 14, name: "AutoMotive", avatar: "/placeholder.svg?height=48&width=48", initials: "AM", color: "bg-gray-700" },
  { id: 15, name: "MediaWorks", avatar: "/placeholder.svg?height=48&width=48", initials: "MW", color: "bg-fuchsia-500" },
  { id: 16, name: "GreenEnergy", avatar: "/placeholder.svg?height=48&width=48", initials: "GE", color: "bg-emerald-500" },
  { id: 17, name: "LogiTech", avatar: "/placeholder.svg?height=48&width=48", initials: "LT", color: "bg-blue-700" },
  { id: 18, name: "BuildRight", avatar: "/placeholder.svg?height=48&width=48", initials: "BR", color: "bg-yellow-700" },
  { id: 19, name: "LegalEase", avatar: "/placeholder.svg?height=48&width=48", initials: "LE", color: "bg-red-700" },
  { id: 20, name: "CloudNet", avatar: "/placeholder.svg?height=48&width=48", initials: "CN", color: "bg-sky-500" },
];

export const channels = {
  1: [
    { id: 3, name: "announcements", type: "text", unread: 1, category: "Information" },
    { id: 13, name: "resources", type: "document", unread: 1, category: "Information" },
    { id: 1, name: "general", type: "text", unread: 3, category: "Text Channels" },
    { id: 2, name: "development", type: "text", unread: 0, category: "Text Channels" },
    { id: 5, name: "project-alpha", type: "text", unread: 5, category: "Project Alpha" },
    { id: 6, name: "whiteboard", type: "draw", unread: 0, category: "Project Alpha" },
    { id: 7, name: "documentation", type: "document", unread: 2, category: "Project Alpha" },
    { id: 8, name: "project-db", type: "database", unread: 0, category: "Project Alpha" },
    { id: 9, name: "weekly-report", type: "report", unread: 1, category: "Project Alpha" },
    { id: 4, name: "team-meeting", type: "voice", unread: 0, category: "Voice Channels" },
    { id: 17, name: "sales", type: "voice", unread: 0, category: "Voice Channels" },
  ],
  2: [
    { id: 21, name: "creative-brief", type: "text", unread: 2, category: "Design" },
    { id: 22, name: "client-feedback", type: "text", unread: 0, category: "Clients" },
    { id: 23, name: "design-showcase", type: "voice", unread: 0, category: "Design" },
    { id: 24, name: "mood-board", type: "draw", unread: 1, category: "Design" },
    { id: 25, name: "brand-guide", type: "document", unread: 0, category: "Design" },
    { id: 26, name: "project-x", type: "text", unread: 2, category: "Project X" },
    { id: 27, name: "project-y", type: "text", unread: 0, category: "Project Y" },
    { id: 28, name: "project-z", type: "text", unread: 1, category: "Project Z" },
    { id: 29, name: "team-sync", type: "voice", unread: 0, category: "Voice Channels" },
    { id: 30, name: "client-calls", type: "voice", unread: 0, category: "Voice Channels" },
    { id: 31, name: "assets", type: "document", unread: 0, category: "Assets" },
    { id: 32, name: "references", type: "document", unread: 0, category: "Assets" },
    { id: 33, name: "ideas", type: "draw", unread: 0, category: "Ideas" },
    { id: 34, name: "wireframes", type: "draw", unread: 1, category: "Design" },
    { id: 35, name: "prototypes", type: "draw", unread: 0, category: "Design" },
    { id: 36, name: "testing", type: "text", unread: 0, category: "Testing" },
    { id: 37, name: "qa", type: "text", unread: 0, category: "Testing" },
    { id: 38, name: "handoff", type: "text", unread: 0, category: "Handoff" },
    { id: 39, name: "archive", type: "document", unread: 0, category: "Archive" },
    { id: 40, name: "feedback", type: "text", unread: 1, category: "Feedback" },
  ],
};

export const onlineUsers = [
  { id: 1, name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", status: "online", role: "Admin" },
  { id: 2, name: "Jane Smith", avatar: "/placeholder.svg?height=32&width=32", status: "online", role: "Developer" },
  { id: 3, name: "Mike Johnson", avatar: "/placeholder.svg?height=32&width=32", status: "away", role: "Designer" },
  { id: 4, name: "Sarah Wilson", avatar: "/placeholder.svg?height=32&width=32", status: "online", role: "Manager" },
  { id: 5, name: "Tom Brown", avatar: "/placeholder.svg?height=32&width=32", status: "busy", role: "Analyst" },
  { id: 6, name: "Lisa Davis", avatar: "/placeholder.svg?height=32&width=32", status: "online", role: "Marketing" },
  { id: 7, name: "Alex Chen", avatar: "/placeholder.svg?height=32&width=32", status: "online", role: "Developer" },
  { id: 8, name: "Emma Wilson", avatar: "/placeholder.svg?height=32&width=32", status: "away", role: "Designer" },
  { id: 9, name: "David Lee", avatar: "/placeholder.svg?height=32&width=32", status: "online", role: "Product Manager" },
  { id: 10, name: "Sophie Turner", avatar: "/placeholder.svg?height=32&width=32", status: "busy", role: "QA Engineer" },
  { id: 11, name: "Chris Evans", avatar: "/placeholder.svg?height=32&width=32", status: "online", role: "Support" },
  { id: 12, name: "Natalie Portman", avatar: "/placeholder.svg?height=32&width=32", status: "away", role: "Designer" },
  { id: 13, name: "Robert Downey", avatar: "/placeholder.svg?height=32&width=32", status: "online", role: "Lead Dev" },
  { id: 14, name: "Scarlett Johansson", avatar: "/placeholder.svg?height=32&width=32", status: "busy", role: "HR" },
  { id: 15, name: "Mark Ruffalo", avatar: "/placeholder.svg?height=32&width=32", status: "online", role: "Finance" },
  { id: 16, name: "Jeremy Renner", avatar: "/placeholder.svg?height=32&width=32", status: "online", role: "Sales" },
  { id: 17, name: "Elizabeth Olsen", avatar: "/placeholder.svg?height=32&width=32", status: "away", role: "Marketing" },
  { id: 18, name: "Paul Bettany", avatar: "/placeholder.svg?height=32&width=32", status: "online", role: "Support" },
  { id: 19, name: "Tom Hiddleston", avatar: "/placeholder.svg?height=32&width=32", status: "busy", role: "Legal" },
  { id: 20, name: "Benedict Cumberbatch", avatar: "/placeholder.svg?height=32&width=32", status: "online", role: "DevOps" },
];

export const chatMessages = [
    // Day 1
    { id: 1, user: "John Doe", message: "Hey everyone! How's the project going?", timestamp: "2025-02-18T10:30:00Z", avatar: "/placeholder.svg?height=32&width=32", edited: false, reactions: [{ emoji: "👍", count: 3 }], readStatus: null, pinned: false },
    { id: 2, user: "Jane Smith", message: "Making good progress on the frontend. Should be ready for review by tomorrow.", timestamp: "2025-02-18T10:32:00Z", avatar: "/placeholder.svg?height=32&width=32", edited: true, reactions: [], readStatus: null, pinned: true },
    { id: 3, user: "Iqbal", message: "Great! I'll check it out first thing in the morning.", timestamp: "2025-02-18T10:35:00Z", avatar: "https://github.com/shadcn.png", edited: false, reactions: [{ emoji: "🔥", count: 1 }], readStatus: 'read', pinned: false },
    { id: 4, user: "Alex Chen", message: "Backend API is deployed and documented. Let me know if you find any issues.", timestamp: "2025-02-18T11:00:00Z", avatar: "/placeholder.svg?height=32&width=32", edited: false, reactions: [{ emoji: "✅", count: 2 }], readStatus: null, pinned: false },

    // Day 2
    { id: 5, user: "Sarah Wilson", message: "Perfect timing. Let's schedule a review meeting for Thursday.", timestamp: "2025-02-19T09:00:00Z", avatar: "/placeholder.svg?height=32&width=32", edited: false, reactions: [], readStatus: null, pinned: true },
    { id: 6, user: "Iqbal", message: "Sounds good to me!", timestamp: "2025-02-19T09:05:00Z", avatar: "https://github.com/shadcn.png", edited: false, reactions: [], readStatus: 'delivered', pinned: false },
    { id: 7, user: "David Lee", message: "I've updated the product roadmap with the new timeline.", timestamp: "2025-02-19T10:15:00Z", avatar: "/placeholder.svg?height=32&width=32", edited: false, reactions: [{ emoji: "🗺️", count: 1 }], readStatus: null, pinned: false },
    { id: 8, user: "Iqbal", message: "Thanks, David. I've pushed the latest frontend updates.", timestamp: "2025-02-19T11:42:00Z", avatar: "https://github.com/shadcn.png", edited: true, reactions: [], readStatus: 'sent', pinned: false },
    { id: 9, user: "Emma Wilson", message: "The design assets for the new feature are now available in Figma.", timestamp: "2025-02-19T14:20:00Z", avatar: "/placeholder.svg?height=32&width=32", edited: false, reactions: [{ emoji: "🎨", count: 4 }], readStatus: null, pinned: true },

    // Day 3
    { id: 10, user: "Tom Brown", message: "Here's the weekly analytics report. We're seeing a great trend in user engagement.", timestamp: "2025-02-20T16:00:00Z", avatar: "/placeholder.svg?height=32&width=32", edited: false, reactions: [{ emoji: "📈", count: 5 }], readStatus: null, pinned: false },
    { id: 11, user: "Iqbal", message: "Awesome numbers! Keep up the great work, team.", timestamp: "2025-02-20T16:05:00Z", avatar: "https://github.com/shadcn.png", edited: false, reactions: [{ emoji: "🎉", count: 10 }], readStatus: 'read', pinned: false },
    { id: 12, user: "Lisa Davis", message: "The new marketing campaign is ready to launch tomorrow morning.", timestamp: "2025-02-20T17:30:00Z", avatar: "/placeholder.svg?height=32&width=32", edited: false, reactions: [], readStatus: null, pinned: false },
    { id: 13, user: "Iqbal", message: "Let's do it!", timestamp: "2025-02-20T17:31:00Z", avatar: "https://github.com/shadcn.png", edited: false, reactions: [], readStatus: 'read', pinned: false },
    { id: 14, user: "Sophie Turner", message: "QA testing for the mobile app is complete. No major blockers found.", timestamp: "2025-02-20T18:00:00Z", avatar: "/placeholder.svg?height=32&width=32", edited: false, reactions: [{ emoji: "👍", count: 2 }], readStatus: null, pinned: false },

    // Day 4
    { id: 15, user: "Chris Evans", message: "I've cleared all the critical support tickets from the queue.", timestamp: "2025-02-21T10:00:00Z", avatar: "/placeholder.svg?height=32&width=32", edited: false, reactions: [], readStatus: null, pinned: false },
    { id: 16, user: "Iqbal", message: "Great job, Chris!", timestamp: "2025-02-21T10:02:00Z", avatar: "https://github.com/shadcn.png", edited: false, reactions: [], readStatus: 'read', pinned: false },
    { id: 17, user: "Robert Downey", message: "Code review for the payment module is scheduled for this afternoon.", timestamp: "2025-02-21T11:00:00Z", avatar: "/placeholder.svg?height=32&width=32", edited: false, reactions: [], readStatus: null, pinned: false },
    { id: 18, user: "Mark Ruffalo", message: "Just submitted the finance report for Q1.", timestamp: "2025-02-21T11:30:00Z", avatar: "/placeholder.svg?height=32&width=32", edited: true, reactions: [{ emoji: "📄", count: 1 }], readStatus: null, pinned: false },
    { id: 19, user: "Scarlett Johansson", message: "A reminder about the new HR policies, please review them by the end of the week.", timestamp: "2025-02-21T15:00:00Z", avatar: "/placeholder.svg?height=32&width=32", edited: false, reactions: [], readStatus: null, pinned: false },
    { id: 20, user: "Iqbal", message: "Will do, thanks for the reminder.", timestamp: "2025-02-21T15:05:00Z", avatar: "https://github.com/shadcn.png", edited: false, reactions: [], readStatus: 'delivered', pinned: false }
];

export const currentUser = {
    name: "Iqbal",
    email: "iqbal@example.com",
    avatar: "https://github.com/shadcn.png",
    status: "online",
};

export const getStatusColor = (status) => {
    switch (status) {
        case "online":
            return "bg-green-500";
        case "away":
            return "bg-yellow-500";
        case "busy":
            return "bg-red-500";
        default:
            return "bg-gray-500";
    }
};

export const getChannelIcon = (type) => {
    switch (type) {
        case "text":
            return Hash;
        case "voice":
            return Volume2;
        case "draw":
            return Edit3;
        case "document":
            return FileText;
        case "database":
            return Database;
        case "report":
            return BarChart3;
        default:
            return Hash;
    }
}; 