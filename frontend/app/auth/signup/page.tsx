"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  Notebook,
  User,
  Lock,
  Mail,
  Check,
  AlertCircle,
} from "lucide-react";

// Shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "password") {
      checkPasswordStrength(value);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-destructive";
    if (passwordStrength <= 50) return "bg-orange-500";
    if (passwordStrength <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError("Username is required");
      return false;
    }
    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  async function handleSignup(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/notes/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
            email: formData.email || undefined,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        setError(
          data.detail ||
            data.username?.[0] ||
            data.password?.[0] ||
            "Signup failed",
        );
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            <div className="relative p-3 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg">
              <Notebook className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mt-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            NoteFlow
          </h1>
          <p className="text-muted-foreground mt-2">
            Start organizing your thoughts
          </p>
        </div>

        {/* Signup Card */}
        <Card className="border-border shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Create an account
            </CardTitle>
            <CardDescription className="text-center">
              Enter your information to get started
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Tabs for different signup methods */}
            <Tabs defaultValue="email" className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
              </TabsList>
              <TabsContent value="email" className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-50 border-green-200">
                    <Check className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-600">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSignup} className="space-y-4">
                  {/* Username Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="username"
                      className="flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      Username *
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={(e) =>
                        handleInputChange("username", e.target.value)
                      }
                      disabled={isLoading}
                      className="h-11"
                      required
                    />
                  </div>

                  {/* Email Field (Optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email (Optional)
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      disabled={isLoading}
                      className="h-11"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" />
                      Password *
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        disabled={isLoading}
                        className="h-11 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-11 w-10"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="space-y-1">
                        <Progress
                          value={passwordStrength}
                          className={`h-2 ${getPasswordStrengthColor()}`}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Weak</span>
                          <span>Strong</span>
                        </div>
                      </div>
                    )}

                    {/* Password Requirements */}
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p className="font-medium">Password must contain:</p>
                      <ul className="space-y-1 pl-4">
                        <li
                          className={`flex items-center gap-2 ${formData.password.length >= 8 ? "text-green-600" : ""}`}
                        >
                          <Check
                            className={`h-3 w-3 ${formData.password.length >= 8 ? "opacity-100" : "opacity-0"}`}
                          />
                          At least 8 characters
                        </li>
                        <li
                          className={`flex items-center gap-2 ${/[A-Z]/.test(formData.password) ? "text-green-600" : ""}`}
                        >
                          <Check
                            className={`h-3 w-3 ${/[A-Z]/.test(formData.password) ? "opacity-100" : "opacity-0"}`}
                          />
                          One uppercase letter
                        </li>
                        <li
                          className={`flex items-center gap-2 ${/[a-z]/.test(formData.password) ? "text-green-600" : ""}`}
                        >
                          <Check
                            className={`h-3 w-3 ${/[a-z]/.test(formData.password) ? "opacity-100" : "opacity-0"}`}
                          />
                          One lowercase letter
                        </li>
                        <li
                          className={`flex items-center gap-2 ${/[0-9]/.test(formData.password) ? "text-green-600" : ""}`}
                        >
                          <Check
                            className={`h-3 w-3 ${/[0-9]/.test(formData.password) ? "opacity-100" : "opacity-0"}`}
                          />
                          One number or special character
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" />
                      Confirm Password *
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        disabled={isLoading}
                        className="h-11 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-11 w-10"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {/* Password Match Indicator */}
                    {formData.confirmPassword && (
                      <div
                        className={`text-xs flex items-center gap-1 ${formData.password === formData.confirmPassword ? "text-green-600" : "text-destructive"}`}
                      >
                        {formData.password === formData.confirmPassword ? (
                          <>
                            <Check className="h-3 w-3" />
                            Passwords match
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3" />
                            Passwords don't match
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Terms Agreement */}
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">
                      By creating an account, you agree to our{" "}
                      <Button variant="link" className="h-auto px-1 text-sm">
                        Terms of Service
                      </Button>{" "}
                      and{" "}
                      <Button variant="link" className="h-auto px-1 text-sm">
                        Privacy Policy
                      </Button>
                    </p>
                  </div>

                  {/* Signup Button */}
                  <Button
                    type="submit"
                    disabled={
                      isLoading ||
                      passwordStrength < 50 ||
                      formData.password !== formData.confirmPassword
                    }
                    className="w-full h-11"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create account"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="social" className="space-y-4">
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full h-11"
                    disabled={isLoading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continue with Google
                  </Button>

                  <Button
                    variant="outline"
                    type="button"
                    className="w-full h-11"
                    disabled={isLoading}
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    Continue with GitHub
                  </Button>

                  <Button
                    variant="outline"
                    type="button"
                    className="w-full h-11"
                    disabled={isLoading}
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Continue with Facebook
                  </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  <p>
                    We'll never post to your social media without permission
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Login Link */}
            <Button
              variant="outline"
              onClick={() => router.push("/auth/login")}
              className="w-full h-11"
              disabled={isLoading}
            >
              Sign in to existing account
            </Button>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-xs text-muted-foreground">
              <p>
                By continuing, you acknowledge that you've read and accept our
              </p>
              <p>
                <Button variant="link" className="h-auto px-1 text-xs">
                  Terms of Service
                </Button>{" "}
                and{" "}
                <Button variant="link" className="h-auto px-1 text-xs">
                  Privacy Policy
                </Button>
              </p>
            </div>
          </CardFooter>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} NoteFlow. All rights reserved.</p>
          <p className="mt-1 text-xs">
            Secure signup with end-to-end encryption
          </p>
        </div>
      </div>
    </main>
  );
}
