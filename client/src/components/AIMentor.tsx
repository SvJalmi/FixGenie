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
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-6 w-6 text-purple-500" />
        <h2 className="text-2xl font-bold">AI Mentor</h2>
        <Badge variant="secondary">Advanced</Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mentorship" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            Mentorship
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-1">
            <Zap className="h-4 w-4" />
            Optimize
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex items-center gap-1">
            <Code2 className="h-4 w-4" />
            Suggestions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mentorship" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Personalized Mentorship
              </CardTitle>
              <CardDescription>
                Get AI-powered mentorship tailored to your coding journey and skill level.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={generateMentorship} 
                disabled={mentorshipMutation.isPending || !code.trim()}
                className="w-full"
              >
                {mentorshipMutation.isPending ? "Analyzing..." : "Generate Mentorship"}
              </Button>

              {mentorshipMutation.data && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Personalized Feedback</h4>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                      {mentorshipMutation.data.personalizedFeedback}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Skill Assessment</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Overall Level:</span>
                        {renderSkillLevel(mentorshipMutation.data.skillAssessment.overallLevel)}
                      </div>
                      <div>
                        <span className="text-sm font-medium">Strengths:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {mentorshipMutation.data.skillAssessment.strengths.map((strength: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Areas to Improve:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {mentorshipMutation.data.skillAssessment.weaknesses.map((weakness: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {weakness}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Learning Path</h4>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium">{mentorshipMutation.data.learningPath.title}</h5>
                            <Badge>{mentorshipMutation.data.learningPath.difficulty}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {mentorshipMutation.data.learningPath.description}
                          </p>
                          <div className="text-xs text-muted-foreground">
                            Estimated time: {mentorshipMutation.data.learningPath.estimatedTime}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Practice Exercises</h4>
                    <div className="space-y-2">
                      {mentorshipMutation.data.practiceExercises.map((exercise: any, index: number) => (
                        <Card key={index} className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{exercise.title}</span>
                            <Badge variant="outline" className="text-xs">{exercise.difficulty}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{exercise.description}</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Code Optimization
              </CardTitle>
              <CardDescription>
                AI-powered code optimization for performance, readability, and maintainability.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={generateOptimization} 
                disabled={optimizationMutation.isPending || !code.trim()}
                className="w-full"
              >
                {optimizationMutation.isPending ? "Optimizing..." : "Optimize Code"}
              </Button>

              {optimizationMutation.data && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Optimized Code</h4>
                    <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
                      <code>{optimizationMutation.data.optimizedCode}</code>
                    </pre>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Improvements Made</h4>
                    <ul className="space-y-1">
                      {optimizationMutation.data.improvements.map((improvement: string, index: number) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Performance Gains</h4>
                    <p className="text-sm text-muted-foreground bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                      {optimizationMutation.data.performanceGains}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Explanation</h4>
                    <p className="text-sm text-muted-foreground">
                      {optimizationMutation.data.explanation}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Audit
              </CardTitle>
              <CardDescription>
                Comprehensive security analysis with vulnerability detection and compliance checks.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={generateSecurityAudit} 
                disabled={securityMutation.isPending || !code.trim()}
                className="w-full"
              >
                {securityMutation.isPending ? "Auditing..." : "Run Security Audit"}
              </Button>

              {securityMutation.data && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Security Score</h4>
                    <div className="flex items-center gap-2">
                      <Progress value={securityMutation.data.securityScore} className="w-20 h-2" />
                      <Badge variant={securityMutation.data.securityScore >= 80 ? "default" : securityMutation.data.securityScore >= 60 ? "secondary" : "destructive"}>
                        {securityMutation.data.securityScore}/100
                      </Badge>
                    </div>
                  </div>

                  {securityMutation.data.vulnerabilities.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Vulnerabilities Found</h4>
                      <div className="space-y-2">
                        {securityMutation.data.vulnerabilities.map((vuln: any, index: number) => (
                          <Card key={index} className="p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">{vuln.type}</span>
                              <Badge variant={vuln.severity === "critical" ? "destructive" : vuln.severity === "high" ? "destructive" : vuln.severity === "medium" ? "secondary" : "outline"}>
                                {vuln.severity}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{vuln.description}</p>
                            <p className="text-xs font-medium">Location: {vuln.location}</p>
                            <Separator className="my-2" />
                            <p className="text-xs text-green-700 dark:text-green-300">
                              <strong>Solution:</strong> {vuln.solution}
                            </p>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold mb-2">Recommendations</h4>
                    <ul className="space-y-1">
                      {securityMutation.data.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <Shield className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
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