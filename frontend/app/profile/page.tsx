"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/authFetch";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LogOut,
  User,
  FileText,
  ArrowRight,
  Settings,
  Calendar,
  Sparkles,
  Target,
  Shield,
  Infinity,
} from "lucide-react";

type ProfileData = {
  username: string;
  note_count: number;
  email?: string;
  joined_date?: string;
};

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/auth/login");
  }

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        const res = await authFetch("http://127.0.0.1:8000/api/notes/profile/");

        if (!res.ok) {
          router.push("/auth/login");
          return;
        }
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
        router.push("/auth/login");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  // Generate initials from username for avatar
  const getInitials = (username: string) => {
    return username
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
            <CardFooter className="flex space-x-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            User Profile
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your account and view your note-taking activity
          </p>
        </div>

        <Card className="shadow-lg overflow-hidden border-border">
          {/* Profile Header with Gradient - Now using CSS variables for dark mode */}
          <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-white shadow-lg dark:border-gray-200">
                  <AvatarImage src="" alt={profile.username} />
                  <AvatarFallback className="bg-white text-blue-600 dark:bg-gray-200 dark:text-gray-900 text-xl sm:text-2xl font-bold">
                    {getInitials(profile.username)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white dark:text-gray-100">
                    {profile.username}
                  </h2>
                  <div className="flex items-center mt-2 text-white/90 dark:text-gray-300">
                    <User className="h-4 w-4 mr-2" />
                    <span className="text-sm">Note Taker</span>
                  </div>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="mt-4 md:mt-0 bg-white/20 backdrop-blur-sm text-white border border-white/30 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 px-4 py-2 hover:bg-white/30 dark:hover:bg-gray-700 transition-colors"
              >
                <FileText className="h-4 w-4 mr-2" />
                {profile.note_count}{" "}
                {profile.note_count === 1 ? "Note" : "Notes"}
              </Badge>
            </div>
          </div>

          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Stats Card */}
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Note Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-4">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-primary">
                        {profile.note_count}
                      </div>
                      <p className="text-muted-foreground mt-2">
                        Total Notes Created
                      </p>
                      <div className="mt-4 inline-block rounded-full bg-primary/10 px-4 py-1">
                        <span className="text-sm font-medium text-primary">
                          {profile.note_count === 0
                            ? "Start writing!"
                            : "Keep creating!"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Info Card */}
              <Card className="bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Username
                    </label>
                    <div className="flex items-center p-3 bg-secondary/50 rounded-lg border border-border">
                      <span className="font-medium">{profile.username}</span>
                    </div>
                  </div>

                  {profile.email && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Email
                      </label>
                      <div className="flex items-center p-3 bg-secondary/50 rounded-lg border border-border">
                        <span>{profile.email}</span>
                      </div>
                    </div>
                  )}

                  {profile.joined_date && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Member Since
                      </label>
                      <div className="flex items-center p-3 bg-secondary/50 rounded-lg border border-border">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {new Date(profile.joined_date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Progress/Activity Section */}
            <div className="mt-6 sm:mt-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-primary" />
                Your Note-taking Journey
              </h3>
              <div className="bg-secondary/50 rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    Note Creation Progress
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {Math.min(100, (profile.note_count / 10) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-primary to-primary/80 h-2.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (profile.note_count / 10) * 100)}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {profile.note_count < 10
                    ? `${10 - profile.note_count} more notes to reach your first milestone!`
                    : "🎉 You've reached your note-taking goal!"}
                </p>
              </div>
            </div>
          </CardContent>

          {/* Footer with Action Buttons */}
          <CardFooter className="bg-secondary/30 p-4 sm:p-6 border-t border-border flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                onClick={() => router.push("/notes")}
                className="w-full sm:w-auto"
              >
                <FileText className="h-4 w-4 mr-2" />
                Go to Notes
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/settings")}
                className="w-full sm:w-auto"
              >
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Button>
            </div>

            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full sm:w-auto"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </CardFooter>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 rounded-full bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-bold text-primary">100%</div>
              <p className="text-muted-foreground mt-2">Uptime</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 rounded-full bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-bold text-primary">256-bit</div>
              <p className="text-muted-foreground mt-2">Encryption</p>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 lg:col-span-1">
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 rounded-full bg-primary/10">
                  <Infinity className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-bold text-primary">∞</div>
              <p className="text-muted-foreground mt-2">Note Storage</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
