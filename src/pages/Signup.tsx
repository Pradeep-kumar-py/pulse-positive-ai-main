import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, Loader } from "lucide-react";
import { BASE_URL } from "@/lib/constant";
import { set } from "date-fns";
import { useAuthStore } from "@/util/AuthContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    agreePrivacy: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  // const { setAuthState } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create account");
      }
      const data = await response.json();

      localStorage.setItem("token", data.accessToken);
      // setAuthState({ isAuthenticated: true, email: data.email, name: data.name });

      navigate("/dashboard");

      console.log("Account created successfully");
    } catch (error) {
      console.error("Error creating account:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-wellness-green-soft/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-wellness rounded-2xl flex items-center justify-center shadow-mood">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-wellness bg-clip-text text-transparent">
              Start Your Journey
            </h1>
            <p className="text-muted-foreground">
              Create your wellness account today
            </p>
          </div>
        </div>

        <Card className="bg-gradient-card shadow-soft border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center">Create Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, agreeTerms: checked as boolean })
                  }
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="privacy"
                  checked={formData.agreePrivacy}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      agreePrivacy: checked as boolean,
                    })
                  }
                />
                <label
                  htmlFor="privacy"
                  className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I understand the{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader />
              </div>
            ) : (
              <Button
                onClick={handleSubmit}
                className="w-full bg-gradient-wellness hover:opacity-90"
                disabled={!formData.agreeTerms || !formData.agreePrivacy}
              >
                Create Account
              </Button>
            )}

            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                Or sign up with
              </span>
            </div>
            {/* 
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                Google
              </Button>
              <Button variant="outline" className="w-full">
                Apple
              </Button>
            </div> */}

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground space-y-1">
          <p>Your mental health data is private and secure.</p>
          <p>
            We use industry-standard encryption to protect your information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
