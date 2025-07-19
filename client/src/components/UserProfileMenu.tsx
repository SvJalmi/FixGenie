import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
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
  Code,
  ExternalLink,
  Mail,
  Calendar
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface UserProfileMenuProps {
  className?: string;
}

export default function UserProfileMenu({ className }: UserProfileMenuProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);
  const [isUsageBillingOpen, setIsUsageBillingOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const userId = 1; // In real app this would come from auth context

  // Fetch real user profile data
  const { data: userData, isLoading } = useQuery({
    queryKey: ["/api/user/profile", userId],
    queryFn: async () => {
      const response = await fetch(`/api/user/profile/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user profile");
      return response.json();
    }
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/auth/logout', {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      });
      // In a real app, redirect to login page
      window.location.href = '/';
    },
    onError: () => {
      toast({
        title: "Logout failed",
        description: "There was an error signing you out.",
        variant: "destructive",
      });
    }
  });

  const handleSignOut = () => {
    logoutMutation.mutate();
  };

  const handleViewProfile = () => {
    setIsProfileOpen(true);
  };

  const handleAccountSettings = () => {
    setIsAccountSettingsOpen(true);
  };

  const handleUsageBilling = () => {
    setIsUsageBillingOpen(true);
  };

  const handleHelpSupport = () => {
    setIsHelpOpen(true);
  };

  if (isLoading || !userData) {
    return (
      <Button variant="ghost" className={`p-0 w-8 h-8 rounded-full ${className}`}>
        <Avatar className="w-8 h-8 shadow-glow border border-blue-500/20">
          <AvatarFallback className="bg-gradient-primary text-white text-sm font-bold animate-pulse">
            ...
          </AvatarFallback>
        </Avatar>
      </Button>
    );
  }

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
            onClick={handleViewProfile}
            className="flex items-center gap-3 p-3 hover:bg-blue-500/10 transition-colors cursor-pointer"
          >
            <User className="w-4 h-4 text-accent-blue" />
            <span className="text-text-primary">View Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={handleAccountSettings}
            className="flex items-center gap-3 p-3 hover:bg-blue-500/10 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4 text-accent-cyan" />
            <span className="text-text-primary">Account Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={handleUsageBilling}
            className="flex items-center gap-3 p-3 hover:bg-blue-500/10 transition-colors cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-accent-purple" />
            <span className="text-text-primary">Usage & Billing</span>
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={handleHelpSupport}
            className="flex items-center gap-3 p-3 hover:bg-blue-500/10 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-accent-green" />
            <span className="text-text-primary">Help & Support</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-blue-500/20" />

          <DropdownMenuItem 
            onClick={handleSignOut}
            className="flex items-center gap-3 p-3 hover:bg-red-500/10 transition-colors text-red-400 cursor-pointer"
            disabled={logoutMutation.isPending}
          >
            <LogOut className="w-4 h-4" />
            <span>{logoutMutation.isPending ? "Signing out..." : "Sign Out"}</span>
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

      {/* Account Settings Modal */}
      <Dialog open={isAccountSettingsOpen} onOpenChange={setIsAccountSettingsOpen}>
        <DialogContent className="max-w-2xl bg-dark-elevated border border-blue-500/20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-text-primary">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Settings className="w-5 h-5 text-white" />
              </div>
              Account Settings
            </DialogTitle>
            <DialogDescription className="text-text-secondary">
              Manage your account preferences and security settings
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 glass rounded-xl space-y-3">
                <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                  <Mail className="w-5 h-5 text-accent-blue" />
                  Email & Notifications
                </h3>
                <p className="text-sm text-text-secondary">
                  Current: {userData?.email}
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Update Email
                </Button>
              </div>

              <div className="p-4 glass rounded-xl space-y-3">
                <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                  <Settings className="w-5 h-5 text-accent-cyan" />
                  Preferences
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Dark Theme</span>
                    <Badge variant="secondary">Enabled</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Notifications</span>
                    <Badge variant="secondary">On</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Usage & Billing Modal */}
      <Dialog open={isUsageBillingOpen} onOpenChange={setIsUsageBillingOpen}>
        <DialogContent className="max-w-2xl bg-dark-elevated border border-blue-500/20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-text-primary">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              Usage & Billing
            </DialogTitle>
            <DialogDescription className="text-text-secondary">
              Your current plan usage and billing information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Current Plan */}
            <div className="p-4 glass rounded-xl">
              <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2 mb-3">
                <Crown className="w-5 h-5 text-accent-orange" />
                Current Plan: {userData?.plan}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center space-y-1">
                  <div className="text-2xl font-bold text-accent-blue">2.4K</div>
                  <div className="text-xs text-text-secondary">Characters Used</div>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-2xl font-bold text-accent-green">50M</div>
                  <div className="text-xs text-text-secondary">Monthly Limit</div>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-2xl font-bold text-accent-purple">{userData?.totalAnalyses || 0}</div>
                  <div className="text-xs text-text-secondary">Analyses</div>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-2xl font-bold text-accent-orange">{userData?.languagesUsed || 0}</div>
                  <div className="text-xs text-text-secondary">Languages</div>
                </div>
              </div>
            </div>

            {/* Billing History */}
            <div className="p-4 glass rounded-xl space-y-3">
              <h3 className="text-lg font-semibold text-text-primary">Recent Billing</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-dark/20 rounded">
                  <span className="text-text-secondary">December 2024</span>
                  <Badge variant="secondary">$29.99 - Paid</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-dark/20 rounded">
                  <span className="text-text-secondary">November 2024</span>
                  <Badge variant="secondary">$29.99 - Paid</Badge>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Help & Support Modal */}
      <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <DialogContent className="max-w-2xl bg-dark-elevated border border-blue-500/20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-text-primary">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              Help & Support
            </DialogTitle>
            <DialogDescription className="text-text-secondary">
              Get help with FixGenie and contact our support team
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Quick Help */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 glass rounded-xl space-y-3 cursor-pointer hover:bg-blue-500/5 transition-colors">
                <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-accent-blue" />
                  Documentation
                </h3>
                <p className="text-sm text-text-secondary">
                  Learn how to use all FixGenie features
                </p>
              </div>

              <div className="p-4 glass rounded-xl space-y-3 cursor-pointer hover:bg-blue-500/5 transition-colors">
                <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                  <Mail className="w-5 h-5 text-accent-green" />
                  Contact Support
                </h3>
                <p className="text-sm text-text-secondary">
                  Get direct help from our team
                </p>
              </div>
            </div>

            {/* FAQ */}
            <div className="p-4 glass rounded-xl space-y-3">
              <h3 className="text-lg font-semibold text-text-primary">Frequently Asked Questions</h3>
              <div className="space-y-2">
                <details className="p-2 bg-dark/20 rounded cursor-pointer">
                  <summary className="text-sm font-medium text-text-primary">How do I analyze code in different languages?</summary>
                  <p className="text-xs text-text-secondary mt-2">
                    Simply paste your code, select the language from the dropdown, and click "Analyze Code".
                  </p>
                </details>
                <details className="p-2 bg-dark/20 rounded cursor-pointer">
                  <summary className="text-sm font-medium text-text-primary">How does the AI mentor work?</summary>
                  <p className="text-xs text-text-secondary mt-2">
                    The AI mentor provides personalized guidance and suggestions based on your code patterns.
                  </p>
                </details>
                <details className="p-2 bg-dark/20 rounded cursor-pointer">
                  <summary className="text-sm font-medium text-text-primary">What languages are supported?</summary>
                  <p className="text-xs text-text-secondary mt-2">
                    FixGenie supports 320+ programming languages across 35+ specialized categories.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}