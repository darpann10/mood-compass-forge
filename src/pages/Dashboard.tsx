import React from 'react';
import { useMood } from '@/contexts/MoodContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  PlusCircle, 
  BookOpen, 
  TrendingUp, 
  Calendar,
  Flame,
  Target,
  Heart,
  Smile
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const { user, moods, journals, currentStreak, totalEntries } = useMood();

  // Calculate recent mood data for the chart
  const recentMoods = moods.slice(0, 7).reverse();
  const chartData = recentMoods.map((mood, index) => ({
    day: `Day ${index + 1}`,
    score: mood.score,
    mood: mood.mood,
  }));

  // Calculate today's mood
  const today = new Date().toISOString().split('T')[0];
  const todaysMood = moods.find(mood => mood.date.split('T')[0] === today);

  // Calculate this week's average
  const thisWeekAverage = recentMoods.length > 0 
    ? recentMoods.reduce((sum, mood) => sum + mood.score, 0) / recentMoods.length 
    : 0;

  const moodEmojis = {
    happy: '😊',
    sad: '😢',
    stressed: '😰',
    calm: '😌',
    neutral: '😐'
  };

  const moodColors = {
    happy: 'text-yellow-500',
    sad: 'text-blue-500',
    stressed: 'text-red-500',
    calm: 'text-teal-500',
    neutral: 'text-gray-500'
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.name || 'Anonymous'}! 👋
        </h1>
        <p className="text-muted-foreground">
          How are you feeling today? Let's check in with your mental wellness journey.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="wellness-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStreak}</div>
            <p className="text-xs text-muted-foreground">consecutive days</p>
          </CardContent>
        </Card>

        <Card className="wellness-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEntries}</div>
            <p className="text-xs text-muted-foreground">moods & journals</p>
          </CardContent>
        </Card>

        <Card className="wellness-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisWeekAverage.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">average mood score</p>
          </CardContent>
        </Card>

        <Card className="wellness-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Mood</CardTitle>
            <Heart className="h-4 w-4 text-mood-happy" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {todaysMood ? (
                <>
                  <span className="text-2xl">{moodEmojis[todaysMood.mood]}</span>
                  <div>
                    <div className="text-xl font-bold">{todaysMood.score}/10</div>
                    <p className="text-xs text-muted-foreground capitalize">{todaysMood.mood}</p>
                  </div>
                </>
              ) : (
                <div>
                  <div className="text-xl font-bold">--</div>
                  <p className="text-xs text-muted-foreground">Not logged yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PlusCircle className="h-5 w-5 text-primary" />
              <span>Quick Mood Check</span>
            </CardTitle>
            <CardDescription>
              How are you feeling right now? Log your current mood.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/mood">
              <Button className="w-full bg-primary hover:bg-primary/90">
                Log My Mood
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-secondary" />
              <span>Reflection Time</span>
            </CardTitle>
            <CardDescription>
              Take a moment to journal about your thoughts and feelings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/journal">
              <Button variant="outline" className="w-full">
                Write in Journal
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Mood Trend Chart */}
      {chartData.length > 0 && (
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>7-Day Mood Trend</span>
            </CardTitle>
            <CardDescription>
              Your mood scores over the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
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
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Moods */}
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smile className="h-5 w-5" />
              <span>Recent Moods</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {moods.slice(0, 4).map((mood) => (
                <div key={mood.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{moodEmojis[mood.mood]}</span>
                    <div>
                      <p className="font-medium capitalize">{mood.mood}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(mood.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{mood.score}/10</div>
                  </div>
                </div>
              ))}
              {moods.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No mood entries yet. Start by logging your first mood!
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Journals */}
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Recent Journal Entries</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {journals.slice(0, 3).map((journal) => (
                <div key={journal.id} className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full bg-background font-medium ${
                      journal.sentiment === 'positive' ? 'text-green-600' :
                      journal.sentiment === 'negative' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {journal.sentiment}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(journal.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm line-clamp-2">
                    {journal.content}
                  </p>
                </div>
              ))}
              {journals.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No journal entries yet. Start writing your thoughts!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;