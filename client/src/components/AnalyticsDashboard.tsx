import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Award, Target, Brain, Shield, Zap, Users, Calendar, Code2, Activity } from "lucide-react";

interface AnalyticsDashboardProps {
  userId?: number;
}

export function AnalyticsDashboard({ userId = 1 }: AnalyticsDashboardProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("JavaScript");

  // Fetch dashboard data
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ["/api/analytics/dashboard", userId],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/dashboard/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch dashboard data");
      return response.json();
    }
  });

  // Fetch personalized insights
  const { data: insights, isLoading: isInsightsLoading } = useQuery({
    queryKey: ["/api/analytics/insights", userId],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/insights/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch insights");
      return response.json();
    }
  });

  // Fetch skill progression for selected language
  const { data: progression } = useQuery({
    queryKey: ["/api/analytics/progress", userId, selectedLanguage],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/progress/${userId}/${selectedLanguage}`);
      if (!response.ok) throw new Error("Failed to fetch progression");
      return response.json();
    }
  });

  // Fetch achievements
  const { data: achievements } = useQuery({
    queryKey: ["/api/analytics/achievements", userId],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/achievements/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch achievements");
      return response.json();
    }
  });

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff7f', '#ff1493', '#1e90ff'];

  const renderSkillRadar = () => {
    if (!dashboardData?.skillRadar) return null;

    return (
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={dashboardData.skillRadar}>
          <PolarGrid />
          <PolarAngleAxis dataKey="skill" />
          <PolarRadiusAxis angle={90} domain={[0, 100]} />
          <Radar
            name="Skill Level"
            dataKey="level"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    );
  };

  const renderQualityTrend = () => {
    if (!dashboardData?.qualityTrend) return null;

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dashboardData.qualityTrend}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="quality"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={{ fill: '#82ca9d' }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderLanguageDistribution = () => {
    if (!dashboardData?.languageDistribution) return null;

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={dashboardData.languageDistribution}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="count"
            label={({ language, percentage }) => `${language} (${percentage}%)`}
          >
            {dashboardData.languageDistribution.map((_: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderComplexityEvolution = () => {
    if (!dashboardData?.complexityEvolution) return null;

    return (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={dashboardData.complexityEvolution}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="complexity"
            stroke="#ffc658"
            fill="#ffc658"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  if (isDashboardLoading || isInsightsLoading) {
    return (
      <div className="w-full space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="h-6 w-6 text-blue-500" />
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <Badge variant="secondary">Premium</Badge>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Code Quality</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.qualityTrend?.slice(-1)[0]?.quality || 75}
            </div>
            <p className="text-xs text-muted-foreground">
              +5% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Languages Mastered</CardTitle>
            <Code2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.languageDistribution?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {dashboardData?.languageDistribution?.reduce((sum: number, lang: any) => sum + lang.count, 0) || 0} projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Level</CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Level {progression?.currentLevel || 1}
            </div>
            <Progress value={progression?.progressToNext || 0} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {progression?.progressToNext || 0}% to next level
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {achievements?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Unlocked this month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Code Quality Trend</CardTitle>
                <CardDescription>Your coding quality improvement over time</CardDescription>
              </CardHeader>
              <CardContent>
                {renderQualityTrend()}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Language Distribution</CardTitle>
                <CardDescription>Programming languages you've worked with</CardDescription>
              </CardHeader>
              <CardContent>
                {renderLanguageDistribution()}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Code Complexity Evolution</CardTitle>
                <CardDescription>How your code complexity has changed</CardDescription>
              </CardHeader>
              <CardContent>
                {renderComplexityEvolution()}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skill Radar</CardTitle>
                <CardDescription>Your current skill levels across different areas</CardDescription>
              </CardHeader>
              <CardContent>
                {renderSkillRadar()}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Skill Assessment</CardTitle>
              <CardDescription>Detailed breakdown of your programming skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.skillRadar?.map((skill: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium">{skill.skill}</span>
                    <div className="flex items-center gap-2 w-32">
                      <Progress value={skill.level} className="flex-1" />
                      <span className="text-sm text-muted-foreground">{skill.level}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>Track your journey and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Current Level</span>
                    <Badge variant="secondary">Level {progression?.currentLevel || 1}</Badge>
                  </div>
                  <Progress value={progression?.progressToNext || 0} className="mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {progression?.experience || 0} XP earned
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Milestones Achieved</h4>
                  <div className="space-y-2">
                    {progression?.milestoneAchievements?.map((milestone: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">{milestone}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {insights?.insights?.map((insight: string, index: number) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {insights?.recommendations?.map((rec: string, index: number) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <Zap className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Next Learning Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {insights?.nextLearningGoals?.map((goal: string, index: number) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <Target className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {goal}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Strength Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {insights?.strengthAreas?.map((strength: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements?.map((achievement: any, index: number) => (
              <Card key={index} className="relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-16 h-16 ${
                  achievement.rarity === 'legendary' ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                  achievement.rarity === 'epic' ? 'bg-gradient-to-br from-purple-400 to-pink-500' :
                  achievement.rarity === 'rare' ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
                  'bg-gradient-to-br from-gray-400 to-gray-600'
                } transform rotate-45 translate-x-4 -translate-y-4`}></div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Award className={`h-6 w-6 ${
                        achievement.rarity === 'legendary' ? 'text-yellow-500' :
                        achievement.rarity === 'epic' ? 'text-purple-500' :
                        achievement.rarity === 'rare' ? 'text-blue-500' :
                        'text-gray-500'
                      }`} />
                      <div>
                        <CardTitle className="text-sm">{achievement.title}</CardTitle>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {achievement.rarity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Category: {achievement.category}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}