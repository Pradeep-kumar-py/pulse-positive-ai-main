import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import Navigation from "@/components/Navigation";
import { Smile, Frown, Meh, Heart, Zap, Loader } from "lucide-react";
import { set } from "date-fns";
import { useAuthStore } from "@/util/AuthContext";

// Tailwind keyframes & animations (add these in globals.css or tailwind.config)
const animations = `
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes bounceSelect {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`;

const MoodTracking = () => {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [moodIntensity, setMoodIntensity] = useState([5]);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setMood, setIntensity, setDescription } = useAuthStore();

  const moods = [
    { id: "happy", label: "Happy", icon: Smile, color: "mood-happy" },
    { id: "sad", label: "Sad", icon: Frown, color: "mood-sad" },
    { id: "anxious", label: "Anxious", icon: Heart, color: "mood-anxious" },
    { id: "calm", label: "Calm", icon: Meh, color: "mood-calm" },
    { id: "energetic", label: "Energetic", icon: Zap, color: "mood-energetic" },
  ];

  const handleSubmit = async () => {
    // Handle form submission (e.g., save to backend or local storage)
    console.log({ selectedMood, moodIntensity: moodIntensity[0], notes });
    try {
      setIsLoading(true);
      const mood = selectedMood;
      const intensity = moodIntensity[0];
      const description = notes;
      setMood(mood);
      setIntensity(String(moodIntensity[0]));
      setDescription(description);
      const response = await fetch("http://localhost:4000/api/mood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mood, intensity, description }),
      });
    } catch (error) {
      console.error("Error submitting mood:", error);
    } finally {
      setSelectedMood("");
      setMoodIntensity([5]);
      setNotes("");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted relative">
      {/* Inject animations */}
      <style>{animations}</style>

      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Heading */}
          <div className="text-center space-y-2 animate-[fadeInUp_0.6s_ease-out]">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              How are you feeling today?
            </h1>
            <p className="text-muted-foreground">
              Track your emotions and reflect on your day
            </p>
          </div>

          {/* Mood Selector */}
          <Card className="bg-gradient-card shadow-card border-0 animate-[fadeInUp_0.8s_ease-out]">
            <CardHeader>
              <CardTitle>Select Your Mood</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {moods.map(({ id, label, icon: Icon, color }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedMood(id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 relative overflow-hidden group
                      ${
                        selectedMood === id
                          ? `border-${color} bg-${color}/10 animate-[bounceSelect_0.3s]`
                          : "border-border hover:border-muted-foreground"
                      }
                    `}
                  >
                    <Icon
                      className={`w-8 h-8 mx-auto mb-2 transition-colors duration-300 ${
                        selectedMood === id
                          ? `text-${color}`
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    />
                    <p
                      className={`text-sm font-medium transition-colors duration-300 ${
                        selectedMood === id
                          ? `text-${color}`
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {label}
                    </p>
                  </button>
                ))}
              </div>

              {/* Mood Details (animated reveal) */}
              {selectedMood && (
                <div className="space-y-4 animate-[fadeInUp_0.5s_ease-out]">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Intensity Level: {moodIntensity[0]}/10
                    </label>
                    <Slider
                      value={moodIntensity}
                      onValueChange={setMoodIntensity}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      What's on your mind? (Optional)
                    </label>
                    <Textarea
                      placeholder="Share your thoughts, what triggered this feeling, or what you're grateful for..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  {isLoading ? (
                    <div className="w-full text-center text-muted-foreground">
                      <Loader className="w-6 h-6 mx-auto animate-spin" />
                    </div>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      className="w-full bg-gradient-primary hover:opacity-90 relative overflow-hidden
                      before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:via-white/40 before:to-white/20 
                      before:bg-[length:200%_100%] before:animate-[shimmer_2s_infinite]
                      "
                    >
                      Save Mood Entry
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent History */}
          <Card className="bg-gradient-card shadow-card border-0 animate-[fadeInUp_1s_ease-out]">
            <CardHeader>
              <CardTitle>Recent Mood History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((day) => (
                  <div
                    key={day}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <Smile className="w-5 h-5 text-mood-happy" />
                      <div>
                        <p className="font-medium">Happy</p>
                        <p className="text-sm text-muted-foreground">
                          {day} day{day !== 1 ? "s" : ""} ago
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Intensity: 7/10
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MoodTracking;
