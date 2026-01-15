import { Image, Calendar, MapPin, Smile, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

interface TweetComposerProps {
    onPost?: (content: string) => void;
}

export function TweetComposer({ onPost }: TweetComposerProps) {
    const [content, setContent] = useState("");

    const handlePostClick = () => {
        if (content.trim() && onPost) {
            onPost(content);
            setContent("");
        }
    };

    return (
        <div className="flex gap-3 p-4 border-b border-border w-full">
            <div className="shrink-0">
                <Avatar className="w-10 h-10">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>
            <div className="w-full pt-1">
                <textarea
                    className="w-full bg-transparent text-xl placeholder:text-muted-foreground border-none focus:ring-0 resize-none outline-none min-h-[52px] overflow-hidden"
                    placeholder="What is happening?!"
                    rows={2}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <div className="flex items-center justify-between border-t border-border pt-3 mt-2">
                    <div className="flex gap-0.5 text-twitter-blue">
                        <Button variant="ghost" size="icon" className="text-twitter-blue hover:bg-twitter-blue/10 rounded-full h-9 w-9">
                            <Image size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-twitter-blue hover:bg-twitter-blue/10 rounded-full h-9 w-9">
                            <div className="border border-current rounded px-1 text-[10px] font-bold">GIF</div>
                        </Button>
                        <Button variant="ghost" size="icon" className="text-twitter-blue hover:bg-twitter-blue/10 rounded-full h-9 w-9">
                            <List size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-twitter-blue hover:bg-twitter-blue/10 rounded-full h-9 w-9">
                            <Smile size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-twitter-blue hover:bg-twitter-blue/10 rounded-full h-9 w-9">
                            <Calendar size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-twitter-blue hover:bg-twitter-blue/10 rounded-full h-9 w-9">
                            <MapPin size={18} />
                        </Button>
                    </div>
                    <div>
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
        </div>
    );
}
