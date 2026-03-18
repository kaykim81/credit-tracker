import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { WalletCards, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  showBack?: boolean;
  title?: string;
}

export function Layout({ children, showBack = false, title }: LayoutProps) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 inset-x-0 h-[500px] pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-[100px] -left-[200px] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[100px]" />
      </div>

      <header className="sticky top-0 z-50 glass-panel border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBack && (
              <Link 
                href="/" 
                className="p-2 -ml-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
            )}
            
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
                <WalletCards className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-lg hidden sm:block tracking-tight text-foreground">
                Cred<span className="text-primary">Sync</span>
              </span>
            </Link>

            {title && (
              <>
                <div className="w-px h-5 bg-border mx-2 hidden sm:block" />
                <h1 className="font-display font-semibold text-foreground/90">{title}</h1>
              </>
            )}
          </div>
          
          <div className="flex items-center">
            {/* Could put user profile or settings here later */}
            <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-0">
        <motion.div
          key={location}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
