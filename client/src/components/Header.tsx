import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BarChart3, Settings, Wand2, Menu, X } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  charactersUsed: number;
  maxCharacters: number;
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

export default function Header({ 
  charactersUsed, 
  maxCharacters, 
  onMenuToggle, 
  isMenuOpen = false 
}: HeaderProps) {
  const isMobile = useMobile();
  const usagePercentage = (charactersUsed / maxCharacters) * 100;

  return (
    <header className="bg-white border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
          {/* Mobile Menu Button */}
          {isMobile && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onMenuToggle}
              className="p-1 lg:hidden mobile-touch-friendly hover:bg-white/10"
            >
              {isMenuOpen ? (
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              ) : (
                <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              )}
            </Button>
          )}
          
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
            <div className="header-logo w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <Wand2 className="text-white w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" />
            </div>
            <h1 className="header-title text-base sm:text-lg md:text-xl font-bold text-black">
              FixGenie
            </h1>
            <Badge variant="secondary" className="bg-gradient-primary text-white text-xs shadow-glow hidden sm:inline-flex">
              AI-Powered
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
          {/* Voice Status Indicator - Hidden on small screens */}
          <div className="hidden lg:flex items-center space-x-2 glass rounded-lg px-3 py-2 shadow-success">
            <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
            <span className="text-sm text-secondary">Murf TTS Ready</span>
          </div>
          
          {/* API Usage - Responsive sizing */}
          <div className="flex items-center space-x-1 md:space-x-2 text-secondary glass rounded-lg px-2 py-1">
            <BarChart3 className="w-3 h-3 md:w-4 md:h-4 text-accent-cyan" />
            <span className="text-xs md:text-sm">
              {isMobile 
                ? `${(charactersUsed / 1000).toFixed(0)}K`
                : `${(charactersUsed / 1000).toFixed(1)}K / ${(maxCharacters / 1000000).toFixed(0)}M chars`
              }
            </span>
          </div>
          
          {/* User Menu */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
            <Button variant="ghost" size="sm" className="mobile-touch-friendly glass hover:shadow-glow/50 transition-all">
              <Settings className="w-3 h-3 md:w-4 md:h-4 text-secondary" />
            </Button>
            <Avatar className="w-6 h-6 md:w-8 md:h-8 shadow-glow">
              <AvatarFallback className="bg-gradient-primary text-white text-xs md:text-sm">
                U
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
