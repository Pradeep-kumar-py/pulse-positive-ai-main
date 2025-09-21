// Streaming chatbot using @google/genai with UI aligned to the app's design system.
import React, { useEffect, useRef, useState } from "react";
import { GoogleGenAI } from "@google/genai";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Bot, User as UserIcon, Trash2, Send } from "lucide-react";
import { SYSTEM_PROMPT } from "@/util/systemprompt";

type Role = "user" | "assistant";

interface ChatMessage {
  role: Role;
  content: string;
  timestamp: number;
}

const Chatbot: React.FC = () => {
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pendingText, setPendingText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatRef = useRef<any>(null);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  // Initialize chat session once
  useEffect(() => {
    if (!GEMINI_API_KEY) {
      setError("Missing VITE_GEMINI_API_KEY. Add it to your .env and restart the dev server.");
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      chatRef.current = ai.chats.create({
        model: "gemini-1.5-flash",
        history: [
          {
            role: "user",
            parts: [{ text: SYSTEM_PROMPT}],
          },
          {
            role: "model",
            parts: [{ text: "Hi! I’m your AI assistant. Ask me anything, and I’ll keep it crisp and helpful." }],
          },
        ],
      });
    } catch (e: any) {
      setError(e?.message ?? "Failed to initialize chat session.");
    }
  }, [GEMINI_API_KEY]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pendingText]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    if (!navigator.onLine) {
      setError("You're offline. Please check your internet connection.");
      return;
    }
    setError(null);

    const userMessage: ChatMessage = {
      role: "user",
      content: text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setPendingText("");
    setLoading(true);

    try {
      if (!chatRef.current) {
        // Lazy-create if needed
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY! });
        chatRef.current = ai.chats.create({
          model: "gemini-1.5-flash",
        });
      }

      const stream = await chatRef.current.sendMessageStream({ message: text });
      let full = "";
      for await (const chunk of stream) {
        if (chunk?.text) {
          full += chunk.text;
          setPendingText(full);
        }
      }

      const aiMessage: ChatMessage = {
        role: "assistant",
        content: full,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setPendingText("");
    } catch (e: any) {
      const friendly =
        !navigator.onLine
          ? "No internet connection."
          : e?.message?.includes("401")
          ? "Auth error. Check your API key."
          : e?.message?.includes("429")
          ? "Rate limited. Please wait and try again."
          : e?.message || "Something went wrong while contacting Gemini.";
      setError(friendly);
      setPendingText("");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setPendingText("");
    setError(null);
    if (GEMINI_API_KEY) {
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      chatRef.current = ai.chats.create({ model: "gemini-1.5-flash" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 pt-16 sm:pt-24">
        <div className="max-w-5xl mx-auto">
          <Card className="bg-gradient-card shadow-card border-0 h-[520px] sm:h-[620px] flex flex-col">
            <CardHeader className="flex-row items-center justify-between gap-3 pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span>Chatbot</span>
              </CardTitle>
              <Button variant="outline" size="sm" onClick={clearChat} className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clear</span>
              </Button>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1">
                <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                  {messages.length === 0 && !pendingText && (
                    <div className="text-center text-muted-foreground mt-10">
                      <p className="text-sm">Start chatting by typing a message below.</p>
                    </div>
                  )}

                  {messages.map((m) => (
                    <div key={m.timestamp} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`flex items-start gap-2 sm:gap-3 max-w-[90%] sm:max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          m.role === "assistant" ? "bg-gradient-to-br from-blue-500 to-purple-600" : "bg-gradient-to-br from-green-500 to-blue-500"
                        }`}>
                          {m.role === "assistant" ? (
                            <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          ) : (
                            <UserIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          )}
                        </div>
                        <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl max-w-full whitespace-pre-wrap ${
                          m.role === "assistant"
                            ? "bg-gradient-to-br from-gray-50 to-gray-100 text-foreground shadow-sm"
                            : "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                        }`}>
                          <p className="text-xs sm:text-sm leading-relaxed">{m.content}</p>
                          <p className={`text-[10px] sm:text-xs mt-1 sm:mt-2 ${m.role === "assistant" ? "text-muted-foreground" : "text-blue-100"}`}>
                            {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Streaming / typing indicator */}
                  {(loading || pendingText) && (
                    <div className="flex justify-start">
                      <div className="flex items-start gap-2 sm:gap-3 max-w-[90%] sm:max-w-[85%]">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                          <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                        <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm">
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                            {pendingText ? (
                              <span className="text-foreground whitespace-pre-wrap">{pendingText}</span>
                            ) : (
                              <>
                                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                                <span>Thinking…</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Error */}
              {error && (
                <div className="px-3 sm:px-4 pt-3">
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Input */}
              <div className="p-3 sm:p-4 border-t bg-white/50">
                <div className="flex gap-2 sm:gap-3">
                  <Input
                    placeholder={GEMINI_API_KEY ? "Type your message..." : "Missing API key. Add VITE_GEMINI_API_KEY to .env"}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pr-12 rounded-full border-2 focus:border-blue-400 transition-colors text-sm sm:text-base"
                    disabled={!GEMINI_API_KEY || loading}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!GEMINI_API_KEY || loading || !input.trim()}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full px-4 sm:px-6 shadow-lg transition-all duration-200"
                    size="sm"
                  >
                    {loading ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" /> : <Send className="w-3 h-3 sm:w-4 sm:h-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Chatbot;