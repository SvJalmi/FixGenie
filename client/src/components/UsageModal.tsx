import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Zap, 
  Crown,
  RefreshCw,
  Calendar,
  Target
} from "lucide-react";

interface UsageModalProps {
  isOpen: boolean;
  onClose: () => void;
  charactersUsed: number;
  maxCharacters: number;
}

interface UsageData {
  daily: number;
  weekly: number;
  monthly: number;
  resetDate: string;
  planName: string;
  upgradeAvailable: boolean;
}

export default function UsageModal({ 
  isOpen, 
  onClose, 
  charactersUsed, 
  maxCharacters 
}: UsageModalProps) {
  const [usageData, setUsageData] = useState<UsageData>({
    daily: 0,
    weekly: 0,
    monthly: 0,
    resetDate: "July 26, 2025",
    planName: "Pro",
    upgradeAvailable: false
  });

  const usagePercentage = (charactersUsed / maxCharacters) * 100;
  const remaining = maxCharacters - charactersUsed;
  
  // Simulate fetching usage data
  useEffect(() => {
    if (isOpen) {
      // Simulate API call to fetch usage statistics
      setTimeout(() => {
        setUsageData({
          daily: Math.floor(charactersUsed * 0.15), // 15% of total used today
          weekly: Math.floor(charactersUsed * 0.6),  // 60% of total used this week
          monthly: charactersUsed,
          resetDate: "July 26, 2025",
          planName: "Pro",
          upgradeAvailable: usagePercentage > 80
        });
      }, 300);
    }
  }, [isOpen, charactersUsed, usagePercentage]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getUsageColor = (percentage: number): string => {
    if (percentage >= 90) return "text-red-400";
    if (percentage >= 75) return "text-orange-400";
    if (percentage >= 50) return "text-yellow-400";
    return "text-green-400";
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-orange-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-dark-elevated border border-blue-500/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-text-primary">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            API Usage & Billing
            <Badge variant="secondary" className="bg-accent-blue/20 text-accent-blue">
              {usageData.planName} Plan
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-text-secondary">
            Monitor your FixGenie API usage and plan details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main Usage Overview */}
          <div className="p-6 glass rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent-blue" />
                Current Usage
              </h3>
              <div className={`text-2xl font-bold ${getUsageColor(usagePercentage)}`}>
                {usagePercentage.toFixed(1)}%
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Characters Used</span>
                <span className="text-text-primary font-medium">
                  {formatNumber(charactersUsed)} / {formatNumber(maxCharacters)}
                </span>
              </div>
              <div className="w-full h-3 bg-dark rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${getProgressColor(usagePercentage)}`}
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-text-tertiary">
                <span>0</span>
                <span className="text-text-primary font-medium">
                  {formatNumber(remaining)} remaining
                </span>
                <span>{formatNumber(maxCharacters)}</span>
              </div>
            </div>

            {usagePercentage > 75 && (
              <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-orange-400 text-sm">
                  <Target className="w-4 h-4" />
                  <span className="font-medium">Usage Warning</span>
                </div>
                <p className="text-xs text-orange-300 mt-1">
                  You've used {usagePercentage.toFixed(0)}% of your monthly limit. Consider upgrading your plan.
                </p>
              </div>
            )}
          </div>

          {/* Usage Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 glass rounded-xl text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-5 h-5 text-accent-green" />
                <span className="text-sm font-medium text-text-primary">Today</span>
              </div>
              <div className="text-2xl font-bold text-accent-green">
                {formatNumber(usageData.daily)}
              </div>
              <div className="text-xs text-text-secondary">characters</div>
            </div>

            <div className="p-4 glass rounded-xl text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-5 h-5 text-accent-blue" />
                <span className="text-sm font-medium text-text-primary">This Week</span>
              </div>
              <div className="text-2xl font-bold text-accent-blue">
                {formatNumber(usageData.weekly)}
              </div>
              <div className="text-xs text-text-secondary">characters</div>
            </div>

            <div className="p-4 glass rounded-xl text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent-purple" />
                <span className="text-sm font-medium text-text-primary">This Month</span>
              </div>
              <div className="text-2xl font-bold text-accent-purple">
                {formatNumber(usageData.monthly)}
              </div>
              <div className="text-xs text-text-secondary">characters</div>
            </div>
          </div>

          {/* Plan Details */}
          <div className="p-6 glass rounded-xl space-y-4">
            <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <Crown className="w-5 h-5 text-accent-orange" />
              Plan Details
            </h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="text-text-secondary">Current Plan:</div>
                <div className="text-text-primary font-medium flex items-center gap-2">
                  {usageData.planName}
                  <Badge className="bg-gradient-primary text-white text-xs">
                    Active
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-text-secondary">Next Reset:</div>
                <div className="text-text-primary font-medium flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-accent-cyan" />
                  {usageData.resetDate}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-text-secondary">Monthly Limit:</div>
                <div className="text-text-primary font-medium">
                  {formatNumber(maxCharacters)} characters
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-text-secondary">Features:</div>
                <div className="text-text-primary font-medium">
                  AI Analysis, TTS, Collaboration
                </div>
              </div>
            </div>

            {usageData.upgradeAvailable && (
              <div className="mt-4 p-4 bg-gradient-primary/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-text-primary">Upgrade Available</div>
                    <div className="text-sm text-text-secondary">
                      Get more characters and premium features
                    </div>
                  </div>
                  <Button className="bg-gradient-primary hover:opacity-90 text-white">
                    Upgrade Now
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 border-dark-border text-text-primary hover:bg-dark-elevated">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Usage
            </Button>
            <Button variant="outline" className="flex-1 border-dark-border text-text-primary hover:bg-dark-elevated">
              <TrendingUp className="w-4 h-4 mr-2" />
              View History
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}