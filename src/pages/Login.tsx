import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Heart, Loader } from "lucide-react";
import { BASE_URL } from "@/lib/constant";
import { set } from "date-fns";
import { useAuthStore } from "@/util/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({ email, password });
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/api/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Failed to log in');
      }
      const data = await response.json();

      // Store user data in localStorage for persistence
      localStorage.setItem('userData', JSON.stringify({ 
        name: data.name, 
        email: data.email 
      }));
      
      login({ 
        name: data.name, 
        email: data.email, 
        token: data.accessToken 
      });

      navigate('/dashboard');

      console.log('Logged in successfully');
    } catch (error) {
      console.error('Error logging in:', error);
    }
    finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary-soft/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-mood">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">Continue your wellness journey</p>
          </div>
        </div>

        <Card className="bg-gradient-card shadow-soft border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot your password?
              </Link>
            </div>
            {
              isLoading ? (
                <Loader
                  className="animate-spin mx-auto" size={24} />
              ) : (
                <Button onClick={handleSubmit} className="w-full bg-gradient-primary hover:opacity-90">
                  Sign In
                </Button>
              )
            }


            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                Or continue with
              </span>
            </div>

            {/* <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                Google
              </Button>
              <Button variant="outline" className="w-full">
                Apple
              </Button>
            </div> */}

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          <p>Your privacy and security are our top priority.</p>
          <p>All data is encrypted and stored securely.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;