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
    <header className="bg-dark-elevated border-b border-dark-border px-4 md:px-6 py-3 md:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 md:space-x-4">
          {/* Mobile Menu Button */}
          {isMobile && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onMenuToggle}
              className="p-1 md:hidden mobile-touch-friendly"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-text-primary" />
              ) : (
                <Menu className="w-5 h-5 text-text-primary" />
              )}
            </Button>
          )}
          
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-primary-blue rounded-lg flex items-center justify-center">
              <Wand2 className="text-white w-3 h-3 md:w-4 md:h-4" />
            </div>
            <h1 className="text-lg md:text-xl font-bold text-text-primary">FixGenie</h1>
            <Badge variant="secondary" className="bg-primary-blue/20 text-primary-blue text-xs">
              Beta
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Voice Status Indicator - Hidden on mobile */}
          {!isMobile && (
            <div className="flex items-center space-x-2 bg-dark border border-dark-border rounded-lg px-3 py-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm text-text-secondary">Murf TTS Ready</span>
            </div>
          )}
          
          {/* API Usage - Simplified on mobile */}
          <div className="flex items-center space-x-1 md:space-x-2 text-text-secondary">
            <BarChart3 className="w-3 h-3 md:w-4 md:h-4" />
            <span className="text-xs md:text-sm">
              {isMobile 
                ? `${(charactersUsed / 1000).toFixed(0)}K`
                : `${(charactersUsed / 1000).toFixed(1)}K / ${(maxCharacters / 1000000).toFixed(0)}M chars`
              }
            </span>
          </div>
          
          {/* User Menu */}
          <div className="flex items-center space-x-2 md:space-x-3">
            <Button variant="ghost" size="sm" className="mobile-touch-friendly">
              <Settings className="w-3 h-3 md:w-4 md:h-4 text-text-secondary" />
            </Button>
            <Avatar className="w-6 h-6 md:w-8 md:h-8">
              <AvatarFallback className="bg-primary-blue text-white text-xs md:text-sm">
                U
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
