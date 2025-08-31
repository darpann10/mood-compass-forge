import React, { useState } from 'react';
import { useMood, MoodType } from '@/contexts/MoodContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Heart, Save, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const MoodEntry: React.FC = () => {
  const { addMoodEntry } = useMood();
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [moodScore, setMoodScore] = useState([5]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moods = [
    { type: 'happy' as MoodType, emoji: '😊', label: 'Happy', description: 'Feeling joyful and positive' },
    { type: 'calm' as MoodType, emoji: '😌', label: 'Calm', description: 'Peaceful and relaxed' },
    { type: 'neutral' as MoodType, emoji: '😐', label: 'Neutral', description: 'Balanced and steady' },
    { type: 'sad' as MoodType, emoji: '😢', label: 'Sad', description: 'Feeling down or melancholy' },
    { type: 'stressed' as MoodType, emoji: '😰', label: 'Stressed', description: 'Anxious or overwhelmed' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMood) {
      toast({
        title: 'Select a mood',
        description: 'Please choose how you\'re feeling today.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API delay
    setTimeout(() => {
      addMoodEntry(selectedMood, moodScore[0], notes);
      toast({
        title: 'Mood logged successfully! 🎉',
        description: `You're feeling ${selectedMood} with a score of ${moodScore[0]}/10.`,
      });
      navigate('/');
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">How are you feeling?</h1>
          <p className="text-muted-foreground">
            Take a moment to check in with yourself
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mood Selection */}
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-primary" />
              <span>Select Your Mood</span>
            </CardTitle>
            <CardDescription>
              Choose the emotion that best describes how you're feeling right now
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {moods.map((mood) => (
                <button
                  key={mood.type}
                  type="button"
                  onClick={() => setSelectedMood(mood.type)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                    selectedMood === mood.type
                      ? `mood-${mood.type} border-transparent animate-mood-pulse`
                      : 'border-border bg-card hover:bg-muted/50'
                  }`}
                >
                  <div className="text-center space-y-2">
                    <div className="text-4xl">{mood.emoji}</div>
                    <div className={`font-semibold ${
                      selectedMood === mood.type ? 'text-white' : 'text-foreground'
                    }`}>
                      {mood.label}
                    </div>
                    <div className={`text-sm ${
                      selectedMood === mood.type ? 'text-white/90' : 'text-muted-foreground'
                    }`}>
                      {mood.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mood Score */}
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle>Mood Intensity</CardTitle>
            <CardDescription>
              Rate the intensity of your mood on a scale of 1-10
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Low</span>
                <span className="text-2xl font-bold text-primary">{moodScore[0]}/10</span>
                <span>High</span>
              </div>
              <Slider
                value={moodScore}
                onValueChange={setMoodScore}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                {Array.from({ length: 10 }, (_, i) => (
                  <span key={i} className={moodScore[0] === i + 1 ? 'text-primary font-bold' : ''}>
                    {i + 1}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Optional Notes */}
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
            <CardDescription>
              What's contributing to this mood? (Optional)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="What happened today? What are you thinking about? Any specific triggers or positive moments?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex space-x-4">
          <Button
            type="submit"
            className="flex-1 bg-primary hover:bg-primary/90"
            disabled={!selectedMood || isSubmitting}
          >
            {isSubmitting ? (
              'Saving...'
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Log My Mood
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MoodEntry;