"use client";

import Link from "next/link";
import { useState } from "react";
import { Timeline } from "@/components/tweetlab/Timeline";
import { AnalysisPanel } from "@/components/tweetlab/AnalysisPanel";
import { AIChat } from "@/components/tweetlab/AIChat";
import { Home, MessageSquare, Feather } from "lucide-react";
import { ThemeToggle } from "@/components/tweetlab/ThemeToggle";
import { TweetAnalysis } from "@/lib/types";
import Image from "next/image";

export default function Page() {
  const [analysis, setAnalysis] = useState<TweetAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTweet, setCurrentTweet] = useState<string>("");
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex min-h-screen justify-center bg-background text-foreground selection:bg-twitter-blue/30 transition-colors duration-300">
      <div className="flex w-full max-w-[1265px] xl:w-full">
        {/* Left Sidebar (Nav) */}
        <header className="hidden sm:flex w-[68px] xl:w-[275px] shrink-0 flex-col items-end xl:items-start p-2 h-screen sticky top-0 overflow-y-auto border-r border-border">
          <div className="flex h-full flex-col justify-between w-full px-2">
            <div className="flex flex-col gap-1 w-full items-center xl:items-start">
              {/* Logo */}
              <Link
                href="/"
                className="p-3 mb-2 rounded-full hover:bg-twitter-hover w-fit transition-colors cursor-pointer flex items-center gap-3"
              >
                <div className="relative w-8 h-8 dark:invert">
                  <Image
                    src="/logo.png"
                    alt="TweetLab"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="hidden xl:block text-xl font-bold tracking-tight">
                  TweetLab
                </span>
              </Link>

              {/* Nav Items */}
              <nav className="flex flex-col gap-0.5 mt-1 w-full">
                <Link
                  href="#"
                  className="group flex items-center gap-4 p-3 rounded-full hover:bg-twitter-hover w-fit xl:w-auto transition-colors"
                >
                  <Home className="h-[26px] w-[26px]" strokeWidth={2.5} />
                  <span className="hidden xl:block text-xl font-bold">
                    Home
                  </span>
                </Link>
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="group flex items-center gap-4 p-3 rounded-full hover:bg-twitter-hover w-fit xl:w-auto transition-colors text-muted-foreground hover:text-foreground"
                >
                  <MessageSquare className="h-[26px] w-[26px]" strokeWidth={1.75} />
                  <span className="hidden xl:block text-xl">AI Chat</span>
                </button>
              </nav>

              <button className="bg-twitter-blue hover:bg-twitter-blue/90 text-white font-bold rounded-full w-12 h-12 xl:w-full xl:h-[52px] mt-4 flex items-center justify-center shadow-md hover:shadow-lg hover:shadow-twitter-blue/20 transition-all duration-200 group">
                <Feather
                  className="xl:hidden group-hover:scale-110 transition-transform"
                  size={22}
                />
                <span className="hidden xl:block text-[17px]">
                  New Simulation
                </span>
              </button>
            </div>

            <div className="pb-4 w-full flex justify-center xl:justify-start">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Center Timeline */}
        <main className="flex w-full max-w-[600px] flex-col border-x border-border min-h-screen">
          <Timeline
            onAnalysisUpdate={setAnalysis}
            onLoadingChange={setIsLoading}
            onTweetChange={setCurrentTweet}
          />
        </main>

        {/* Right Sidebar (Search/Analysis) */}
        <aside className="hidden lg:flex w-[350px] shrink-0 flex-col gap-4 p-4 pl-6 h-screen sticky top-0 overflow-y-auto">
          <AnalysisPanel analysis={analysis} isLoading={isLoading} />
        </aside>
      </div>

      {/* AI Chat Modal */}
      <AIChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentTweet={currentTweet}
      />
    </div>
  );
}
