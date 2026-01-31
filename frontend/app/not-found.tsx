"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Home,
  Search,
  FileText,
  Compass,
  AlertCircle,
  Rocket,
} from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Animated Error Code */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              {/* Glowing effect */}
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />

              {/* Main 404 display */}
              <div className="relative">
                <h1 className="text-8xl md:text-9xl font-bold tracking-tighter bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  404
                </h1>
                <div className="absolute -top-2 -right-2 animate-pulse">
                  <AlertCircle className="h-12 w-12 text-destructive" />
                </div>
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mt-6 mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Oops! The page you're looking for seems to have wandered off into
              the digital unknown. Let's get you back on track.
            </p>
          </div>

          {/* Search Suggestion */}
          <div className="bg-card border rounded-xl p-6 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Search className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">
                Can't find what you're looking for?
              </h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Try searching for it or check the URL for any typos.
            </p>
            <div className="relative">
              <input
                type="text"
                placeholder="Search across the site..."
                className="w-full p-3 pl-10 rounded-lg border bg-background"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    // Implement search functionality here
                    console.log("Search:", e.currentTarget.value);
                  }
                }}
              />
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
            <Button
              onClick={() => router.push("/")}
              className="h-auto py-6 flex flex-col items-center justify-center gap-3 hover:shadow-lg transition-all"
            >
              <div className="p-3 rounded-full bg-primary/10">
                <Home className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Return Home</p>
                <p className="text-xs text-muted-foreground">Back to safety</p>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => router.back()}
              className="h-auto py-6 flex flex-col items-center justify-center gap-3 hover:shadow-lg transition-all"
            >
              <div className="p-3 rounded-full bg-secondary/10">
                <ArrowLeft className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="font-semibold">Go Back</p>
                <p className="text-xs text-muted-foreground">Previous page</p>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/notes")}
              className="h-auto py-6 flex flex-col items-center justify-center gap-3 hover:shadow-lg transition-all"
            >
              <div className="p-3 rounded-full bg-blue-500/10">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="font-semibold">View Notes</p>
                <p className="text-xs text-muted-foreground">Your workspace</p>
              </div>
            </Button>
          </div>

          {/* Popular Links Section */}
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Compass className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-xl font-semibold">Popular Destinations</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/"
                className="group p-4 border rounded-lg hover:border-primary hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Home className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Homepage</p>
                    <p className="text-sm text-muted-foreground">
                      Back to the main dashboard
                    </p>
                  </div>
                </div>
              </Link>

              <a
                href="/notes"
                className="group p-4 border rounded-lg hover:border-primary hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                    <FileText className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">Notes Dashboard</p>
                    <p className="text-sm text-muted-foreground">
                      Manage all your notes
                    </p>
                  </div>
                </div>
              </a>

              <a
                href="/auth/login"
                className="group p-4 border rounded-lg hover:border-primary hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                    <Rocket className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">Sign In</p>
                    <p className="text-sm text-muted-foreground">
                      Access your account
                    </p>
                  </div>
                </div>
              </a>

              <a
                href="/auth/signup"
                className="group p-4 border rounded-lg hover:border-primary hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                    <Rocket className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium">Sign Up</p>
                    <p className="text-sm text-muted-foreground">
                      Create new account
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Technical Details (Optional) */}
          <div className="mt-12 pt-8 border-t text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-muted-foreground">
                Error Code: 404 • Status: Not Found
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              If you believe this is an error, please contact support or check
              back later.
            </p>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      </div>
    </main>
  );
}
