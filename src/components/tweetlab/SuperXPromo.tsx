import { ExternalLink, TrendingUp, BarChart3, Search } from "lucide-react";

export function SuperXPromo() {
    return (
        <a
            href="https://superx.so/"
            target="_blank"
            rel="noopener noreferrer"
            className="block group relative overflow-hidden rounded-2xl border border-border bg-card/30 hover:bg-card/50 transition-all duration-300"
        >
            {/* Background Decoration */}


            <div className="p-5 relative z-10">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-lg shadow-sm border border-white/10">
                            🔥
                        </div>
                        <div>
                            <h3 className="font-bold text-[15px] leading-tight group-hover:text-orange-500 transition-colors">SuperX</h3>
                            <p className="text-[11px] text-muted-foreground font-medium">Analytics & Growth</p>
                        </div>
                    </div>
                    <ExternalLink size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>

                <h4 className="font-bold text-[17px] mb-2 text-foreground">
                    Grow faster on 𝕏
                </h4>

                <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">
                    Understand your audience, refine your content, and accelerate your 𝕏 growth, all in one place.
                </p>

                <div className="flex flex-wrap gap-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background/50 border border-border/50 text-[11px] font-medium text-muted-foreground shadow-sm">
                        <Search size={10} className="text-orange-500" />
                        Hidden insights
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background/50 border border-border/50 text-[11px] font-medium text-muted-foreground shadow-sm">
                        <BarChart3 size={10} className="text-orange-500" />
                        Smart analytics
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background/50 border border-border/50 text-[11px] font-medium text-muted-foreground shadow-sm">
                        <TrendingUp size={10} className="text-yellow-500" />
                        Actionable data
                    </div>
                </div>
            </div>


        </a>
    );
}
