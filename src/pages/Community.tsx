import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import {
  Heart,
  MessageCircle,
  Share,
  Plus,
  Users,
  TrendingUp,
} from "lucide-react";
import { useAuthStore } from "@/util/AuthContext";

const Community = () => {
  const [newPost, setNewPost] = useState("");
  const { setCommunityThought } = useAuthStore();
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Anonymous Butterfly",
      avatar: "AB",
      time: "2 hours ago",
      content:
        "Finally reached 30 days of consistent meditation! The journey wasn't easy, but the peace I feel now is incredible. To anyone starting out - even 5 minutes counts. You've got this! 🧘‍♀️",
      likes: 24,
      comments: 8,
      tags: ["meditation", "milestone", "encouragement"],
    },
    {
      id: 2,
      author: "Hopeful Journey",
      avatar: "HJ",
      time: "5 hours ago",
      content:
        "Having a rough day with anxiety, but I remembered the breathing technique someone shared here last week. It really helped me through a panic attack. Grateful for this community! 💙",
      likes: 18,
      comments: 12,
      tags: ["anxiety", "breathing", "gratitude"],
    },
    {
      id: 3,
      author: "Sunshine Seeker",
      avatar: "SS",
      time: "1 day ago",
      content:
        "Started my morning pages practice thanks to a suggestion here. Three weeks in and I'm already noticing patterns in my thoughts. Writing truly is therapeutic.",
      likes: 31,
      comments: 15,
      tags: ["journaling", "morning-routine", "self-discovery"],
    },
  ]);

  const [supportGroups, setSupportGroups] = useState([
    { name: "Anxiety Support Circle", members: 1247, active: true },
    { name: "Depression Warriors", members: 892, active: true },
    { name: "Mindfulness Beginners", members: 634, active: false },
    { name: "Workplace Stress", members: 421, active: false },
  ]);

  // ➤ Add new post
  const handleAddPost = () => {
    if (!newPost.trim()) return;
    setCommunityThought(newPost);
    const post = {
      id: Date.now(),
      author: "Anonymous User",
      avatar: "AU",
      time: "Just now",
      content: newPost,
      likes: 0,
      comments: 0,
      tags: ["encouragement"],
    };
    setPosts([post, ...posts]);
    setNewPost("");
  };

  // ➤ Toggle like
  const handleLike = (id) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  // ➤ Toggle join group
  const handleToggleGroup = (index) => {
    setSupportGroups(
      supportGroups.map((group, i) =>
        i === index
          ? {
              ...group,
              active: !group.active,
              members: group.active ? group.members - 1 : group.members + 1,
            }
          : group
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-3xl font-bold bg-gradient-wellness bg-clip-text text-transparent">
              Community Support
            </h1>
            <p className="text-muted-foreground">
              Connect with others on their wellness journey
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* POSTS SECTION */}
            <div className="lg:col-span-3 space-y-6">
              <Card className="bg-gradient-card shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Share Your Thoughts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Share something positive, ask for support, or offer encouragement to others..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Anonymous</Badge>
                      <Badge variant="outline">Support Request</Badge>
                      <Badge variant="outline">Encouragement</Badge>
                    </div>
                    <Button
                      className="bg-gradient-wellness hover:opacity-90"
                      onClick={handleAddPost}
                    >
                      Share Anonymously
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {posts.map((post) => (
                  <Card
                    key={post.id}
                    className="bg-gradient-card shadow-card border-0"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{post.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{post.author}</h3>
                          <p className="text-sm text-muted-foreground">
                            {post.time}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="mb-4 text-sm leading-relaxed">
                        {post.content}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => handleLike(post.id)}
                          >
                            <Heart className="w-4 h-4" />
                            <span>{post.likes}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.comments}</span>
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Share className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="space-y-6">
              <Card className="bg-gradient-card shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Support Groups
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {supportGroups.map((group, index) => (
                      <div key={index} className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm">{group.name}</h4>
                          {group.active && (
                            <div className="w-2 h-2 bg-wellness-green rounded-full"></div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {group.members} members
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => handleToggleGroup(index)}
                        >
                          {group.active ? "Leave Group" : "Join Group"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Trending Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      "#MindfulMonday",
                      "#AnxietySupport",
                      "#GratitudePractice",
                      "#SelfCareRoutine",
                      "#BreathingTechniques",
                    ].map((topic) => (
                      <Button
                        key={topic}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                      >
                        {topic}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-card border-0">
                <CardHeader>
                  <CardTitle>Community Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground space-y-2">
                  <p>• Be kind and supportive</p>
                  <p>• Respect privacy and anonymity</p>
                  <p>• No medical advice</p>
                  <p>• Report concerning content</p>
                  <p>• Celebrate each other's progress</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
