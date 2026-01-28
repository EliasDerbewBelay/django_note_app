import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/toggleMode";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Book,
  CheckCircle,
  Lock,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation */}
      <nav className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Book className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Notionate
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <ModeToggle />
            <Link href="/auth/login">
              <Button variant="ghost" className="hidden sm:inline-flex">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="group">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 sm:px-6 py-12 md:py-24">
        <div className="mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
            <span>Introducing AI-Powered Notes</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl mb-8 animate-slide-up">
            <span className="block">Your Thoughts,</span>
            <span className="block bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Organized Effortlessly
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground mb-12 animate-fade-in delay-300">
            A modern note-taking application that combines simplicity with
            powerful features. Capture ideas, organize thoughts, and collaborate
            seamlessly across all your devices.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-500">
            <Link href="/auth/register" className="sm:w-auto w-full">
              <Button size="lg" className="w-full sm:w-auto group">
                Start Taking Notes Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/features" className="sm:w-auto w-full">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Explore Features
              </Button>
            </Link>
          </div>
        </div>

        {/* Preview Image/Placeholder */}
        <div className="mt-20 rounded-2xl border border-border bg-gradient-to-br from-card to-background p-2 shadow-2xl animate-fade-in delay-700">
          <div className="rounded-xl border border-border bg-background overflow-hidden">
            <div className="h-96 bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="inline-block p-6 rounded-full bg-primary/10 mb-6">
                  <Book className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">
                  Interactive Dashboard Preview
                </h3>
                <p className="text-muted-foreground">
                  Your notes organized beautifully
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need for effective note-taking and organization
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-2 hover:border-primary transition-all hover:shadow-lg">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Instant search and real-time sync across all devices
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary transition-all hover:shadow-lg">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-purple-500" />
              </div>
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>
                End-to-end encryption with offline access capability
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary transition-all hover:shadow-lg">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <CardTitle>Collaborate</CardTitle>
              <CardDescription>
                Share and work together on notes in real-time
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 py-16">
        <Card className="border-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10">
          <CardContent className="pt-12 pb-12 text-center">
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Ready to organize your thoughts?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of users who transformed their note-taking
              experience
            </p>
            <Link href="/auth/register">
              <Button size="lg" className="group">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 sm:px-6 py-8 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Book className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Notionate</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Notionate. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}