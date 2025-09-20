import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import { Send, Mic, MicOff, Bot, User, Loader2 } from "lucide-react";

// Gemini AI Configuration
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

interface Message {
  id: number;
  type: "ai" | "user";
  message: string;
  timestamp: string;
}

// Gemini AI Service
const generateAIResponse = async (userMessage: string, conversationHistory: Message[]): Promise<string> => {
  if (!API_KEY) {
    return "I apologize, but the AI service is not properly configured. Please check the API key configuration.";
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a compassionate AI wellness companion designed to support mental health and wellbeing. You should be empathetic, supportive, and provide helpful guidance while always encouraging professional help when needed. Never provide medical diagnosis or treatment. Keep responses concise but meaningful, typically 2-3 sentences unless more detail is specifically requested.

Conversation context: ${conversationHistory.slice(-3).map(msg => `${msg.type}: ${msg.message}`).join('\n')}

User message: ${userMessage}

Please respond with warmth, understanding, and practical wellness advice.`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiResponse) {
      return "I'm here to help, but I'm having trouble generating a response right now. Could you try rephrasing your message?";
    }
    
    return aiResponse.trim();
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    if (error instanceof Error && error.message.includes('API_KEY')) {
      return "I apologize, but there's an issue with the AI service configuration. Please contact support.";
    }
    return "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment. If you're in crisis, please reach out to a mental health professional or crisis helpline immediately.";
  }
};

const AICompanion = () => {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([
    {
      id: 1,
      type: "ai",
      message: "Hello! I'm here to support you on your wellness journey. How are you feeling today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const formatTimestamp = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      type: "user",
      message: message.trim(),
      timestamp: formatTimestamp()
    };

    setConversation(prev => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    try {
      const aiResponse = await generateAIResponse(message.trim(), conversation);
      const aiMessage: Message = {
        id: Date.now() + 1,
        type: "ai",
        message: aiResponse,
        timestamp: formatTimestamp()
      };

      setConversation(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        type: "ai",
        message: "I apologize, but I'm having trouble responding right now. Please try again.",
        timestamp: formatTimestamp()
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickAction = (action: string) => {
    setMessage(action);
  };

  const quickActions = [
    "I'm feeling anxious",
    "Help me with breathing exercises",
    "I need motivation",
    "Suggest a coping strategy",
    "I want to talk about my day",
    "Help me set a goal"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 pt-16 sm:pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-2 mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Your AI Wellness Companion
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground px-4">A supportive guide for your mental health journey</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
            <div className="xl:col-span-3 order-1 xl:order-1">
              <Card className="bg-gradient-card shadow-card border-0 h-[500px] sm:h-[600px] lg:h-[650px] flex flex-col">
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <span className="hidden sm:inline">Chat with Your AI Guide</span>
                    <span className="sm:hidden">AI Guide</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                  <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4 max-h-[400px] sm:max-h-[480px] lg:max-h-[520px]">
                    {conversation.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex items-start gap-2 sm:gap-3 max-w-[90%] sm:max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.type === 'ai' ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-green-500 to-blue-500'
                          }`}>
                            {msg.type === 'ai' ? (
                              <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            ) : (
                              <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            )}
                          </div>
                          <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl max-w-full ${
                            msg.type === 'ai' 
                              ? 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 shadow-sm' 
                              : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md'
                          }`}>
                            <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                            <p className={`text-xs mt-1 sm:mt-2 ${msg.type === 'ai' ? 'text-gray-500' : 'text-blue-100'}`}>
                              {msg.timestamp}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="flex items-start gap-2 sm:gap-3 max-w-[90%] sm:max-w-[85%]">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                            <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                          <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm">
                            <div className="flex items-center gap-1">
                              <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                              </div>
                              <span className="text-xs text-gray-500 ml-2">AI is typing...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                  
                  <div className="p-3 sm:p-4 border-t bg-white/50">
                    <div className="flex gap-2 sm:gap-3">
                      <div className="flex-1 relative">
                        <Input
                          placeholder="Type your message..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="pr-10 sm:pr-12 rounded-full border-2 focus:border-blue-400 transition-colors text-sm sm:text-base"
                          disabled={isTyping}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsListening(!isListening)}
                          className={`absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 rounded-full p-1 sm:p-2 ${
                            isListening ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          {isListening ? <Mic className="w-3 h-3 sm:w-4 sm:h-4" /> : <MicOff className="w-3 h-3 sm:w-4 sm:h-4" />}
                        </Button>
                      </div>
                      <Button 
                        disabled={!message.trim() || isTyping}
                        onClick={sendMessage}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full px-4 sm:px-6 shadow-lg transition-all duration-200"
                        size="sm"
                      >
                        {isTyping ? (
                          <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                        ) : (
                          <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="xl:col-span-1 order-2 xl:order-2 space-y-4 sm:space-y-6">
              {/* Quick Actions - Show as horizontal scroll on mobile */}
              <Card className="bg-gradient-card shadow-card border-0">
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="xl:space-y-2">
                    {/* Mobile: Horizontal scrolling grid */}
                    <div className="xl:hidden">
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {quickActions.map((action, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="flex-shrink-0 whitespace-nowrap text-xs px-3 py-2 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                            onClick={() => handleQuickAction(action)}
                            disabled={isTyping}
                          >
                            {action}
                          </Button>
                        ))}
                      </div>
                    </div>
                    {/* Desktop: Vertical layout */}
                    <div className="hidden xl:block space-y-2">
                      {quickActions.map((action, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-left h-auto py-3 px-4 hover:bg-blue-50 hover:border-blue-200 transition-colors text-sm"
                          onClick={() => handleQuickAction(action)}
                          disabled={isTyping}
                        >
                          {action}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Crisis Support - Hidden on small screens, compact on medium */}
              <Card className="bg-gradient-card shadow-card border-0 hidden sm:block">
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg">Crisis Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-2 sm:p-3 bg-destructive/10 rounded-lg">
                    <p className="text-xs sm:text-sm font-medium text-destructive mb-1 sm:mb-2">Emergency Help</p>
                    <p className="text-xs text-muted-foreground mb-1 sm:mb-2">If you're in crisis, reach out immediately:</p>
                    <Button variant="destructive" size="sm" className="w-full text-xs sm:text-sm">
                      Call 988 (Crisis Lifeline)
                    </Button>
                  </div>
                  <div className="p-2 sm:p-3 bg-primary-soft/20 rounded-lg">
                    <p className="text-xs sm:text-sm font-medium mb-1">Text Support</p>
                    <p className="text-xs text-muted-foreground">Text HOME to 741741</p>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Stats - Compact design */}
              <Card className="bg-gradient-card shadow-card border-0 hidden lg:block">
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg">Your Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-muted-foreground">Sessions this week</span>
                    <span className="font-medium text-sm sm:text-base">5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-muted-foreground">Mood improvement</span>
                    <span className="font-medium text-wellness-green text-sm sm:text-base">+15%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-muted-foreground">Strategies learned</span>
                    <span className="font-medium text-sm sm:text-base">12</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mobile Crisis Support FAB */}
          <div className="sm:hidden fixed bottom-20 right-4 z-50">
            <Button 
              variant="destructive" 
              size="sm"
              className="rounded-full shadow-2xl px-3 py-2 text-xs font-medium"
              onClick={() => window.open('tel:988', '_self')}
            >
              🆘 Crisis Help
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICompanion;