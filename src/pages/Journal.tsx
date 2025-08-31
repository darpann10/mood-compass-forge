import React, { useState } from 'react';
import { useMood } from '@/contexts/MoodContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Save, ArrowLeft, Lightbulb, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const Journal: React.FC = () => {
  const { addJournalEntry, journals } = useMood();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simple sentiment analysis (placeholder)
  const analyzeSentiment = (text: string): 'positive' | 'negative' | 'neutral' => {
    const positiveWords = ['happy', 'good', 'great', 'amazing', 'wonderful', 'love', 'joy', 'excited', 'grateful', 'blessed', 'perfect', 'awesome', 'brilliant', 'fantastic'];
    const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'hate', 'angry', 'frustrated', 'worried', 'anxious', 'depressed', 'horrible', 'worst', 'difficult'];
    
    const words = text.toLowerCase().split(' ');
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: 'Write something',
        description: 'Please write something in your journal entry.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    const sentiment = analyzeSentiment(content);

    // Simulate API delay
    setTimeout(() => {
      addJournalEntry(content, sentiment);
      toast({
        title: 'Journal entry saved! 📝',
        description: `Entry analyzed as ${sentiment}. Keep reflecting on your thoughts!`,
      });
      setContent('');
      setIsSubmitting(false);
    }, 500);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200';
      case 'negative': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const journalPrompts = [
    "What made me smile today?",
    "What am I grateful for right now?",
    "How did I handle challenges today?",
    "What emotions did I experience today?",
    "What would I like to improve tomorrow?",
    "What positive affirmation do I need to hear?",
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Your Journal</h1>
          <p className="text-muted-foreground">
            Reflect on your thoughts and feelings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Journal Entry Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="wellness-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span>New Journal Entry</span>
              </CardTitle>
              <CardDescription>
                Write about your day, thoughts, feelings, or anything on your mind
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  placeholder="Dear journal, today I..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  className="resize-none text-base leading-relaxed"
                />
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    {content.length} characters
                  </div>
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90"
                    disabled={!content.trim() || isSubmitting}
                  >
                    {isSubmitting ? (
                      'Saving...'
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Entry
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Recent Entries */}
          <Card className="wellness-card">
            <CardHeader>
              <CardTitle>Recent Entries</CardTitle>
              <CardDescription>
                Your latest journal reflections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {journals.slice(0, 5).map((journal) => (
                  <div key={journal.id} className="p-4 rounded-lg bg-muted/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge className={getSentimentColor(journal.sentiment)}>
                        {journal.sentiment}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(journal.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="text-sm line-clamp-3 leading-relaxed">
                      {journal.content}
                    </p>
                  </div>
                ))}
                {journals.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No journal entries yet.</p>
                    <p className="text-sm">Start writing your first entry above!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Writing Tips */}
          <Card className="wellness-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <span>Writing Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="space-y-2">
                <p className="font-medium">✨ Be honest and authentic</p>
                <p className="text-muted-foreground">Write without judgment about your true feelings.</p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">🌱 Focus on growth</p>
                <p className="text-muted-foreground">What did you learn about yourself today?</p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">🙏 Practice gratitude</p>
                <p className="text-muted-foreground">Include things you're thankful for.</p>
              </div>
            </CardContent>
          </Card>

          {/* Journal Prompts */}
          <Card className="wellness-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-mood-happy" />
                <span>Journal Prompts</span>
              </CardTitle>
              <CardDescription>
                Need inspiration? Try these prompts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {journalPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setContent(content + (content ? '\n\n' : '') + prompt + ' ')}
                    className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sentiment Analysis Info */}
          <Card className="wellness-card">
            <CardHeader>
              <CardTitle className="text-sm">Sentiment Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Positive - Uplifting content</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <span>Neutral - Balanced content</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Negative - Challenging content</span>
              </div>
              <p className="text-muted-foreground mt-2">
                All emotions are valid. This analysis helps track patterns in your reflections.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Journal;