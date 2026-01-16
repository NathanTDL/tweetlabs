"use client";

import { Search, Copy, Check, Zap, TrendingUp, Sparkles } from "lucide-react";
import { TweetAnalysis } from "@/lib/types";
import { useState } from "react";

interface AnalysisPanelProps {
    analysis: TweetAnalysis | null;
    isLoading: boolean;
}

export function AnalysisPanel({ analysis, isLoading }: AnalysisPanelProps) {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const getOutlookColor = (outlook: string) => {
        switch (outlook) {
            case "High":
                return "text-green-500 bg-green-500/10";
            case "Medium":
                return "text-yellow-500 bg-yellow-500/10";
            case "Low":
                return "text-red-500 bg-red-500/10";
            default:
                return "text-muted-foreground bg-secondary";
        }
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
        if (num >= 1000) return (num / 1000).toFixed(1) + "K";
        return num.toString();
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="sticky top-0 z-10 bg-background pb-1 pt-1">
                <label className="relative group block">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground group-focus-within:text-twitter-blue transition-colors">
                        <Search size={16} strokeWidth={2.5} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full bg-secondary border border-transparent text-foreground placeholder:text-muted-foreground rounded-full py-2.5 pl-10 pr-4 focus:ring-1 focus:ring-twitter-blue focus:bg-background focus:border-twitter-blue transition-all text-[15px]"
                    />
                </label>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="border border-border rounded-2xl overflow-hidden bg-secondary/50 p-6">
                    <div className="flex flex-col items-center text-center">
                        <div className="relative mb-4">
                            <div className="absolute inset-0 blur-2xl opacity-40 bg-gradient-to-r from-twitter-blue to-purple-500 rounded-full animate-pulse" />
                            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-twitter-blue/20 to-purple-500/20 flex items-center justify-center border border-twitter-blue/20">
                                <Sparkles className="h-8 w-8 text-twitter-blue animate-pulse" />
                            </div>
                        </div>
                        <h3 className="font-bold text-lg mb-2">AI Simulating Users...</h3>
                        <p className="text-[13px] text-muted-foreground mb-4">
                            Analyzing engagement patterns and predicting reactions
                        </p>
                        <div className="flex gap-2">
                            <div className="px-3 py-1.5 bg-background rounded-full text-[12px] animate-pulse">
                                🧠 Analyzing hook...
                            </div>
                            <div className="px-3 py-1.5 bg-background rounded-full text-[12px] animate-pulse" style={{ animationDelay: "200ms" }}>
                                📊 Predicting reach
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Analysis Results */}
            {!isLoading && analysis && (
                <>
                    {/* Predicted Metrics */}
                    <div className="border border-border rounded-2xl overflow-hidden bg-secondary/50 p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="h-5 w-5 text-twitter-blue" />
                            <h2 className="font-bold text-[17px]">Predicted Performance</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-background rounded-xl p-3 border border-border">
                                <p className="text-[12px] text-muted-foreground">Views</p>
                                <p className="text-xl font-bold">{formatNumber(analysis.predicted_views)}</p>
                            </div>
                            <div className="bg-background rounded-xl p-3 border border-border">
                                <p className="text-[12px] text-muted-foreground">Likes</p>
                                <p className="text-xl font-bold text-pink-500">{formatNumber(analysis.predicted_likes)}</p>
                            </div>
                            <div className="bg-background rounded-xl p-3 border border-border">
                                <p className="text-[12px] text-muted-foreground">Retweets</p>
                                <p className="text-xl font-bold text-green-500">{formatNumber(analysis.predicted_retweets)}</p>
                            </div>
                            <div className="bg-background rounded-xl p-3 border border-border">
                                <p className="text-[12px] text-muted-foreground">Replies</p>
                                <p className="text-xl font-bold text-twitter-blue">{formatNumber(analysis.predicted_replies)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Engagement Outlook */}
                    <div className="border border-border rounded-2xl overflow-hidden bg-secondary/50">
                        <div className="p-4 border-b border-border">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-twitter-blue" />
                                    <h2 className="font-bold text-[17px]">Engagement Outlook</h2>
                                </div>
                                <span className={`text-[13px] font-bold px-3 py-1 rounded-full ${getOutlookColor(analysis.engagement_outlook)}`}>
                                    {analysis.engagement_outlook}
                                </span>
                            </div>
                            <p className="text-[14px] text-muted-foreground leading-relaxed">
                                {analysis.engagement_justification}
                            </p>
                        </div>

                        {/* Analysis */}
                        <div className="p-4 border-b border-border">
                            <h2 className="font-bold text-[15px] mb-3">Why It Works</h2>
                            <ul className="space-y-2">
                                {analysis.analysis.map((point, i) => (
                                    <li key={i} className="flex gap-2 text-[13px]">
                                        <span className="text-twitter-blue mt-0.5">•</span>
                                        <span className="text-muted-foreground">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </>
            )}

            {/* Empty State */}
            {!isLoading && !analysis && (
                <div className="border border-border rounded-2xl overflow-hidden bg-secondary/50">
                    <div className="p-4 border-b border-border">
                        <div className="flex items-center justify-between">
                            <h2 className="font-extrabold text-xl">Engagement Outlook</h2>
                            <span className="text-[13px] text-muted-foreground">Waiting...</span>
                        </div>
                        <div className="mt-4 flex items-center gap-3">
                            <div className="h-1.5 flex-1 bg-border rounded-full overflow-hidden">
                                <div className="h-full w-[0%] bg-twitter-blue transition-all duration-1000" />
                            </div>
                        </div>
                        <p className="text-muted-foreground mt-3 text-[14px] leading-relaxed">
                            Post a tweet to see its predicted performance range.
                        </p>
                    </div>

                    <div className="p-4 border-b border-border">
                        <h2 className="font-bold text-[17px] mb-3">Why It Works</h2>
                        <ul className="space-y-2.5">
                            {[1, 2, 3].map((i) => (
                                <li key={i} className="flex gap-3 opacity-40">
                                    <div className="h-1.5 w-1.5 mt-2 rounded-full bg-muted-foreground shrink-0" />
                                    <div className="h-4 bg-border rounded w-3/4 animate-pulse" />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="p-4">
                        <h2 className="font-bold text-[17px] mb-3">Refined Alternatives</h2>
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="p-3 rounded-xl border border-border bg-background/50 opacity-40">
                                    <div className="h-4 bg-border rounded w-full mb-2 animate-pulse" />
                                    <div className="h-4 bg-border rounded w-2/3 animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
