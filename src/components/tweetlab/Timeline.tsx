"use client";

import { useState, useEffect } from "react";
import { TweetComposer } from "./Composer";
import { TweetCard } from "./TweetCard";
import { TweetAnalysis } from "@/lib/types";

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

    // Animate stats gradually after AI prediction comes in
    useEffect(() => {
        if (!isAnimating || !currentPostId) return;

        const targetPost = posts.find(p => p.id === currentPostId);
        if (!targetPost) return;

        // Get target stats from storage
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

                    // Check if we've reached target
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

            // Store target stats for animation
            (window as any).__tweetlab_target_stats = {
                views: analysis.predicted_views,
                likes: analysis.predicted_likes,
                reposts: analysis.predicted_retweets,
                comments: analysis.predicted_replies,
            };

            setCurrentPostId(postId);
            setIsAnimating(true);
            onAnalysisUpdate(analysis);
        } catch (error) {
            console.error("Simulation error:", error);
            // Fallback to random simulation
            (window as any).__tweetlab_target_stats = {
                views: Math.floor(Math.random() * 5000) + 100,
                likes: Math.floor(Math.random() * 200) + 10,
                reposts: Math.floor(Math.random() * 50) + 2,
                comments: Math.floor(Math.random() * 30) + 1,
            };
            setCurrentPostId(postId);
            setIsAnimating(true);
        } finally {
            onLoadingChange(false);
        }
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
                    <TweetCard
                        key={post.id}
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
