"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/lib/types";

interface AIChatProps {
    isOpen: boolean;
    onClose: () => void;
    currentTweet?: string;
}

export function AIChat({ isOpen, onClose, currentTweet }: AIChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: input.trim(),
                    tweetContext: currentTweet,
                }),
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.response,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "Sorry, I couldn't process that. Please try again.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Chat Panel */}
            <div className="relative w-full max-w-lg h-[600px] max-h-[85vh] bg-background border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/30">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-twitter-blue/10 rounded-lg">
                            <Sparkles className="h-5 w-5 text-twitter-blue" />
                        </div>
                        <div>
                            <h2 className="font-bold text-[15px]">AI Assistant</h2>
                            <p className="text-[12px] text-muted-foreground">
                                Refine your tweets
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="rounded-full h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                    >
                        <X size={18} />
                    </Button>
                </div>

                {/* Current Tweet Context */}
                {currentTweet && (
                    <div className="px-4 py-3 bg-secondary/20 border-b border-border">
                        <p className="text-[12px] text-muted-foreground mb-1">Current tweet:</p>
                        <p className="text-[13px] line-clamp-2">{currentTweet}</p>
                    </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center px-6">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-twitter-blue/20 to-purple-500/20 flex items-center justify-center mb-4">
                                <Sparkles className="h-6 w-6 text-twitter-blue" />
                            </div>
                            <h3 className="font-semibold mb-2">How can I help?</h3>
                            <p className="text-[13px] text-muted-foreground mb-4">
                                Ask me to refine your tweet, make it shorter, more
                                controversial, or anything else!
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {["Make it shorter", "Add more hook", "Make it bolder"].map(
                                    (suggestion) => (
                                        <button
                                            key={suggestion}
                                            onClick={() => setInput(suggestion)}
                                            className="text-[12px] px-3 py-1.5 bg-secondary hover:bg-secondary/80 rounded-full border border-border transition-colors"
                                        >
                                            {suggestion}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                                }`}
                        >
                            <div
                                className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed ${message.role === "user"
                                        ? "bg-twitter-blue text-white rounded-br-md"
                                        : "bg-secondary rounded-bl-md"
                                    }`}
                            >
                                {message.content}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-secondary px-4 py-3 rounded-2xl rounded-bl-md">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border bg-background">
                    <div className="flex gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask anything..."
                            className="flex-1 bg-secondary border border-border rounded-full px-4 py-2.5 text-[14px] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-twitter-blue focus:border-transparent transition-all"
                            disabled={isLoading}
                        />
                        <Button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="bg-twitter-blue hover:bg-twitter-blue/90 text-white rounded-full h-10 w-10 p-0 disabled:opacity-50"
                        >
                            <Send size={18} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
