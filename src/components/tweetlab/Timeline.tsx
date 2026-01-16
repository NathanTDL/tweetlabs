"use client";

import { useState, useEffect } from "react";
import { TweetComposer } from "./Composer";
import { TweetCard } from "./TweetCard";
import { TweetAnalysis, TweetSuggestion } from "@/lib/types";
import { Copy, Check } from "lucide-react";

interface Post {
    id: string;
    content: string;
    time: string;
    stats: {
        comments: number;
        reposts: number;
        likes: number;
        views: number;
    };
    isSimulated: boolean;
    suggestions?: TweetSuggestion[];
    baseStats?: {
        views: number;
        likes: number;
        reposts: number;
        comments: number;
    };
}

interface TimelineProps {
    onAnalysisUpdate: (analysis: TweetAnalysis | null) => void;
    onLoadingChange: (loading: boolean) => void;
    onTweetChange: (tweet: string) => void;
}

export function Timeline({ onAnalysisUpdate, onLoadingChange, onTweetChange }: TimelineProps) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentPostId, setCurrentPostId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Animate stats gradually after AI prediction comes in
    useEffect(() => {
        if (!isAnimating || !currentPostId) return;

        const targetPost = posts.find(p => p.id === currentPostId);
        if (!targetPost) return;

        const targetStats = (window as any).__tweetlab_target_stats;
        if (!targetStats) return;

        const interval = setInterval(() => {
            setPosts((currentPosts) => {
                return currentPosts.map((post) => {
                    if (post.id !== currentPostId) return post;

                    const newStats = {
                        views: Math.min(post.stats.views + Math.floor(targetStats.views * 0.05), targetStats.views),
                        likes: Math.min(post.stats.likes + Math.floor(targetStats.likes * 0.08), targetStats.likes),
                        reposts: Math.min(post.stats.reposts + Math.ceil(targetStats.reposts * 0.1), targetStats.reposts),
                        comments: Math.min(post.stats.comments + Math.ceil(targetStats.comments * 0.12), targetStats.comments),
                    };

                    if (
                        newStats.views >= targetStats.views &&
                        newStats.likes >= targetStats.likes &&
                        newStats.reposts >= targetStats.reposts &&
                        newStats.comments >= targetStats.comments
                    ) {
                        setIsAnimating(false);
                    }

                    return { ...post, stats: newStats };
                });
            });
        }, 150);

        return () => clearInterval(interval);
    }, [isAnimating, currentPostId, posts]);

    const handlePost = async (content: string) => {
        const postId = Date.now().toString();

        const newPost: Post = {
            id: postId,
            content,
            time: "just now",
            stats: { comments: 0, reposts: 0, likes: 0, views: 0 },
            isSimulated: true,
        };

        setPosts((prev) => [newPost, ...prev]);
        onTweetChange(content);
        onLoadingChange(true);
        onAnalysisUpdate(null);

        try {
            const response = await fetch("/api/simulate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tweet: content }),
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || "Simulation failed");
            }

            const analysis = data as TweetAnalysis;

            const baseStats = {
                views: analysis.predicted_views,
                likes: analysis.predicted_likes,
                reposts: analysis.predicted_retweets,
                comments: analysis.predicted_replies,
            };

            (window as any).__tweetlab_target_stats = baseStats;

            setPosts((prev) =>
                prev.map((p) =>
                    p.id === postId ? { ...p, suggestions: analysis.suggestions, baseStats } : p
                )
            );

            setCurrentPostId(postId);
            setIsAnimating(true);
            onAnalysisUpdate(analysis);
        } catch (error) {
            console.error("Simulation error:", error);
            const fallbackStats = {
                views: Math.floor(Math.random() * 5000) + 100,
                likes: Math.floor(Math.random() * 200) + 10,
                reposts: Math.floor(Math.random() * 50) + 2,
                comments: Math.floor(Math.random() * 30) + 1,
            };
            (window as any).__tweetlab_target_stats = fallbackStats;
            setCurrentPostId(postId);
            setIsAnimating(true);
        } finally {
            onLoadingChange(false);
        }
    };

    // Generate improved stats for suggestions
    const getImprovedStats = (baseStats: Post["baseStats"], index: number) => {
        if (!baseStats) return { views: 0, likes: 0, reposts: 0, comments: 0 };

        // Each suggestion gets progressively better stats
        const multipliers = [1.3, 1.6, 2.0];
        const multiplier = multipliers[index] || 1.5;

        return {
            views: Math.floor(baseStats.views * multiplier),
            likes: Math.floor(baseStats.likes * multiplier),
            reposts: Math.floor(baseStats.reposts * multiplier),
            comments: Math.floor(baseStats.comments * multiplier),
        };
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 flex h-[53px] items-center bg-twitter-header-bg backdrop-blur-md px-4 border-b border-border">
                <h1 className="text-xl font-bold">Home</h1>
            </div>

            <TweetComposer onPost={handlePost} />

            <div className="divide-y divide-border">
                {posts.map((post) => (
                    <div key={post.id}>
                        <TweetCard
                            name="You"
                            handle="you"
                            avatar="https://github.com/shadcn.png"
                            time={post.time}
                            content={post.content}
                            comments={post.stats.comments}
                            reposts={post.stats.reposts}
                            likes={post.stats.likes}
                            views={post.stats.views}
                            isSimulated={post.isSimulated}
                        />

                        {/* Improved Versions Section */}
                        {post.suggestions && post.suggestions.length > 0 && (
                            <div className="border-t border-border">
                                {/* Clean Header */}
                                <div className="px-4 py-3 border-b border-border bg-secondary/20">
                                    <h3 className="text-[15px] font-semibold">Improved Versions</h3>
                                    <p className="text-[13px] text-muted-foreground mt-0.5">Higher predicted engagement</p>
                                </div>

                                {/* Suggestion Tweet Cards */}
                                {post.suggestions.map((suggestion, idx) => {
                                    const improvedStats = getImprovedStats(post.baseStats, idx);

                                    return (
                                        <div key={idx} className="relative group border-b border-border last:border-b-0">
                                            {/* Copy Button */}
                                            <button
                                                onClick={() => handleCopy(suggestion.tweet, `${post.id}-${idx}`)}
                                                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-twitter-blue/10 hover:border-twitter-blue/30 transition-all opacity-0 group-hover:opacity-100"
                                                title="Copy tweet"
                                            >
                                                {copiedId === `${post.id}-${idx}` ? (
                                                    <Check size={15} className="text-green-500" />
                                                ) : (
                                                    <Copy size={15} className="text-muted-foreground" />
                                                )}
                                            </button>

                                            {/* Tweet Card */}
                                            <TweetCard
                                                name="You"
                                                handle="you"
                                                avatar="https://github.com/shadcn.png"
                                                time="optimized"
                                                content={suggestion.tweet}
                                                comments={improvedStats.comments}
                                                reposts={improvedStats.reposts}
                                                likes={improvedStats.likes}
                                                views={improvedStats.views}
                                                isSimulated={false}
                                            />

                                            {/* Why it's better */}
                                            <div className="px-4 pb-3 -mt-1 text-[13px] text-muted-foreground ml-[52px]">
                                                {suggestion.reason}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
                {posts.length === 0 && (
                    <div className="p-8 py-20 text-center">
                        <div className="max-w-sm mx-auto space-y-5">
                            <div className="relative">
                                <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-tr from-twitter-blue to-purple-500 rounded-full scale-150" />
                                <div className="relative bg-gradient-to-br from-twitter-blue/10 to-purple-500/10 dark:from-twitter-blue/20 dark:to-purple-500/20 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center border border-twitter-blue/20">
                                    <span className="text-3xl">🚀</span>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">
                                Test your tweet before the internet does.
                            </h2>
                            <p className="text-muted-foreground text-[15px] leading-relaxed">
                                TweetLab is a flight simulator for attention. See how X will react—visually, emotionally, and structurally—before you risk your account.
                            </p>
                            <div className="pt-2 flex flex-wrap justify-center gap-2 text-[13px] font-medium text-muted-foreground">
                                <div className="px-3 py-1.5 bg-secondary rounded-full border border-border">Visual Simulator</div>
                                <div className="px-3 py-1.5 bg-secondary rounded-full border border-border">AI Analysis</div>
                                <div className="px-3 py-1.5 bg-secondary rounded-full border border-border">Virality Check</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
