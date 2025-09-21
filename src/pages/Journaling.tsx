import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import { PlusCircle, Search, BookOpen, Mic, MicOff } from "lucide-react";
import { useAuthStore } from "@/util/AuthContext";

// Utility: word counter
const countWords = (text: string) =>
  text.trim().length > 0 ? text.trim().split(/\s+/).length : 0;

const Journaling = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [newEntry, setNewEntry] = useState("");
  const [entryTitle, setEntryTitle] = useState("");
  const { setJournalTitle, setJournalContent } = useAuthStore();
  const [entries, setEntries] = useState([
    {
      id: 1,
      title: "Morning Reflections",
      date: "Today",
      preview:
        "Started the day with gratitude meditation. Feeling more centered and ready to face challenges...",
      mood: "calm",
      draft: false,
    },
    {
      id: 2,
      title: "Overcoming Anxiety",
      date: "Yesterday",
      preview:
        "Had a challenging presentation at work but used breathing techniques to stay calm. Proud of my growth...",
      mood: "happy",
      draft: false,
    },
    {
      id: 3,
      title: "Weekend Adventures",
      date: "2 days ago",
      preview:
        "Spent time in nature with friends. Reminded me how important connection and fresh air are for my wellbeing...",
      mood: "energetic",
      draft: false,
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  // Save entry
  const handleSave = (isDraft = false) => {
    if (!entryTitle && !newEntry) return;

    setJournalTitle(entryTitle);
    setJournalContent(newEntry);
    const newItem = {
      id: Date.now(),
      title: entryTitle || "Untitled Entry",
      date: "Just now",
      preview: newEntry.slice(0, 120) + (newEntry.length > 120 ? "..." : ""),
      mood: "calm", // (could add mood selection later)
      draft: isDraft,
    };

    setEntries([newItem, ...entries]);
    setEntryTitle("");
    setNewEntry("");
  };

  // Filtered entries (search)
  const filteredEntries = useMemo(() => {
    return entries.filter(
      (e) =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.preview.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [entries, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = entries.filter((e) => !e.draft).length;
    const streak = 12; // placeholder logic (could track by dates)
    const words = entries.reduce((sum, e) => sum + countWords(e.preview), 0);
    const avgMood = "Positive"; // placeholder (could calculate sentiment)

    return { total, streak, words, avgMood };
  }, [entries]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-calm bg-clip-text text-transparent">
              Your Personal Journal
            </h1>
            <p className="text-muted-foreground">
              Reflect, process, and discover insights through writing
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-6">
              {/* NEW ENTRY */}
              <Card className="bg-gradient-card shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlusCircle className="w-5 h-5" />
                    Write New Entry
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Give your entry a title..."
                    value={entryTitle}
                    onChange={(e) => setEntryTitle(e.target.value)}
                  />
                  <div className="relative">
                    <Textarea
                      placeholder="What's on your mind today? Share your thoughts, feelings, experiences..."
                      value={newEntry}
                      onChange={(e) => setNewEntry(e.target.value)}
                      className="min-h-[200px] pr-12"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsRecording(!isRecording)}
                      className={`absolute bottom-2 right-2 ${
                        isRecording ? "text-red-500" : "text-muted-foreground"
                      }`}
                    >
                      {isRecording ? (
                        <Mic className="w-4 h-4" />
                      ) : (
                        <MicOff className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-gradient-calm hover:opacity-90"
                      onClick={() => handleSave(false)}
                    >
                      Save Entry
                    </Button>
                    <Button variant="outline" onClick={() => handleSave(true)}>
                      Save as Draft
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* RECENT ENTRIES */}
              <Card className="bg-gradient-card shadow-card border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Entries</CardTitle>
                    <div className="relative w-64">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search entries..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-lg flex gap-2 items-center">
                            {entry.title}
                            {entry.draft && (
                              <span className="text-xs text-orange-500">
                                (Draft)
                              </span>
                            )}
                          </h3>
                          <span className="text-sm text-muted-foreground">
                            {entry.date}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
                          {entry.preview}
                        </p>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full bg-mood-${entry.mood}`}
                          ></div>
                          <span className="text-xs text-muted-foreground capitalize">
                            {entry.mood} mood
                          </span>
                        </div>
                      </div>
                    ))}
                    {filteredEntries.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No entries found.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* AI INSIGHTS */}
              <Card className="bg-gradient-card shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-primary-soft/20 rounded-lg">
                    <p className="text-sm font-medium mb-1">Pattern Detected</p>
                    <p className="text-xs text-muted-foreground">
                      You tend to feel more positive after outdoor activities
                    </p>
                  </div>
                  <div className="p-3 bg-wellness-green-soft/20 rounded-lg">
                    <p className="text-sm font-medium mb-1">Gratitude Streak</p>
                    <p className="text-xs text-muted-foreground">
                      7 days of including gratitude in your entries!
                    </p>
                  </div>
                  <div className="p-3 bg-accent/20 rounded-lg">
                    <p className="text-sm font-medium mb-1">Reflection Tip</p>
                    <p className="text-xs text-muted-foreground">
                      Try writing about three things you learned today
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* STATS */}
              <Card className="bg-gradient-card shadow-card border-0">
                <CardHeader>
                  <CardTitle>Journal Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total entries
                    </span>
                    <span className="font-medium">{stats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Current streak
                    </span>
                    <span className="font-medium">{stats.streak} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Words written
                    </span>
                    <span className="font-medium">{stats.words}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Avg. mood
                    </span>
                    <span className="font-medium text-wellness-green">
                      {stats.avgMood}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journaling;
