import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Target, 
  Zap, 
  Shield, 
  Users, 
  Code, 
  Heart,
  ArrowRight,
  Play,
  Star,
  ChevronRight
} from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: Target,
      title: "AI Mentorship",
      description: "Personalized learning paths with GPT-4o powered code analysis and intelligent error detection",
      color: "text-accent-cyan"
    },
    {
      icon: Zap,
      title: "Code Optimization",
      description: "Real-time performance improvements and smart refactoring suggestions with safety assessments",
      color: "text-accent-orange"
    },
    {
      icon: Shield,
      title: "Security Audit",
      description: "Comprehensive vulnerability detection with OWASP compliance checking and risk scoring",
      color: "text-accent-blue"
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Real-time multi-user code editing with voice annotations and session management",
      color: "text-accent-green"
    },
    {
      icon: Code,
      title: "320+ Languages",
      description: "Universal support across all major programming languages and specialized categories",
      color: "text-accent-purple"
    },
    {
      icon: Heart,
      title: "Built with AI",
      description: "Powered by cutting-edge AI with high-quality text-to-speech explanations",
      color: "text-accent-pink"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        
        {/* Main Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto space-y-8">
          {/* Logo and Title */}
          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow animate-pulse">
                <Code className="w-10 h-10 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-6xl md:text-7xl font-bold text-white tracking-tight">
                  FixGenie
                </h1>
                <Badge variant="secondary" className="bg-gradient-primary text-white text-sm shadow-glow mt-2">
                  Revolutionary AI Platform
                </Badge>
              </div>
            </div>
            
            {/* Tagline */}
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl text-text-secondary font-medium leading-relaxed">
                The world's most advanced AI-powered code analysis platform with
              </h2>
              <h3 className="text-xl md:text-2xl text-text-primary font-semibold">
                mentorship, real-time collaboration, and intelligent code generation
              </h3>
              <h4 className="text-lg md:text-xl text-accent-blue font-medium">
                across <span className="text-accent-purple font-bold">320+</span> programming languages.
              </h4>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group relative p-6 glass rounded-2xl border border-blue-500/10 hover:border-blue-500/30 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-glow"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <div className={`p-4 rounded-xl glass group-hover:shadow-glow transition-all duration-300`}>
                      <IconComponent className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary group-hover:text-white transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-text-secondary group-hover:text-text-primary transition-colors leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 rounded-2xl transition-all duration-500" />
                </div>
              );
            })}
          </div>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-16">
            <Link href="/dashboard">
              <Button 
                size="lg"
                className="bg-gradient-primary hover:opacity-90 text-white font-semibold px-8 py-4 rounded-xl shadow-glow transition-all duration-200 hover:scale-105 flex items-center gap-3"
              >
                <Play className="w-5 h-5" />
                Start Analyzing Code
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-blue-500/30 text-text-primary hover:bg-blue-500/10 px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105 flex items-center gap-3"
            >
              <Star className="w-5 h-5" />
              View Features
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 pt-8 border-t border-blue-500/10">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-blue">320+</div>
              <div className="text-sm text-text-secondary">Programming Languages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-green">AI-Powered</div>
              <div className="text-sm text-text-secondary">Error Detection</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-purple">Real-time</div>
              <div className="text-sm text-text-secondary">Code Analysis</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}