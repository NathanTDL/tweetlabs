import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Repeat, Heart, BarChart2, Share, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface TweetCardProps {
    name: string;
    handle: string;
    avatar?: string | null;
    time: string;
    content: string;
    comments: number;
    reposts: number;
    likes: number;
    views: number;
    isSimulated?: boolean;
}

export function TweetCard({ name, handle, avatar, time, content, comments, reposts, likes, views, isSimulated }: TweetCardProps) {
    return (
        <div className={cn(
            "flex gap-3 px-4 py-3 border-b border-border cursor-pointer hover:bg-twitter-hover transition-colors",
            isSimulated && "animate-in fade-in slide-in-from-top-4 duration-500"
        )}>
            <Link href="/profile" className="shrink-0 cursor-pointer">
                <Avatar className="w-10 h-10 border border-border/50">
                    {avatar && <AvatarImage src={avatar} alt={`@${handle}`} />}
                    <AvatarFallback className="bg-twitter-blue text-white font-bold">
                        {name ? name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : "U"}
                    </AvatarFallback>
                </Avatar>
            </Link>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 overflow-hidden text-[15px]">
                        <span className="font-bold truncate">{name}</span>
                        <span className="text-muted-foreground truncate">@{handle}</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground hover:underline">{time}</span>
                    </div>
                    <button className="text-muted-foreground hover:bg-twitter-blue/10 hover:text-twitter-blue rounded-full p-1.5 -mr-2 transition-colors">
                        <MoreHorizontal size={17} />
                    </button>
                </div>

                <div className="mt-0.5 text-[15px] leading-[1.35] whitespace-pre-wrap">
                    {content}
                </div>

                <div className="flex justify-between mt-3 max-w-[425px] text-muted-foreground">
                    {/* Replies */}
                    <div className="flex items-center gap-0.5 group">
                        <button className="p-2 -ml-2 rounded-full group-hover:bg-twitter-blue/10 group-hover:text-twitter-blue transition-colors">
                            <MessageCircle size={17} />
                        </button>
                        <span className="text-[13px] min-w-[20px] group-hover:text-twitter-blue transition-colors">{comments > 0 && comments}</span>
                    </div>

                    {/* Reposts */}
                    <div className="flex items-center gap-0.5 group">
                        <button className="p-2 -ml-2 rounded-full group-hover:bg-green-500/10 group-hover:text-green-500 transition-colors">
                            <Repeat size={17} />
                        </button>
                        <span className="text-[13px] min-w-[20px] group-hover:text-green-500 transition-colors">{reposts > 0 && reposts}</span>
                    </div>

                    {/* Likes */}
                    <div className="flex items-center gap-0.5 group">
                        <button className="p-2 -ml-2 rounded-full group-hover:bg-pink-500/10 group-hover:text-pink-500 transition-colors">
                            <Heart size={17} />
                        </button>
                        <span className="text-[13px] min-w-[20px] group-hover:text-pink-500 transition-colors">{likes > 0 && likes}</span>
                    </div>

                    {/* Views */}
                    <div className="flex items-center gap-0.5 group">
                        <button className="p-2 -ml-2 rounded-full group-hover:bg-twitter-blue/10 group-hover:text-twitter-blue transition-colors">
                            <BarChart2 size={17} />
                        </button>
                        <span className="text-[13px] min-w-[20px] group-hover:text-twitter-blue transition-colors">{views > 0 && views}</span>
                    </div>

                    {/* Share */}
                    <div className="flex items-center">
                        <button className="p-2 -ml-2 rounded-full hover:bg-twitter-blue/10 hover:text-twitter-blue transition-colors">
                            <Share size={17} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
