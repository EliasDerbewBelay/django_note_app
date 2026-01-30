"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/authFetch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, User, FileText, ArrowRight, Settings, Calendar } from "lucide-react";

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
      .split(' ')
      .map(word => word[0])
      .join('')
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">User Profile</h1>
          <p className="mt-2 text-gray-600">Manage your account and view your note-taking activity</p>
        </div>

        <Card className="shadow-xl border-gray-200 overflow-hidden">
          {/* Profile Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarImage src="" alt={profile.username} />
                  <AvatarFallback className="bg-white text-blue-600 text-2xl font-bold">
                    {getInitials(profile.username)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-3xl font-bold text-white">{profile.username}</h2>
                  <div className="flex items-center mt-2 text-blue-100">
                    <User className="h-4 w-4 mr-2" />
                    <span className="text-sm">Note Taker</span>
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="mt-4 md:mt-0 bg-white/20 text-white border-none px-4 py-2">
                <FileText className="h-4 w-4 mr-2" />
                {profile.note_count} {profile.note_count === 1 ? 'Note' : 'Notes'}
              </Badge>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stats Card */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center text-blue-800">
                    <FileText className="h-5 w-5 mr-2" />
                    Note Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-4">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-blue-600">{profile.note_count}</div>
                      <p className="text-gray-600 mt-2">Total Notes Created</p>
                      <div className="mt-4 inline-block rounded-full bg-blue-100 px-4 py-1">
                        <span className="text-sm font-medium text-blue-800">
                          {profile.note_count === 0 ? 'Start writing!' : 'Keep creating!'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Info Card */}
              <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center text-gray-800">
                    <User className="h-5 w-5 mr-2" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Username</label>
                    <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                      <span className="text-gray-800 font-medium">{profile.username}</span>
                    </div>
                  </div>
                  
                  {profile.email && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                        <span className="text-gray-800">{profile.email}</span>
                      </div>
                    </div>
                  )}
                  
                  {profile.joined_date && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Member Since</label>
                      <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-gray-800">
                          {new Date(profile.joined_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Progress/Activity Section */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Note-taking Journey</h3>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Note Creation Progress</span>
                  <span className="text-sm font-bold text-blue-600">
                    {Math.min(100, (profile.note_count / 10) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (profile.note_count / 10) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {profile.note_count < 10 
                    ? `${10 - profile.note_count} more notes to reach your first milestone!` 
                    : '🎉 You\'ve reached your note-taking goal!'}
                </p>
              </div>
            </div>
          </CardContent>

          {/* Footer with Action Buttons */}
          <CardFooter className="bg-gray-50 p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => router.push("/notes")}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md"
              >
                <FileText className="h-4 w-4 mr-2" />
                Go to Notes
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              
              <Button
                variant="outline"
                onClick={() => router.push("/settings")}
                className="border-gray-300 hover:bg-gray-50"
              >
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Button>
            </div>
            
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-md"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </CardFooter>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600">100%</div>
              <p className="text-gray-600 mt-2">Uptime</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600">256-bit</div>
              <p className="text-gray-600 mt-2">Encryption</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600">∞</div>
              <p className="text-gray-600 mt-2">Note Storage</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}