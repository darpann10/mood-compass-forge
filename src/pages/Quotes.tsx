import React, { useState, useEffect } from 'react';
import { useMood } from '@/contexts/MoodContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  RefreshCw, 
  ArrowLeft,
  Quote,
  Share,
  Bookmark
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const Quotes: React.FC = () => {
  const { moods } = useMood();
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  // Curated quotes based on different moods and general wellness
  const quotesByMood = {
    happy: [
      {
        text: "Happiness is not something ready-made. It comes from your own actions.",
        author: "Dalai Lama"
      },
      {
        text: "The most important thing is to enjoy your life—to be happy—it's all that matters.",
        author: "Audrey Hepburn"
      },
      {
        text: "Happiness is when what you think, what you say, and what you do are in harmony.",
        author: "Mahatma Gandhi"
      }
    ],
    sad: [
      {
        text: "The darkest nights produce the brightest stars.",
        author: "John Green"
      },
      {
        text: "You are stronger than you believe, more talented than you think, and capable of more than you imagine.",
        author: "Roy T. Bennett"
      },
      {
        text: "Every storm runs out of rain. Every dark night turns into day.",
        author: "Maya Angelou"
      }
    ],
    stressed: [
      {
        text: "You have been assigned this mountain to show others it can be moved.",
        author: "Mel Robbins"
      },
      {
        text: "Stress is caused by being here but wanting to be there.",
        author: "Eckhart Tolle"
      },
      {
        text: "Take time to make your soul happy.",
        author: "Unknown"
      }
    ],
    calm: [
      {
        text: "Peace comes from within. Do not seek it without.",
        author: "Buddha"
      },
      {
        text: "Calmness is the cradle of power.",
        author: "Josiah Gilbert Holland"
      },
      {
        text: "In the midst of movement and chaos, keep stillness inside of you.",
        author: "Deepak Chopra"
      }
    ],
    neutral: [
      {
        text: "Every day is a new beginning. Take a deep breath and start again.",
        author: "Unknown"
      },
      {
        text: "Balance is not better time management, but better boundary management.",
        author: "Betsy Jacobson"
      },
      {
        text: "Today is the first day of the rest of your life.",
        author: "John Denver"
      }
    ],
    general: [
      {
        text: "Mental health is not a destination, but a process. It's about how you drive, not where you're going.",
        author: "Noam Shpancer"
      },
      {
        text: "Self-care is not selfish. You cannot serve from an empty vessel.",
        author: "Eleanor Brown"
      },
      {
        text: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
        author: "Unknown"
      },
      {
        text: "It's okay to not be okay. It's not okay to not ask for help.",
        author: "Unknown"
      },
      {
        text: "Progress, not perfection, is the goal.",
        author: "Unknown"
      },
      {
        text: "You are enough, just as you are. Each emotion you feel is valid.",
        author: "Unknown"
      }
    ]
  };

  // Get recent mood to suggest relevant quotes
  const getRelevantQuotes = () => {
    const recentMood = moods[0]?.mood;
    if (recentMood && quotesByMood[recentMood]) {
      return [...quotesByMood[recentMood], ...quotesByMood.general];
    }
    return quotesByMood.general;
  };

  const [quotes] = useState(getRelevantQuotes());

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlay) {
      const interval = setInterval(() => {
        setCurrentQuote((prev) => (prev + 1) % quotes.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlay, quotes.length]);

  const handleNext = () => {
    setCurrentQuote((prev) => (prev + 1) % quotes.length);
  };

  const handlePrevious = () => {
    setCurrentQuote((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  const handleShare = async () => {
    const quote = quotes[currentQuote];
    const text = `"${quote.text}" - ${quote.author}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Inspirational Quote',
          text: text,
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(text);
      toast({
        title: 'Quote copied!',
        description: 'The quote has been copied to your clipboard.',
      });
    }
  };

  const handleSave = () => {
    // In a real app, this would save to favorites/bookmarks
    toast({
      title: 'Quote saved!',
      description: 'This quote has been added to your favorites.',
    });
  };

  const currentQuoteData = quotes[currentQuote];

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
          <h1 className="text-3xl font-bold">Daily Inspiration</h1>
          <p className="text-muted-foreground">
            Motivational quotes to brighten your day
          </p>
        </div>
      </div>

      {/* Quote Display */}
      <Card className="wellness-card">
        <CardContent className="p-8 lg:p-12">
          <div className="text-center space-y-6">
            {/* Quote Icon */}
            <div className="flex justify-center">
              <Quote className="h-12 w-12 text-primary/30" />
            </div>

            {/* Quote Text */}
            <blockquote className="text-2xl lg:text-3xl font-medium leading-relaxed text-foreground">
              "{currentQuoteData.text}"
            </blockquote>

            {/* Author */}
            <cite className="text-lg text-muted-foreground font-medium">
              — {currentQuoteData.author}
            </cite>

            {/* Quote Navigation */}
            <div className="flex items-center justify-center space-x-2 pt-4">
              {quotes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuote(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentQuote ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          className="flex items-center space-x-2"
        >
          <span>← Previous</span>
        </Button>

        <Button
          variant="outline"
          onClick={handleNext}
          className="flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Next Quote</span>
        </Button>

        <Button
          variant={isAutoPlay ? "default" : "outline"}
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          className="flex items-center space-x-2"
        >
          <Heart className={`h-4 w-4 ${isAutoPlay ? 'text-white' : ''}`} />
          <span>{isAutoPlay ? 'Stop Auto-play' : 'Auto-play'}</span>
        </Button>

        <Button
          variant="outline"
          onClick={handleShare}
          className="flex items-center space-x-2"
        >
          <Share className="h-4 w-4" />
          <span>Share</span>
        </Button>

        <Button
          variant="outline"
          onClick={handleSave}
          className="flex items-center space-x-2"
        >
          <Bookmark className="h-4 w-4" />
          <span>Save</span>
        </Button>
      </div>

      {/* Quote Categories */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(quotesByMood).filter(([key]) => key !== 'general').map(([mood, quotes]) => (
          <Card
            key={mood}
            className="wellness-card cursor-pointer hover:scale-105 transition-transform"
            onClick={() => {
              const allQuotes = [...quotes, ...quotesByMood.general];
              setCurrentQuote(0);
              // In a real app, we'd filter quotes by this mood
            }}
          >
            <CardContent className="p-4 text-center">
              <div className={`text-2xl mb-2 ${
                mood === 'happy' ? 'text-yellow-500' :
                mood === 'sad' ? 'text-blue-500' :
                mood === 'stressed' ? 'text-red-500' :
                mood === 'calm' ? 'text-teal-500' :
                'text-gray-500'
              }`}>
                {mood === 'happy' ? '😊' :
                 mood === 'sad' ? '😢' :
                 mood === 'stressed' ? '😰' :
                 mood === 'calm' ? '😌' : '😐'}
              </div>
              <div className="font-medium capitalize">{mood}</div>
              <div className="text-sm text-muted-foreground">{quotes.length} quotes</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mood-based Recommendation */}
      {moods.length > 0 && (
        <Card className="wellness-card bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Heart className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold">Personalized for You</h3>
                <p className="text-sm text-muted-foreground">
                  Based on your recent mood ({moods[0]?.mood}), we've curated quotes that might resonate with you today.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Quotes;