import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Brain, Shield, Zap, Target, TrendingUp, Award, BookOpen, Code2, CheckCircle, AlertTriangle, Lightbulb, Star, Clock } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMobile } from "@/hooks/use-mobile";

interface AIMentorProps {
  code: string;
  language: string;
  onCodeSuggestion?: (suggestion: any) => void;
}

export function AIMentor({ code, language, onCodeSuggestion }: AIMentorProps) {
  const [activeTab, setActiveTab] = useState("mentorship");
  const isMobile = useMobile();

  // Mentorship query
  const mentorshipMutation = useMutation({
    mutationFn: async ({ code, language }: { code: string; language: string }) => {
      return apiRequest("/api/ai-mentor/mentorship", {
        method: "POST",
        body: { code, language }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
    }
  });

  // Code optimization query
  const optimizationMutation = useMutation({
    mutationFn: async ({ code, language, goals }: { code: string; language: string; goals: string[] }) => {
      return apiRequest("/api/ai-mentor/optimize", {
        method: "POST",
        body: { code, language, goals }
      });
    }
  });

  // Security audit query
  const securityMutation = useMutation({
    mutationFn: async ({ code, language }: { code: string; language: string }) => {
      return apiRequest("/api/ai-mentor/security-audit", {
        method: "POST",
        body: { code, language }
      });
    }
  });

  // Intelligent suggestions query
  const suggestionsMutation = useMutation({
    mutationFn: async ({ code, language }: { code: string; language: string }) => {
      return apiRequest("/api/codegen/suggestions", {
        method: "POST",
        body: { code, language, context: { projectType: "web", frameworks: ["react"] } }
      });
    }
  });

  const generateMentorship = () => {
    if (code.trim()) {
      mentorshipMutation.mutate({ code, language });
    }
  };

  const generateOptimization = () => {
    if (code.trim()) {
      optimizationMutation.mutate({ code, language, goals: ["performance", "readability", "maintainability"] });
    }
  };

  const generateSecurityAudit = () => {
    if (code.trim()) {
      securityMutation.mutate({ code, language });
    }
  };

  const generateSuggestions = () => {
    if (code.trim()) {
      suggestionsMutation.mutate({ code, language });
    }
  };

  const renderSkillLevel = (level: string) => {
    const levels = { beginner: 25, intermediate: 50, advanced: 75, expert: 100 };
    return (
      <div className="flex items-center gap-2">
        <Progress value={levels[level as keyof typeof levels] || 0} className="w-20 h-2" />
        <Badge variant={level === "expert" ? "default" : level === "advanced" ? "secondary" : "outline"}>
          {level}
        </Badge>
      </div>
    );
  };

  return (
    <div className="w-full space-y-3 md:space-y-4 ai-mentor-container">
      <div className={`flex items-center gap-2 mb-3 md:mb-4 ${isMobile ? 'justify-center' : ''}`}>
        <Brain className="h-5 w-5 md:h-6 md:w-6 text-accent-purple" />
        <h2 className={`${isMobile ? 'text-lg' : 'text-xl md:text-2xl'} font-bold bg-gradient-to-r from-accent-purple to-accent-blue bg-clip-text text-transparent`}>
          AI Mentor
        </h2>
        <Badge variant="secondary" className="bg-gradient-primary text-white shadow-glow">
          Advanced
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2 gap-1' : 'grid-cols-4'} glass-card border-border`}>
          <TabsTrigger 
            value="mentorship" 
            className={`flex items-center gap-1 ${isMobile ? 'flex-col text-xs px-2 py-3' : 'text-sm'} transition-all hover:shadow-glow/50`}
          >
            <BookOpen className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
            <span className={isMobile ? 'text-xs' : ''}>{isMobile ? 'Learn' : 'Mentorship'}</span>
          </TabsTrigger>
          <TabsTrigger 
            value="optimization" 
            className={`flex items-center gap-1 ${isMobile ? 'flex-col text-xs px-2 py-3' : 'text-sm'} transition-all hover:shadow-glow/50`}
          >
            <Zap className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
            <span className={isMobile ? 'text-xs' : ''}>{isMobile ? 'Optimize' : 'Optimize'}</span>
          </TabsTrigger>
          <TabsTrigger 
            value="security" 
            className={`flex items-center gap-1 ${isMobile ? 'flex-col text-xs px-2 py-3' : 'text-sm'} transition-all hover:shadow-glow/50`}
          >
            <Shield className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
            <span className={isMobile ? 'text-xs' : ''}>{isMobile ? 'Secure' : 'Security'}</span>
          </TabsTrigger>
          <TabsTrigger 
            value="suggestions" 
            className={`flex items-center gap-1 ${isMobile ? 'flex-col text-xs px-2 py-3' : 'text-sm'} transition-all hover:shadow-glow/50`}
          >
            <Code2 className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
            <span className={isMobile ? 'text-xs' : ''}>{isMobile ? 'Smart' : 'Suggestions'}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mentorship" className="space-y-3 md:space-y-4">
          <Card className="glass-card border-border shadow-glow/20">
            <CardHeader className={`${isMobile ? 'p-4 pb-2' : 'p-6'}`}>
              <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-base' : 'text-lg'}`}>
                <Target className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-accent-purple`} />
                Personalized Mentorship
              </CardTitle>
              <CardDescription className={`${isMobile ? 'text-xs' : 'text-sm'}`}>
                Get AI-powered mentorship tailored to your coding journey and skill level.
              </CardDescription>
            </CardHeader>
            <CardContent className={`space-y-3 md:space-y-4 ${isMobile ? 'p-4 pt-0' : 'p-6 pt-0'}`}>
              <Button 
                onClick={generateMentorship} 
                disabled={mentorshipMutation.isPending || !code.trim()}
                className={`w-full bg-gradient-primary hover:shadow-glow transition-all ${isMobile ? 'py-2 text-sm' : 'py-3'}`}
              >
                {mentorshipMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Brain className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                    Generate Mentorship
                  </div>
                )}
              </Button>

              {mentorshipMutation.data && (
                <ScrollArea className={`${isMobile ? 'h-[50vh]' : 'h-[60vh]'} w-full`}>
                  <div className="space-y-3 md:space-y-4 pr-2">
                    <div className="glass rounded-lg p-3 md:p-4 border border-border">
                      <h4 className={`font-semibold mb-2 flex items-center gap-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
                        <Lightbulb className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-accent-cyan`} />
                        Personalized Feedback
                      </h4>
                      <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-secondary glass p-3 rounded-lg`}>
                        {mentorshipMutation.data.personalizedFeedback}
                      </p>
                    </div>

                    <div className="glass rounded-lg p-3 md:p-4 border border-border">
                      <h4 className={`font-semibold mb-3 flex items-center gap-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
                        <Star className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-accent-orange`} />
                        Skill Assessment
                      </h4>
                      <div className="space-y-3">
                        <div className={`flex items-center justify-between ${isMobile ? 'flex-col gap-2' : ''}`}>
                          <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Overall Level:</span>
                          <div className={`${isMobile ? 'w-full' : ''}`}>
                            {renderSkillLevel(mentorshipMutation.data.skillAssessment.overallLevel)}
                          </div>
                        </div>
                        <div>
                          <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-accent-green`}>Strengths:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {mentorshipMutation.data.skillAssessment.strengths.map((strength: string, index: number) => (
                              <Badge key={index} variant="secondary" className={`${isMobile ? 'text-xs px-2 py-1' : 'text-xs'} bg-accent-green/20 text-accent-green border-accent-green/30`}>
                                {strength}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-accent-orange`}>Areas to Improve:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {mentorshipMutation.data.skillAssessment.weaknesses.map((weakness: string, index: number) => (
                              <Badge key={index} variant="outline" className={`${isMobile ? 'text-xs px-2 py-1' : 'text-xs'} border-accent-orange/50 text-accent-orange`}>
                                {weakness}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="glass rounded-lg p-3 md:p-4 border border-border">
                      <h4 className={`font-semibold mb-3 flex items-center gap-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
                        <Target className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-accent-blue`} />
                        Learning Path
                      </h4>
                      <div className="space-y-2">
                        <div className={`flex items-center justify-between ${isMobile ? 'flex-col gap-2' : ''}`}>
                          <h5 className={`font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>{mentorshipMutation.data.learningPath.title}</h5>
                          <Badge className="bg-gradient-primary text-white">{mentorshipMutation.data.learningPath.difficulty}</Badge>
                        </div>
                        <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-secondary glass p-3 rounded-lg`}>
                          {mentorshipMutation.data.learningPath.description}
                        </p>
                        <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-accent-cyan flex items-center gap-2`}>
                          <Clock className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                          Estimated time: {mentorshipMutation.data.learningPath.estimatedTime}
                        </div>
                      </div>
                    </div>

                    <div className="glass rounded-lg p-3 md:p-4 border border-border">
                      <h4 className={`font-semibold mb-3 flex items-center gap-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
                        <Award className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-accent-purple`} />
                        Practice Exercises
                      </h4>
                      <div className="space-y-2">
                        {mentorshipMutation.data.practiceExercises.map((exercise: any, index: number) => (
                          <div key={index} className="glass p-3 rounded-lg border border-border">
                            <div className={`flex items-center justify-between mb-2 ${isMobile ? 'flex-col gap-1' : ''}`}>
                              <span className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>{exercise.title}</span>
                              <Badge 
                                variant="outline" 
                                className={`${isMobile ? 'text-xs' : 'text-xs'} ${
                                  exercise.difficulty === 'easy' ? 'border-accent-green/50 text-accent-green' :
                                  exercise.difficulty === 'medium' ? 'border-accent-orange/50 text-accent-orange' :
                                  'border-accent-red/50 text-accent-red'
                                }`}
                              >
                                {exercise.difficulty}
                              </Badge>
                            </div>
                            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-secondary`}>{exercise.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-3 md:space-y-4">
          <Card className="glass-card border-border shadow-glow/20">
            <CardHeader className={`${isMobile ? 'p-4 pb-2' : 'p-6'}`}>
              <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-base' : 'text-lg'}`}>
                <Zap className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-accent-orange`} />
                Code Optimization
              </CardTitle>
              <CardDescription className={`${isMobile ? 'text-xs' : 'text-sm'}`}>
                AI-powered code optimization for performance, readability, and maintainability.
              </CardDescription>
            </CardHeader>
            <CardContent className={`space-y-3 md:space-y-4 ${isMobile ? 'p-4 pt-0' : 'p-6 pt-0'}`}>
              <Button 
                onClick={generateOptimization} 
                disabled={optimizationMutation.isPending || !code.trim()}
                className={`w-full bg-gradient-primary hover:shadow-glow transition-all ${isMobile ? 'py-2 text-sm' : 'py-3'}`}
              >
                {optimizationMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Optimizing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Zap className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                    Optimize Code
                  </div>
                )}
              </Button>

              {optimizationMutation.data && (
                <ScrollArea className={`${isMobile ? 'h-[50vh]' : 'h-[60vh]'} w-full`}>
                  <div className="space-y-3 md:space-y-4 pr-2">
                    <div className="glass rounded-lg p-3 md:p-4 border border-border">
                      <h4 className={`font-semibold mb-3 flex items-center gap-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
                        <Code2 className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-accent-cyan`} />
                        Optimized Code
                      </h4>
                      <div className={`glass rounded-lg border border-border overflow-hidden ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        <pre className="p-3 overflow-x-auto bg-elevated">
                          <code className="language-javascript">{optimizationMutation.data.optimizedCode}</code>
                        </pre>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onCodeSuggestion?.({ suggestedCode: optimizationMutation.data.optimizedCode })}
                        className={`mt-2 w-full glass hover:shadow-glow/50 transition-all ${isMobile ? 'text-xs py-1' : 'text-sm'}`}
                      >
                        Apply Optimized Code
                      </Button>
                    </div>

                    <div className="glass rounded-lg p-3 md:p-4 border border-border">
                      <h4 className={`font-semibold mb-3 flex items-center gap-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
                        <TrendingUp className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-accent-green`} />
                        Improvements Made
                      </h4>
                      <ul className="space-y-2">
                        {optimizationMutation.data.improvements.map((improvement: string, index: number) => (
                          <li key={index} className={`${isMobile ? 'text-xs' : 'text-sm'} flex items-start gap-2 glass p-2 rounded-lg`}>
                            <CheckCircle className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-accent-green mt-0.5 flex-shrink-0`} />
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="glass rounded-lg p-3 md:p-4 border border-border">
                      <h4 className={`font-semibold mb-3 flex items-center gap-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
                        <Star className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-accent-purple`} />
                        Performance Gains
                      </h4>
                      <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-secondary glass p-3 rounded-lg border border-accent-green/30 bg-accent-green/10`}>
                        {optimizationMutation.data.performanceGains}
                      </p>
                    </div>

                    <div className="glass rounded-lg p-3 md:p-4 border border-border">
                      <h4 className={`font-semibold mb-3 flex items-center gap-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
                        <Lightbulb className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-accent-blue`} />
                        Explanation
                      </h4>
                      <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-secondary glass p-3 rounded-lg`}>
                        {optimizationMutation.data.explanation}
                      </p>
                    </div>
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-3 md:space-y-4">
          <Card className="glass-card border-border shadow-glow/20">
            <CardHeader className={`${isMobile ? 'p-4 pb-2' : 'p-6'}`}>
              <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-base' : 'text-lg'}`}>
                <Shield className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-accent-red`} />
                Security Audit
              </CardTitle>
              <CardDescription className={`${isMobile ? 'text-xs' : 'text-sm'}`}>
                Comprehensive security analysis with vulnerability detection and compliance checks.
              </CardDescription>
            </CardHeader>
            <CardContent className={`space-y-3 md:space-y-4 ${isMobile ? 'p-4 pt-0' : 'p-6 pt-0'}`}>
              <Button 
                onClick={generateSecurityAudit} 
                disabled={securityMutation.isPending || !code.trim()}
                className={`w-full bg-gradient-primary hover:shadow-glow transition-all ${isMobile ? 'py-2 text-sm' : 'py-3'}`}
              >
                {securityMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Auditing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                    Run Security Audit
                  </div>
                )}
              </Button>

              {securityMutation.data && (
                <ScrollArea className={`${isMobile ? 'h-[50vh]' : 'h-[60vh]'} w-full`}>
                  <div className="space-y-3 md:space-y-4 pr-2">
                    <div className="glass rounded-lg p-3 md:p-4 border border-border">
                      <div className={`flex items-center justify-between ${isMobile ? 'flex-col gap-2' : ''}`}>
                        <h4 className={`font-semibold flex items-center gap-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
                          <Star className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-accent-orange`} />
                          Security Score
                        </h4>
                        <div className={`flex items-center gap-2 ${isMobile ? 'w-full justify-center' : ''}`}>
                          <Progress value={securityMutation.data.securityScore} className={`${isMobile ? 'w-32 h-3' : 'w-20 h-2'}`} />
                          <Badge variant={securityMutation.data.securityScore >= 80 ? "default" : securityMutation.data.securityScore >= 60 ? "secondary" : "destructive"} className={`${isMobile ? 'text-xs' : 'text-sm'}`}>
                            {securityMutation.data.securityScore}/100
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {securityMutation.data.vulnerabilities.length > 0 && (
                      <div className="glass rounded-lg p-3 md:p-4 border border-border">
                        <h4 className={`font-semibold mb-3 flex items-center gap-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
                          <AlertTriangle className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-accent-red`} />
                          Vulnerabilities Found
                        </h4>
                        <div className="space-y-3">
                          {securityMutation.data.vulnerabilities.map((vuln: any, index: number) => (
                            <div key={index} className="glass p-3 rounded-lg border border-border">
                              <div className={`flex items-center justify-between mb-2 ${isMobile ? 'flex-col gap-1' : ''}`}>
                                <span className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>{vuln.type}</span>
                                <Badge variant={vuln.severity === "critical" ? "destructive" : vuln.severity === "high" ? "destructive" : vuln.severity === "medium" ? "secondary" : "outline"} className={`${isMobile ? 'text-xs' : 'text-xs'}`}>
                                  {vuln.severity}
                                </Badge>
                              </div>
                              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-secondary mb-2`}>{vuln.description}</p>
                              <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-accent-cyan mb-2`}>Location: {vuln.location}</p>
                              <Separator className="my-2" />
                              <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-accent-green glass p-2 rounded`}>
                                <strong>Solution:</strong> {vuln.solution}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="glass rounded-lg p-3 md:p-4 border border-border">
                      <h4 className={`font-semibold mb-3 flex items-center gap-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
                        <CheckCircle className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-accent-green`} />
                        Security Recommendations
                      </h4>
                      <ul className="space-y-2">
                        {securityMutation.data.recommendations.map((rec: string, index: number) => (
                          <li key={index} className={`${isMobile ? 'text-xs' : 'text-sm'} flex items-start gap-2 glass p-2 rounded-lg`}>
                            <Shield className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-accent-blue mt-0.5 flex-shrink-0`} />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {securityMutation.data.complianceScore && (
                      <div className="glass rounded-lg p-3 md:p-4 border border-border">
                        <h4 className={`font-semibold mb-3 flex items-center gap-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
                          <Award className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-accent-purple`} />
                          Compliance Scores
                        </h4>
                        <div className="space-y-3">
                          <div className={`flex items-center justify-between ${isMobile ? 'flex-col gap-1' : ''}`}>
                            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>OWASP Compliance:</span>
                            <div className="flex items-center gap-2">
                              <Progress value={securityMutation.data.complianceScore.owasp} className={`${isMobile ? 'w-20 h-2' : 'w-16 h-2'}`} />
                              <Badge variant="outline" className={`${isMobile ? 'text-xs' : 'text-xs'}`}>{securityMutation.data.complianceScore.owasp}%</Badge>
                            </div>
                          </div>
                          <div className={`flex items-center justify-between ${isMobile ? 'flex-col gap-1' : ''}`}>
                            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>GDPR Compliance:</span>
                            <div className="flex items-center gap-2">
                              <Progress value={securityMutation.data.complianceScore.gdpr} className={`${isMobile ? 'w-20 h-2' : 'w-16 h-2'}`} />
                              <Badge variant="outline" className={`${isMobile ? 'text-xs' : 'text-xs'}`}>{securityMutation.data.complianceScore.gdpr}%</Badge>
                            </div>
                          </div>
                          <div className={`flex items-center justify-between ${isMobile ? 'flex-col gap-1' : ''}`}>
                            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>ISO 27001:</span>
                            <div className="flex items-center gap-2">
                              <Progress value={securityMutation.data.complianceScore.iso27001} className={`${isMobile ? 'w-20 h-2' : 'w-16 h-2'}`} />
                              <Badge variant="outline" className={`${isMobile ? 'text-xs' : 'text-xs'}`}>{securityMutation.data.complianceScore.iso27001}%</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                Intelligent Suggestions
              </CardTitle>
              <CardDescription>
                AI-powered code suggestions for completion, refactoring, and improvements.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={generateSuggestions} 
                disabled={suggestionsMutation.isPending || !code.trim()}
                className="w-full"
              >
                {suggestionsMutation.isPending ? "Generating..." : "Get Smart Suggestions"}
              </Button>

              {suggestionsMutation.data && (
                <ScrollArea className="h-[400px] w-full">
                  <div className="space-y-3">
                    {suggestionsMutation.data.map((suggestion: any, index: number) => (
                      <Card key={index} className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{suggestion.title}</span>
                            <Badge variant="outline" className="text-xs">{suggestion.type}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={suggestion.confidence} className="w-16 h-2" />
                            <Badge variant={suggestion.estimatedImpact === "high" ? "default" : suggestion.estimatedImpact === "medium" ? "secondary" : "outline"} className="text-xs">
                              {suggestion.estimatedImpact}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{suggestion.description}</p>
                        <div className="text-xs text-muted-foreground mb-2">
                          <strong>Reasoning:</strong> {suggestion.reasoning}
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => onCodeSuggestion?.(suggestion)}
                          className="w-full"
                        >
                          Apply Suggestion
                        </Button>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}