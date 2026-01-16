"use client";

import { Home, MessageSquare, Feather } from "lucide-react";
import Link from "next/link";

interface BottomNavProps {
    isChatOpen: boolean;
    onToggleChat: () => void;
    onScrollToTop: () => void;
}

export function BottomNav({ isChatOpen, onToggleChat, onScrollToTop }: BottomNavProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 h-[53px] bg-background/85 backdrop-blur-md border-t border-border flex items-center justify-around sm:hidden z-50 pb-[env(safe-area-inset-bottom)]">
            <button
                onClick={onScrollToTop}
                className="p-2 rounded-full hover:bg-twitter-hover transition-colors"
            >
                <Home className="h-[26px] w-[26px]" strokeWidth={2.5} />
            </button>

            <button
                onClick={onToggleChat}
                className={`p-2 rounded-full hover:bg-twitter-hover transition-colors ${isChatOpen ? "text-twitter-blue" : ""
                    }`}
            >
                <MessageSquare
                    className="h-[26px] w-[26px]"
                    strokeWidth={isChatOpen ? 2.5 : 1.75}
                />
            </button>

            {/* Placeholder for future features or just balancing the layout */}
            <div className="w-[42px]" />

            {/* Floating Action Button for Tweet (Visual only since composer is at top) 
           Actually, per spec, composer is at top. 
           But usually mobile apps have a FAB. 
           For now, let's just keep Home and Chat as primary navs. 
       */}
        </div>
    );
}
