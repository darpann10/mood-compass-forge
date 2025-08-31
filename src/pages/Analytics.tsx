import React from 'react';
import { useMood } from '@/contexts/MoodContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Target,
  ArrowLeft,
  Flame,
  Award,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Analytics: React.FC = () => {
  const { moods, journals, currentStreak } = useMood();

  // Process mood data for analytics
  const moodCounts = moods.reduce((acc, mood) => {
    acc[mood.mood] = (acc[mood.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const moodChartData = Object.entries(moodCounts).map(([mood, count]) => ({
    mood: mood.charAt(0).toUpperCase() + mood.slice(1),
    count,
    percentage: Math.round((count / moods.length) * 100) || 0,
  }));

  // Last 30 days mood trend
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });

  const trendData = last30Days.map((date, index) => {
    const dayMoods = moods.filter(mood => mood.date.split('T')[0] === date);
    const avgScore = dayMoods.length > 0 
      ? dayMoods.reduce((sum, mood) => sum + mood.score, 0) / dayMoods.length 
      : null;
    
    return {
      day: `Day ${index + 1}`,
      date,
      score: avgScore,
      entries: dayMoods.length,
    };
  });

  // Weekly averages
  const weeklyData = [];
  for (let i = 0; i < 4; i++) {
    const weekStart = 30 - (i + 1) * 7;
    const weekEnd = 30 - i * 7;
    const weekMoods = trendData.slice(weekStart, weekEnd).filter(d => d.score !== null);
    const avgScore = weekMoods.length > 0 
      ? weekMoods.reduce((sum, d) => sum + (d.score || 0), 0) / weekMoods.length 
      : 0;
    
    weeklyData.unshift({
      week: `Week ${4 - i}`,
      score: Math.round(avgScore * 10) / 10,
      entries: weekMoods.reduce((sum, d) => sum + d.entries, 0),
    });
  }

  // Sentiment analysis from journals
  const sentimentCounts = journals.reduce((acc, journal) => {
    acc[journal.sentiment] = (acc[journal.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sentimentData = Object.entries(sentimentCounts).map(([sentiment, count]) => ({
    sentiment: sentiment.charAt(0).toUpperCase() + sentiment.slice(1),
    count,
    percentage: Math.round((count / journals.length) * 100) || 0,
  }));

  const moodColors = {
    Happy: '#fbbf24',
    Calm: '#10b981',
    Neutral: '#6b7280',
    Sad: '#3b82f6',
    Stressed: '#ef4444',
  };

  const sentimentColors = {
    Positive: '#10b981',
    Neutral: '#6b7280',
    Negative: '#ef4444',
  };

  // Calculate insights
  const averageMoodScore = moods.length > 0 
    ? (moods.reduce((sum, mood) => sum + mood.score, 0) / moods.length).toFixed(1)
    : '0';

  const mostCommonMood = moodChartData.reduce((max, mood) => 
    mood.count > (max.count || 0) ? mood : max, { mood: 'None', count: 0 });

  const totalEntries = moods.length + journals.length;
  const consistencyScore = Math.min(Math.round((totalEntries / 30) * 100), 100);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Your Analytics</h1>
          <p className="text-muted-foreground">
            Insights into your mental wellness journey
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="wellness-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageMoodScore}/10</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card className="wellness-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStreak}</div>
            <p className="text-xs text-muted-foreground">
              consecutive days
            </p>
          </CardContent>
        </Card>

        <Card className="wellness-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Common</CardTitle>
            <Award className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mostCommonMood.mood}</div>
            <p className="text-xs text-muted-foreground">
              {mostCommonMood.count} times
            </p>
          </CardContent>
        </Card>

        <Card className="wellness-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consistency</CardTitle>
            <Target className="h-4 w-4 text-mood-happy" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consistencyScore}%</div>
            <p className="text-xs text-muted-foreground">
              tracking score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 30-Day Mood Trend */}
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>30-Day Mood Trend</span>
            </CardTitle>
            <CardDescription>
              Your daily mood scores over the past month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData.filter(d => d.score !== null)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="day" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    domain={[0, 10]}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Mood Distribution */}
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Mood Distribution</span>
            </CardTitle>
            <CardDescription>
              Breakdown of your different moods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={moodChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ mood, percentage }) => `${mood} (${percentage}%)`}
                  >
                    {moodChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={moodColors[entry.mood as keyof typeof moodColors] || '#6b7280'} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Averages */}
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Weekly Averages</span>
            </CardTitle>
            <CardDescription>
              Compare your mood scores week by week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="week" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    domain={[0, 10]}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar 
                    dataKey="score" 
                    fill="hsl(var(--secondary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Journal Sentiment */}
        {journals.length > 0 && (
          <Card className="wellness-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Journal Sentiment</span>
              </CardTitle>
              <CardDescription>
                Emotional tone of your journal entries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sentimentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="sentiment" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Insights */}
      <Card className="wellness-card">
        <CardHeader>
          <CardTitle>📊 Insights & Observations</CardTitle>
          <CardDescription>
            Based on your mood tracking patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Positive Patterns</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {currentStreak > 0 && (
                  <li>• You're on a {currentStreak}-day tracking streak! 🔥</li>
                )}
                {Number(averageMoodScore) >= 7 && (
                  <li>• Your average mood score is excellent ({averageMoodScore}/10)</li>
                )}
                {mostCommonMood.mood !== 'None' && (
                  <li>• Your most common mood is {mostCommonMood.mood.toLowerCase()}</li>
                )}
                {totalEntries > 20 && (
                  <li>• Great consistency with {totalEntries} total entries</li>
                )}
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-secondary">Areas for Growth</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {consistencyScore < 70 && (
                  <li>• Try to track your mood more consistently</li>
                )}
                {Number(averageMoodScore) < 5 && (
                  <li>• Consider reaching out for support if needed</li>
                )}
                {journals.length < 5 && (
                  <li>• Writing in your journal can help process emotions</li>
                )}
                <li>• Remember that all emotions are valid and temporary</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;