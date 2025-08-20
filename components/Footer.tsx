import Link from "next/link";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <div className="z-20 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-indigo-100">
      <div className="mx-4 md:mx-8 flex h-14 items-center justify-center">
        <div className="w-full flex items-center justify-center gap-3 text-sm">
          <span className="text-muted-foreground">Made by</span>
          <span className="font-semibold bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">Rajat Shukla</span>
          <span className="text-muted-foreground">•</span>
          <Link
            href="https://github.com/RSHUKL"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-indigo-600 hover:text-fuchsia-600"
          >
            <Github size={16} />
            <span>github.com/RSHUKL</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
