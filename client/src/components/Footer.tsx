import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Code, Heart, Zap, Shield, Users, Target } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-elevated border-t border-border glass-card mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* FixGenie Branding */}
          <div className="flex flex-col items-center lg:items-start gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-accent-purple to-accent-blue bg-clip-text text-transparent">
                  FixGenie
                </h3>
                <Badge variant="secondary" className="bg-gradient-primary text-white text-xs shadow-glow">
                  Revolutionary AI Platform
                </Badge>
              </div>
            </div>
            <p className="text-sm text-white/80 text-center lg:text-left max-w-md">
              The world's most advanced AI-powered code analysis platform with mentorship, 
              real-time collaboration, and intelligent code generation across 150+ programming languages.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 glass rounded-lg p-3">
              <Target className="h-4 w-4 text-accent-cyan" />
              <span className="text-xs text-white/90">AI Mentorship</span>
            </div>
            <div className="flex items-center gap-2 glass rounded-lg p-3">
              <Zap className="h-4 w-4 text-accent-orange" />
              <span className="text-xs text-white/90">Code Optimization</span>
            </div>
            <div className="flex items-center gap-2 glass rounded-lg p-3">
              <Shield className="h-4 w-4 text-accent-blue" />
              <span className="text-xs text-white/90">Security Audit</span>
            </div>
            <div className="flex items-center gap-2 glass rounded-lg p-3">
              <Users className="h-4 w-4 text-accent-green" />
              <span className="text-xs text-white/90">Collaboration</span>
            </div>
            <div className="flex items-center gap-2 glass rounded-lg p-3">
              <Code className="h-4 w-4 text-accent-purple" />
              <span className="text-xs text-white/90">150+ Languages</span>
            </div>
            <div className="flex items-center gap-2 glass rounded-lg p-3">
              <Heart className="h-4 w-4 text-accent-pink" />
              <span className="text-xs text-white/90">Built with AI</span>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-white/70">
            <span>© 2025 FixGenie. All rights reserved.</span>
            <span>•</span>
            <span>Powered by GPT-4o & Murf AI</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs border-accent-green/30 text-accent-green">
              Version 2.0
            </Badge>
            <Badge variant="outline" className="text-xs border-accent-blue/30 text-accent-blue">
              Next-Gen AI
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  );
}