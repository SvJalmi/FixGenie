import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Brain, Shield, Zap, Target, TrendingUp, Award, BookOpen, Code2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface AIMentorProps {
  code: string;
  language: string;
  onCodeSuggestion?: (suggestion: any) => void;
}

export function AIMentor({ code, language, onCodeSuggestion }: AIMentorProps) {
  const [activeTab, setActiveTab] = useState("mentorship");

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
      <div className="flex items-center gap-2 mb-3 md:mb-4 responsive-header">
        <Brain className="h-5 w-5 md:h-6 md:w-6 text-accent-purple" />
        <h2 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-accent-purple to-accent-blue bg-clip-text text-transparent">AI Mentor</h2>
        <Badge variant="secondary" className="bg-gradient-primary text-white text-xs shadow-glow">Advanced</Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1 glass-card p-1">
          <TabsTrigger value="mentorship" className="flex items-center gap-1 text-xs md:text-sm">
            <BookOpen className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Mentorship</span>
            <span className="sm:hidden">Mentor</span>
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-1 text-xs md:text-sm">
            <Zap className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Optimize</span>
            <span className="sm:hidden">Opt</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1 text-xs md:text-sm">
            <Shield className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Security</span>
            <span className="sm:hidden">Sec</span>
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex items-center gap-1 text-xs md:text-sm">
            <Code2 className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Suggestions</span>
            <span className="sm:hidden">Sugg</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mentorship" className="space-y-3 md:space-y-4">
          <Card className="glass-card border-border shadow-glow/20">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                <Target className="h-4 w-4 md:h-5 md:w-5 text-accent-cyan" />
                Personalized Mentorship
              </CardTitle>
              <CardDescription className="text-xs md:text-sm text-secondary">
                Get AI-powered mentorship tailored to your coding journey and skill level.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4 pt-0">
              <Button 
                onClick={generateMentorship} 
                disabled={mentorshipMutation.isPending || !code.trim()}
                className="w-full bg-gradient-primary hover:shadow-glow/50 transition-all text-sm md:text-base"
              >
                {mentorshipMutation.isPending ? "Analyzing..." : "Generate Mentorship"}
              </Button>

              {mentorshipMutation.data && (
                <ScrollArea className="h-auto max-h-[70vh]">
                  <div className="space-y-3 md:space-y-4 pr-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm md:text-base text-primary">Personalized Feedback</h4>
                      <p className="text-xs md:text-sm text-secondary glass p-3 rounded-lg border border-border">
                        {mentorshipMutation.data.personalizedFeedback}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 text-sm md:text-base text-primary">Skill Assessment</h4>
                      <div className="space-y-2 md:space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <span className="text-xs md:text-sm text-secondary">Overall Level:</span>
                          <div className="skill-level-mobile">
                            {renderSkillLevel(mentorshipMutation.data.skillAssessment.overallLevel)}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs md:text-sm font-medium text-primary">Strengths:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {mentorshipMutation.data.skillAssessment.strengths.map((strength: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-gradient-to-r from-accent-green/20 to-accent-cyan/20 text-accent-green border-accent-green/30">
                                {strength}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs md:text-sm font-medium text-primary">Areas to Improve:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {mentorshipMutation.data.skillAssessment.weaknesses.map((weakness: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs border-accent-orange/30 text-accent-orange">
                                {weakness}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 text-sm md:text-base text-primary">Learning Path</h4>
                      <Card className="glass-card border-border">
                        <CardContent className="pt-3 md:pt-4">
                          <div className="space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <h5 className="font-medium text-sm md:text-base text-primary">{mentorshipMutation.data.learningPath.title}</h5>
                              <Badge className="bg-gradient-to-r from-accent-purple to-accent-blue text-white w-fit">
                                {mentorshipMutation.data.learningPath.difficulty}
                              </Badge>
                            </div>
                            <p className="text-xs md:text-sm text-secondary">
                              {mentorshipMutation.data.learningPath.description}
                            </p>
                            <div className="text-xs text-secondary flex items-center gap-2">
                              <Target className="h-3 w-3" />
                              Estimated time: {mentorshipMutation.data.learningPath.estimatedTime}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 text-sm md:text-base text-primary">Practice Exercises</h4>
                      <div className="space-y-2 md:space-y-3">
                        {mentorshipMutation.data.practiceExercises.map((exercise: any, index: number) => (
                          <Card key={index} className="glass-card border-border p-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                              <span className="font-medium text-xs md:text-sm text-primary">{exercise.title}</span>
                              <Badge variant="outline" className="text-xs border-accent-cyan/30 text-accent-cyan w-fit">
                                {exercise.difficulty}
                              </Badge>
                            </div>
                            <p className="text-xs text-secondary">{exercise.description}</p>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-3 md:space-y-4">
          <Card className="glass-card border-border shadow-glow/20">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                <Zap className="h-4 w-4 md:h-5 md:w-5 text-accent-orange" />
                Code Optimization
              </CardTitle>
              <CardDescription className="text-xs md:text-sm text-secondary">
                AI-powered code optimization for performance, readability, and maintainability.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4 pt-0">
              <Button 
                onClick={generateOptimization} 
                disabled={optimizationMutation.isPending || !code.trim()}
                className="w-full bg-gradient-to-r from-accent-orange to-accent-yellow hover:shadow-glow/50 transition-all text-sm md:text-base"
              >
                {optimizationMutation.isPending ? "Optimizing..." : "Optimize Code"}
              </Button>

              {optimizationMutation.data && (
                <ScrollArea className="h-auto max-h-[70vh]">
                  <div className="space-y-3 md:space-y-4 pr-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm md:text-base text-primary">Optimized Code</h4>
                      <pre className="glass p-3 rounded-lg text-xs md:text-sm overflow-x-auto border border-border">
                        <code className="text-accent-cyan">{optimizationMutation.data.optimizedCode}</code>
                      </pre>
                      <Button 
                        onClick={() => onCodeSuggestion?.({ suggestedCode: optimizationMutation.data.optimizedCode })}
                        variant="outline"
                        size="sm"
                        className="mt-2 text-xs md:text-sm"
                      >
                        Apply Optimization
                      </Button>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 text-sm md:text-base text-primary">Improvements Made</h4>
                      <ul className="space-y-2">
                        {optimizationMutation.data.improvements.map((improvement: string, index: number) => (
                          <li key={index} className="text-xs md:text-sm flex items-start gap-2 glass p-2 rounded-lg border border-border">
                            <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-accent-green mt-0.5 flex-shrink-0" />
                            <span className="text-secondary">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 text-sm md:text-base text-primary">Performance Gains</h4>
                      <p className="text-xs md:text-sm text-secondary glass p-3 rounded-lg border border-accent-green/30 bg-accent-green/5">
                        {optimizationMutation.data.performanceGains}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 text-sm md:text-base text-primary">Explanation</h4>
                      <p className="text-xs md:text-sm text-secondary glass p-3 rounded-lg border border-border">
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
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                <Shield className="h-4 w-4 md:h-5 md:w-5 text-accent-blue" />
                Security Audit
              </CardTitle>
              <CardDescription className="text-xs md:text-sm text-secondary">
                Comprehensive security analysis with vulnerability detection and compliance checks.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4 pt-0">
              <Button 
                onClick={generateSecurityAudit} 
                disabled={securityMutation.isPending || !code.trim()}
                className="w-full bg-gradient-to-r from-accent-blue to-accent-purple hover:shadow-glow/50 transition-all text-sm md:text-base"
              >
                {securityMutation.isPending ? "Auditing..." : "Run Security Audit"}
              </Button>

              {securityMutation.data && (
                <ScrollArea className="h-auto max-h-[70vh]">
                  <div className="space-y-3 md:space-y-4 pr-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h4 className="font-semibold text-sm md:text-base text-primary">Security Score</h4>
                      <div className="flex items-center gap-2">
                        <Progress value={securityMutation.data.securityScore} className="w-16 md:w-20 h-2" />
                        <Badge variant={securityMutation.data.securityScore >= 80 ? "default" : securityMutation.data.securityScore >= 60 ? "secondary" : "destructive"} className="text-xs">
                          {securityMutation.data.securityScore}/100
                        </Badge>
                      </div>
                    </div>

                    {securityMutation.data.vulnerabilities.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 text-sm md:text-base text-primary">Vulnerabilities Found</h4>
                        <div className="space-y-2 md:space-y-3">
                          {securityMutation.data.vulnerabilities.map((vuln: any, index: number) => (
                            <Card key={index} className="glass-card border-border p-3">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                <span className="font-medium text-xs md:text-sm text-primary">{vuln.type}</span>
                                <Badge variant={vuln.severity === "critical" ? "destructive" : vuln.severity === "high" ? "destructive" : vuln.severity === "medium" ? "secondary" : "outline"} className="text-xs w-fit">
                                  {vuln.severity}
                                </Badge>
                              </div>
                              <p className="text-xs text-secondary mb-2">{vuln.description}</p>
                              <p className="text-xs font-medium text-primary mb-2">Location: {vuln.location}</p>
                              <Separator className="my-2" />
                              <p className="text-xs text-accent-green glass p-2 rounded border border-accent-green/30">
                                <strong>Solution:</strong> {vuln.solution}
                              </p>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold mb-2 text-sm md:text-base text-primary">Recommendations</h4>
                      <ul className="space-y-2">
                        {securityMutation.data.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="text-xs md:text-sm flex items-start gap-2 glass p-2 rounded-lg border border-border">
                            <Shield className="h-3 w-3 md:h-4 md:w-4 text-accent-blue mt-0.5 flex-shrink-0" />
                            <span className="text-secondary">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-3 md:space-y-4">
          <Card className="glass-card border-border shadow-glow/20">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                <Code2 className="h-4 w-4 md:h-5 md:w-5 text-accent-green" />
                Intelligent Suggestions
              </CardTitle>
              <CardDescription className="text-xs md:text-sm text-secondary">
                AI-powered code suggestions for completion, refactoring, and improvements.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4 pt-0">
              <Button 
                onClick={generateSuggestions} 
                disabled={suggestionsMutation.isPending || !code.trim()}
                className="w-full bg-gradient-to-r from-accent-green to-accent-cyan hover:shadow-glow/50 transition-all text-sm md:text-base"
              >
                {suggestionsMutation.isPending ? "Generating..." : "Get Smart Suggestions"}
              </Button>

              {suggestionsMutation.data && (
                <ScrollArea className="h-auto max-h-[70vh]">
                  <div className="space-y-3 pr-4">
                    {suggestionsMutation.data.map((suggestion: any, index: number) => (
                      <Card key={index} className="glass-card border-border p-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-xs md:text-sm text-primary">{suggestion.title}</span>
                            <Badge variant="outline" className="text-xs border-accent-cyan/30 text-accent-cyan">{suggestion.type}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={suggestion.confidence} className="w-12 md:w-16 h-2" />
                            <Badge variant={suggestion.estimatedImpact === "high" ? "default" : suggestion.estimatedImpact === "medium" ? "secondary" : "outline"} className="text-xs">
                              {suggestion.estimatedImpact}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-secondary mb-2">{suggestion.description}</p>
                        <div className="text-xs text-secondary mb-2 glass p-2 rounded border border-border">
                          <strong>Reasoning:</strong> {suggestion.reasoning}
                        </div>
                        {suggestion.codeExample && (
                          <pre className="glass p-2 rounded text-xs overflow-x-auto mt-2 border border-border">
                            <code className="text-accent-cyan">{suggestion.codeExample}</code>
                          </pre>
                        )}
                        {suggestion.suggestedCode && (
                          <div className="mt-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => onCodeSuggestion?.(suggestion)}
                              className="text-xs glass hover:shadow-glow/30 transition-all w-full"
                            >
                              Apply Suggestion
                            </Button>
                          </div>
                        )}
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