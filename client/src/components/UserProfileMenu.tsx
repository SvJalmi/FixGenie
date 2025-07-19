import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  User, 
  Settings, 
  BarChart3, 
  Crown, 
  LogOut, 
  HelpCircle, 
  Star, 
  Trophy,
  Zap,
  Code
} from "lucide-react";

interface UserProfileMenuProps {
  className?: string;
}

export default function UserProfileMenu({ className }: UserProfileMenuProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Mock user data - in real app this would come from auth context
  const userData = {
    name: "User",
    email: "user@fixgenie.ai",
    plan: "Pro",
    level: 42,
    experience: 15840,
    nextLevelExp: 16500,
    achievements: 24,
    codesSolved: 156,
    joinDate: "March 2024"
  };

  const expProgress = ((userData.experience % 1000) / 1000) * 100;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={`p-0 w-8 h-8 rounded-full ${className}`}>
            <Avatar className="w-8 h-8 shadow-glow border border-blue-500/20">
              <AvatarFallback className="bg-gradient-primary text-white text-sm font-bold">
                U
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-72 bg-dark-elevated border border-blue-500/20 shadow-xl"
        >
          <DropdownMenuLabel className="pb-2">
            <div className="flex items-center gap-3 p-2">
              <Avatar className="w-12 h-12 shadow-glow">
                <AvatarFallback className="bg-gradient-primary text-white font-bold text-lg">
                  U
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-text-primary">{userData.name}</h3>
                  <Badge variant="secondary" className="bg-gradient-primary text-white text-xs">
                    <Crown className="w-3 h-3 mr-1" />
                    {userData.plan}
                  </Badge>
                </div>
                <p className="text-xs text-text-secondary">{userData.email}</p>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 text-accent-blue">
                    <Star className="w-3 h-3" />
                    <span>Level {userData.level}</span>
                  </div>
                  <div className="flex-1 h-1 bg-dark rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-primary transition-all duration-500"
                      style={{ width: `${expProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-blue-500/20" />

          {/* Quick Stats */}
          <div className="p-3 space-y-2">
            <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wide">
              Quick Stats
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-xs">
                <Trophy className="w-4 h-4 text-accent-orange" />
                <span className="text-text-secondary">{userData.achievements} Achievements</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Code className="w-4 h-4 text-accent-green" />
                <span className="text-text-secondary">{userData.codesSolved} Codes Fixed</span>
              </div>
            </div>
          </div>

          <DropdownMenuSeparator className="bg-blue-500/20" />

          <DropdownMenuItem 
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-3 p-3 hover:bg-blue-500/10 transition-colors"
          >
            <User className="w-4 h-4 text-accent-blue" />
            <span className="text-text-primary">View Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-3 p-3 hover:bg-blue-500/10 transition-colors">
            <Settings className="w-4 h-4 text-accent-cyan" />
            <span className="text-text-primary">Account Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-3 p-3 hover:bg-blue-500/10 transition-colors">
            <BarChart3 className="w-4 h-4 text-accent-purple" />
            <span className="text-text-primary">Usage & Billing</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-3 p-3 hover:bg-blue-500/10 transition-colors">
            <HelpCircle className="w-4 h-4 text-accent-green" />
            <span className="text-text-primary">Help & Support</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-blue-500/20" />

          <DropdownMenuItem className="flex items-center gap-3 p-3 hover:bg-red-500/10 transition-colors text-red-400">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Detailed Profile Modal */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-2xl bg-dark-elevated border border-blue-500/20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-text-primary">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              User Profile
              <Badge variant="secondary" className="bg-accent-blue/20 text-accent-blue">
                Pro Member
              </Badge>
            </DialogTitle>
            <DialogDescription className="text-text-secondary">
              Your FixGenie coding journey and achievements
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-4 p-4 glass rounded-xl">
              <Avatar className="w-20 h-20 shadow-glow border-2 border-blue-500/30">
                <AvatarFallback className="bg-gradient-primary text-white font-bold text-2xl">
                  U
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-text-primary">{userData.name}</h2>
                  <Badge className="bg-gradient-primary text-white">
                    <Crown className="w-4 h-4 mr-1" />
                    {userData.plan} Member
                  </Badge>
                </div>
                <p className="text-text-secondary">{userData.email}</p>
                <p className="text-sm text-text-tertiary">Member since {userData.joinDate}</p>
                
                {/* Experience Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-accent-blue font-medium">Level {userData.level}</span>
                    <span className="text-text-secondary">{userData.experience}/{userData.nextLevelExp} XP</span>
                  </div>
                  <div className="w-full h-3 bg-dark rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-primary transition-all duration-1000 rounded-full"
                      style={{ width: `${expProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 glass rounded-xl text-center space-y-2">
                <Trophy className="w-8 h-8 text-accent-orange mx-auto" />
                <div className="text-2xl font-bold text-text-primary">{userData.achievements}</div>
                <div className="text-sm text-text-secondary">Achievements</div>
              </div>
              
              <div className="p-4 glass rounded-xl text-center space-y-2">
                <Code className="w-8 h-8 text-accent-green mx-auto" />
                <div className="text-2xl font-bold text-text-primary">{userData.codesSolved}</div>
                <div className="text-sm text-text-secondary">Codes Fixed</div>
              </div>
              
              <div className="p-4 glass rounded-xl text-center space-y-2">
                <Zap className="w-8 h-8 text-accent-blue mx-auto" />
                <div className="text-2xl font-bold text-text-primary">{userData.level}</div>
                <div className="text-sm text-text-secondary">Current Level</div>
              </div>
              
              <div className="p-4 glass rounded-xl text-center space-y-2">
                <Star className="w-8 h-8 text-accent-purple mx-auto" />
                <div className="text-2xl font-bold text-text-primary">4.9</div>
                <div className="text-sm text-text-secondary">Rating</div>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Trophy className="w-5 h-5 text-accent-orange" />
                Recent Achievements
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 glass rounded-lg">
                  <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
                  <span className="text-text-primary">Code Master - Fixed 150+ code issues</span>
                  <Badge variant="secondary" className="ml-auto bg-accent-green/20 text-accent-green text-xs">
                    New
                  </Badge>
                </div>
                <div className="flex items-center gap-3 p-3 glass rounded-lg">
                  <div className="w-2 h-2 bg-accent-blue rounded-full" />
                  <span className="text-text-primary">Language Explorer - Used 25+ programming languages</span>
                </div>
                <div className="flex items-center gap-3 p-3 glass rounded-lg">
                  <div className="w-2 h-2 bg-accent-purple rounded-full" />
                  <span className="text-text-primary">AI Collaborator - Completed 100 AI-assisted fixes</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}