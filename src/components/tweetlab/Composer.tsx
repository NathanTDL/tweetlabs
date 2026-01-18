import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useRef, useEffect } from "react";
import { useSession } from "@/lib/auth-client";

interface TweetComposerProps {
    onPost?: (content: string) => void;
}

export function TweetComposer({ onPost }: TweetComposerProps) {
    const { data: session } = useSession();
    const [content, setContent] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-expand textarea as content grows
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [content]);

    const handlePostClick = () => {
        if (content.trim() && onPost) {
            onPost(content);
            setContent("");
        }
    };

    return (
        <div className="flex gap-3 p-4 border-b border-border w-full">
            <div className="shrink-0">
                <Avatar className="w-10 h-10 border border-border/50">
                    {session?.user?.image && (
                        <AvatarImage src={session.user.image} alt={session.user.name || "@user"} />
                    )}
                    <AvatarFallback className="bg-twitter-blue text-white font-bold">
                        {session?.user?.name
                            ? session.user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
                            : "U"}
                    </AvatarFallback>
                </Avatar>
            </div>
            <div className="w-full pt-1">
                <textarea
                    ref={textareaRef}
                    className="w-full bg-transparent text-xl placeholder:text-muted-foreground border-none focus:ring-0 resize-none outline-none min-h-[52px]"
                    placeholder="What is happening?!"
                    rows={1}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <div className="flex items-center justify-end pt-2 mt-2">
                    <Button
                        className="bg-twitter-blue hover:bg-twitter-blue/90 text-white font-bold rounded-full px-4 h-9 disabled:opacity-50 shadow-sm hover:shadow-md transition-all"
                        onClick={handlePostClick}
                        disabled={!content.trim()}
                    >
                        Post
                    </Button>
                </div>
            </div>
        </div>
    );
}
