"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Timeline } from "@/components/tweetlab/Timeline";
import { AnalysisPanel } from "@/components/tweetlab/AnalysisPanel";
import { AIChat } from "@/components/tweetlab/AIChat";
import { Home, MessageSquare, Feather, Sparkles, History as HistoryIcon, User, FlaskConical } from "lucide-react";
import { ThemeToggle } from "@/components/tweetlab/ThemeToggle";
import { TweetAnalysis } from "@/lib/types";
import Image from "next/image";
import { LoginModal } from "@/components/tweetlab/LoginModal";
import { UserProfile } from "@/components/tweetlab/UserProfile";
import { History } from "@/components/tweetlab/History";
import { useSession } from "@/lib/auth-client";

export default function Page() {
  const [analysis, setAnalysis] = useState<TweetAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTweet, setCurrentTweet] = useState<string>("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<any>(null);

  const handleHistorySelect = (item: any) => {
    setSelectedHistoryItem(item);
    if (item.analysis) {
      setAnalysis(item.analysis);
    }
    // Mobile close behavior
    if (window.innerWidth < 1280) {
      setIsHistoryOpen(false);
    }
  };

  const { data: session } = useSession();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        if (isChatOpen) setIsChatOpen(false);
        if (isHistoryOpen) setIsHistoryOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isChatOpen, isHistoryOpen]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen justify-center bg-background text-foreground selection:bg-twitter-blue/30 transition-colors duration-300">
      <div className="flex w-full max-w-[1265px] xl:w-full">
        {/* Left Sidebar (Nav + AI Chat) */}
        <header ref={sidebarRef} className="hidden sm:flex w-[68px] xl:w-[275px] shrink-0 flex-col p-2 h-screen sticky top-0 overflow-hidden border-r border-border">
          <div className="flex flex-col h-full w-full px-2">
            <div className="flex flex-col gap-1 w-full items-center xl:items-start shrink-0">
              {/* Logo */}
              <Link
                href="/"
                className="p-3 mb-2 rounded-full hover:bg-twitter-hover w-fit transition-colors cursor-pointer flex items-center gap-3"
              >
                <div className="relative w-7 h-7 flex items-center justify-center">
                  <FlaskConical className="w-7 h-7 text-twitter-blue" strokeWidth={2.5} />
                </div>
                <span className="hidden xl:block text-xl font-bold tracking-tight">
                  TweetLab
                </span>
              </Link>

              {/* Nav Items */}
              <nav className="flex flex-col gap-2 mt-1 w-full mb-4">
                <button
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  className={`group flex items-center gap-4 p-3 rounded-full w-fit xl:w-auto transition-colors hover:bg-twitter-hover ${isChatOpen ? "font-bold text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <MessageSquare className="h-[26px] w-[26px]" strokeWidth={isChatOpen ? 2.5 : 1.75} />
                  <span className="hidden xl:block text-xl">AI Chat</span>
                </button>
                {/* Hide Profile/History when Chat is Open to maximize space */}
                {!isChatOpen && (
                  <>
                    {session?.user ? (
                      <Link
                        href="/profile"
                        className="group flex items-center gap-4 p-3 rounded-full hover:bg-twitter-hover w-fit xl:w-auto transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <User className="h-[26px] w-[26px]" strokeWidth={1.75} />
                        <span className="hidden xl:block text-xl">Profile</span>
                      </Link>
                    ) : (
                      <button
                        onClick={() => setIsLoginModalOpen(true)}
                        className="group flex items-center gap-4 p-3 rounded-full hover:bg-twitter-hover w-fit xl:w-auto transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <User className="h-[26px] w-[26px]" strokeWidth={1.75} />
                        <span className="hidden xl:block text-xl">Profile</span>
                      </button>
                    )}

                    {/* History button - only show if logged in */}
                    {session?.user && (
                      <button
                        onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                        className={`group flex items-center gap-4 p-3 rounded-full w-fit xl:w-auto transition-colors hover:bg-twitter-hover ${isHistoryOpen ? "text-twitter-blue font-bold" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        <HistoryIcon className="h-[26px] w-[26px]" strokeWidth={isHistoryOpen ? 2.5 : 1.75} />
                        <span className="hidden xl:block text-xl">History</span>
                      </button>
                    )}
                  </>
                )}
              </nav>
            </div>

            {/* Inline AI Chat (Desktop XL only) - Maximized */}
            {isChatOpen && (
              <div className="flex-1 min-h-0 w-full mb-4 border border-border rounded-2xl overflow-hidden shadow-sm xl:block hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                <AIChat
                  isOpen={true}
                  currentTweet={currentTweet}
                />
              </div>
            )}

            {/* Inline History (Desktop XL only) */}
            {isHistoryOpen && session?.user && !isChatOpen && (
              <div className="flex-1 min-h-0 w-full mb-4 border border-border rounded-2xl overflow-hidden shadow-sm xl:block hidden">
                <History onSelectHistory={handleHistorySelect} />
              </div>
            )}

            {/* Tablet icon-only chat indicator */}
            {isChatOpen && (
              <div className="xl:hidden hidden sm:flex w-full justify-center pt-4">
                <div className="w-10 h-10 rounded-full bg-twitter-blue/10 flex items-center justify-center animate-pulse">
                  <Sparkles className="h-5 w-5 text-twitter-blue" />
                </div>
              </div>
            )}

            {/* Bottom section: Theme toggle + User Profile */}
            <div className="pb-4 mt-auto w-full space-y-3 shrink-0">
              <div className="flex justify-center xl:justify-start">
                {(!isChatOpen && !isHistoryOpen) && <ThemeToggle />}
              </div>
              <UserProfile onLoginClick={() => setIsLoginModalOpen(true)} />
            </div>

            {/* If Chat is open, show minimal bottom or nothing? User asked to "fill up to the ai chat removing the profile and the history". 
                I'll hide it completely to give max space, as requested. */}
          </div>
        </header>

        {/* Center Timeline */}
        <main className="flex w-full max-w-[600px] flex-col border-x border-border min-h-screen sm:pb-0">
          <Timeline
            onAnalysisUpdate={setAnalysis}
            onLoadingChange={setIsLoading}
            onTweetChange={setCurrentTweet}
            onToggleChat={() => setIsChatOpen(!isChatOpen)}
            isChatOpen={isChatOpen}
            onScrollToTop={scrollToTop}
            selectedHistoryItem={selectedHistoryItem}
            onLoginClick={() => setIsLoginModalOpen(true)}
          />
        </main>

        {/* Right Sidebar (Search/Analysis) */}
        <aside className="hidden lg:flex w-[350px] shrink-0 flex-col gap-4 p-4 pl-6 h-screen sticky top-0 overflow-y-auto">
          <AnalysisPanel analysis={analysis} isLoading={isLoading} />
        </aside>
      </div>

      {/* Mobile/Tablet AI Chat Overlay */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm xl:hidden flex items-end sm:items-center justify-center sm:p-4">
          <div className="absolute inset-0" onClick={() => setIsChatOpen(false)} />
          <div className="relative w-full h-[80vh] sm:h-[600px] sm:max-w-[400px] bg-background border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-twitter-blue" />
                AI Assistant
              </h3>
              <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-secondary rounded-full">
                <Feather className="h-5 w-5 rotate-45" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <AIChat
                isOpen={true}
                currentTweet={currentTweet}
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile/Tablet History Overlay */}
      {isHistoryOpen && session?.user && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm xl:hidden flex items-end sm:items-center justify-center sm:p-4">
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={() => setIsHistoryOpen(false)} />

          <div className="relative w-full h-[80vh] sm:h-[600px] sm:max-w-[400px] bg-background border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <HistoryIcon className="h-5 w-5 text-twitter-blue" />
                Your History
              </h3>
              <button onClick={() => setIsHistoryOpen(false)} className="p-2 hover:bg-secondary rounded-full">
                <Feather className="h-5 w-5 rotate-45" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden p-0">
              <History onSelectHistory={handleHistorySelect} />
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}
