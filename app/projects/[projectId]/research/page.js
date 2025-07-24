"use client"

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Shadcn/avatar";
import { Button } from "@/components/Shadcn/button";
import { Textarea } from "@/components/Shadcn/textarea";
import { Paperclip, Send, X, Film, Link2, FileText, UploadCloud } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/card";
import { cn } from "@/lib/utils";
import researchData from '@/data_dummy/projects/research.json';

const ResearchMessage = ({ message }) => {
  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return <p className="text-sm text-foreground">{message.content}</p>;
      case 'video_link':
      case 'web_link':
        return (
          <a href={message.url} target="_blank" rel="noopener noreferrer" className="block p-3 bg-muted rounded-lg hover:bg-muted/80">
            <div className="flex items-center gap-3">
              {message.type === 'video_link' ? <Film className="h-5 w-5 text-primary"/> : <Link2 className="h-5 w-5 text-primary"/>}
              <div>
                <p className="font-semibold text-sm">{message.title}</p>
                <p className="text-xs text-muted-foreground truncate max-w-xs">{message.description || message.url}</p>
              </div>
            </div>
          </a>
        );
      case 'file':
         return (
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary"/>
              <div>
                <p className="font-semibold text-sm">{message.title}</p>
                <p className="text-xs text-muted-foreground">{message.filePath}</p>
              </div>
            </div>
          </div>
        );
      case 'embedded_video':
        return (
          <div className="p-2 bg-background rounded-lg">
            <p className="font-semibold text-sm mb-2">{message.title}</p>
            <div className="aspect-video" dangerouslySetInnerHTML={{ __html: message.embedCode }}/>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50">
      <Avatar>
        <AvatarImage src={message.author?.avatar} alt={message.author?.name} />
        <AvatarFallback>{message.author?.name?.charAt(0) || '?'}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-semibold text-sm">{message.author?.name || "Unknown User"}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="prose prose-sm max-w-none">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};


export default function ResearchChatPage() {
  const { projectId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    const filteredData = researchData.filter(item => item.projectId === projectId || item.projectId === "project_001");
    setMessages(filteredData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
  }, [projectId]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    const newMsg = {
      id: `research_${Date.now()}`,
      projectId: projectId || "project_001",
      author: { // This should be the current logged-in user
        name: "Qibal",
        avatar: "https://avatars.githubusercontent.com/u/74609802?v=4",
      },
      title: "New Text Note",
      type: "text",
      content: newMessage,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage("");
  };

  const handleDragEvents = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDragEnter = (e) => {
    handleDragEvents(e);
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    handleDragEvents(e);
    // Add a small delay to prevent flickering when moving over child elements
    setTimeout(() => {
        setIsDragging(false);
    }, 50)
  };

  const handleDrop = (e) => {
    handleDragEvents(e);
    setIsDragging(false);
    const files = [...e.dataTransfer.files];
    if(files && files.length > 0) {
        // Create a new message for each file dropped
        const fileMessages = files.map(file => ({
            id: `research_${Date.now()}_${file.name}`,
            projectId: projectId || "project_001",
            author: {
                name: "Qibal",
                avatar: "https://avatars.githubusercontent.com/u/74609802?v=4",
            },
            title: file.name,
            type: "file",
            filePath: file.name,
            description: `File uploaded: ${file.size} bytes`,
            createdAt: new Date().toISOString(),
        }));
        setMessages(prev => [...prev, ...fileMessages]);
    }
  };


  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background" onDragEnter={handleDragEnter}>
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-card">
            <h1 className="text-xl font-bold">Project Research Chat</h1>
            <p className="text-sm text-muted-foreground">Project: {projectId}</p>
        </div>

        {/* Drag and Drop Overlay */}
        {isDragging && (
            <div 
                className="absolute inset-0 bg-primary/20 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-primary-foreground"
                onDragLeave={handleDragLeave}
                onDragOver={handleDragEvents}
                onDrop={handleDrop}
            >
                <UploadCloud className="w-16 h-16 mb-4"/>
                <p className="text-2xl font-bold">Drop files to upload</p>
                <p>Release to add them to the research chat</p>
            </div>
        )}

        {/* Messages Area */}
        <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
                <ResearchMessage key={msg.id} message={msg} />
            ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-card">
            <div className="relative">
                <Textarea
                    placeholder="Type a message or drop a file..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                    className="pr-20"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                        <Paperclip className="h-5 w-5" />
                    </Button>
                     <Button size="sm" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4 mr-2" />
                        Send
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
}
