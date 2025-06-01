"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Send, Save, Copy, Trash2, RefreshCw, Download } from "lucide-react";
import { useRouter } from "next/navigation";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Template = {
  content: string;
  type: string;
  description: string;
};

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedTemplate, setGeneratedTemplate] = useState<Template | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load chat history from local storage
  useEffect(() => {
    const savedMessages = localStorage.getItem('ai-chat-messages');
    const savedConversationId = localStorage.getItem('ai-chat-conversation-id');
    
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Failed to parse saved messages', e);
      }
    }
    
    if (savedConversationId) {
      setConversationId(savedConversationId);
    } else {
      // Generate a new conversation ID
      setConversationId(`conversation-${Date.now()}`);
    }
  }, []);

  // Save chat history to local storage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('ai-chat-messages', JSON.stringify(messages));
    }
    
    if (conversationId) {
      localStorage.setItem('ai-chat-conversation-id', conversationId);
    }
  }, [messages, conversationId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  // Make the input ref available to the outside
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.id = 'ai-chat-input';
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);
    setGeneratedTemplate(null);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          conversationId
        }),
      });

      const data = await response.json();

      if (data.success && data.response) {
        setMessages((prev) => [...prev, data.response]);
        
        // Check if this is a template creation response
        if (data.isTemplateCreation && data.template) {
          setGeneratedTemplate(data.template);
        }
      } else {
        setError(data.message || "Failed to get AI response");
        // Still show the error in the chat
        setMessages((prev) => [
          ...prev, 
          { 
            role: "assistant", 
            content: `Error: ${data.message || "Failed to get AI response. Please check your API key and try again."}`
          }
        ]);
        toast({
          variant: "destructive",
          description: data.message || "Failed to get AI response. Please check your API key.",
        });
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to get AI response";
      setError(errorMessage);
      // Show the error in the chat
      setMessages((prev) => [
        ...prev, 
        { 
          role: "assistant", 
          content: `Error: ${errorMessage}. Please check your API key and try again.`
        }
      ]);
      toast({
        variant: "destructive",
        description: "Failed to get AI response. Please check your API key and connection.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!generatedTemplate) return;
    
    setIsSaving(true);
    
    try {
      // Call the API to save the template to the database
      const response = await fetch("/api/ai/save-template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: generatedTemplate.content,
          type: generatedTemplate.type,
          description: generatedTemplate.description
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          description: `Template saved successfully! You can view it in the Email Templates section.`,
        });
        
        // Ask if they want to navigate to the email templates page
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content: "Template saved successfully! Would you like to view it in the Email Templates section now?"
          }
        ]);
        
        // Reset the generated template after saving
        setGeneratedTemplate(null);
      } else {
        throw new Error(data.message || "Failed to save template");
      }
    } catch (error: any) {
      console.error("Save template error:", error);
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to save the template.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewTemplates = () => {
    // Navigate to email templates page
    router.push("/autoflow/email-templates");
  };

  const handleCopyTemplate = () => {
    if (!generatedTemplate) return;
    
    navigator.clipboard.writeText(generatedTemplate.content)
      .then(() => {
        toast({
          description: "Template copied to clipboard!",
        });
      })
      .catch((error) => {
        console.error("Copy error:", error);
        toast({
          variant: "destructive",
          description: "Failed to copy the template.",
        });
      });
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        toast({
          description: "Copied to clipboard!",
        });
      })
      .catch((error) => {
        console.error("Copy error:", error);
        toast({
          variant: "destructive",
          description: "Failed to copy the message.",
        });
      });
  };

  const clearConversation = () => {
    setMessages([]);
    localStorage.removeItem('ai-chat-messages');
    setConversationId(`conversation-${Date.now()}`);
    setGeneratedTemplate(null);
    setError(null);
    toast({
      description: "Conversation cleared",
    });
  };

  const downloadConversation = () => {
    try {
      // Format the conversation as plain text
      const text = messages.map(m => `${m.role === 'user' ? 'You' : 'Assistant'}: ${m.content}`).join('\n\n');
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `autoflow-chat-${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        description: "Conversation downloaded",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        variant: "destructive",
        description: "Failed to download the conversation",
      });
    }
  };

  // Format the content with basic styling
  const formatContent = (content: string) => {
    // Replace newlines with <br> tags
    return content
      .split('\n')
      .map((line, i) => <p key={i} className="mb-2">{line}</p>);
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-3xl mx-auto border rounded-lg shadow-sm bg-card">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Chat</h2>
          {error && <p className="text-red-500 text-sm mt-1">Error: {error}</p>}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={downloadConversation}
            disabled={messages.length === 0}
            title="Download conversation"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearConversation}
            disabled={messages.length === 0}
            title="Clear conversation"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8 space-y-3">
              <p className="text-muted-foreground">
                Send a message to start chatting with the AI assistant.
              </p>
              <div className="text-xs text-muted-foreground">
                Your conversation will be saved in your browser.
              </div>
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`group relative max-w-[85%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : message.content.startsWith("Error:") 
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-muted"
                }`}
              >
                <div className="whitespace-pre-wrap">
                  {message.content.startsWith('Error:') 
                    ? message.content 
                    : formatContent(message.content)}
                </div>
                {message.role === 'assistant' && !message.content.startsWith("Error:") && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2"
                    onClick={() => handleCopyMessage(message.content)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-lg p-3 bg-muted">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-current animate-pulse"></div>
                  <div className="h-2 w-2 rounded-full bg-current animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                  <div className="h-2 w-2 rounded-full bg-current animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}
          
          {/* Template Actions UI */}
          {generatedTemplate && (
            <div className="flex justify-center">
              <div className="bg-secondary/30 p-4 rounded-lg text-center max-w-lg border border-border">
                <p className="text-sm mb-3">Would you like to save this template or copy it to clipboard?</p>
                <div className="flex gap-2 justify-center">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    onClick={handleSaveTemplate}
                    disabled={isSaving}
                  >
                    <Save className="h-4 w-4 mr-1" /> 
                    {isSaving ? "Saving..." : "Save Template"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCopyTemplate}>
                    <Copy className="h-4 w-4 mr-1" /> Copy to Clipboard
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* View Templates Navigation Option */}
          {messages.length > 0 && 
           messages[messages.length - 1].role === "assistant" && 
           messages[messages.length - 1].content.includes("Would you like to view it in the Email Templates section now?") && (
            <div className="flex justify-center mt-2">
              <Button size="sm" onClick={handleViewTemplates}>
                View Email Templates
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="w-full"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </form>
    </div>
  );
} 