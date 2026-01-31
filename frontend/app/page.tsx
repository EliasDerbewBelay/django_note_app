"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle,
  Lock,
  Sparkles,
  Users,
  Zap,
  Search,
  Tag,
  Cloud,
  Smartphone,
  Shield,
  Clock,
  Folder,
  Share2,
  Star,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description: "Instant search and real-time sync across all devices",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Secure & Private",
      description: "End-to-end encryption with offline access capability",
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Collaborate",
      description: "Share and work together on notes in real-time",
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Smart Search",
      description: "Find any note instantly with intelligent search",
      color: "text-green-600",
      bgColor: "bg-green-500/10",
    },
    {
      icon: <Tag className="h-6 w-6" />,
      title: "Tag & Organize",
      description: "Categorize notes with tags and folders",
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
    },
    {
      icon: <Cloud className="h-6 w-6" />,
      title: "Cloud Sync",
      description: "Access your notes anywhere, anytime",
      color: "text-cyan-600",
      bgColor: "bg-cyan-500/10",
    },
  ];

  const benefits = [
    {
      icon: <Smartphone className="h-5 w-5" />,
      text: "Cross-platform compatibility",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      text: "Bank-level security",
    },
    {
      icon: <Clock className="h-5 w-5" />,
      text: "No setup time required",
    },
    {
      icon: <Folder className="h-5 w-5" />,
      text: "Unlimited organization",
    },
    {
      icon: <Share2 className="h-5 w-5" />,
      text: "Easy sharing options",
    },
    {
      icon: <Star className="h-5 w-5" />,
      text: "Free forever plan",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
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
            <Link href="/auth/signup" className="sm:w-auto w-full">
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
      </main>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold mb-4 md:text-4xl">
            Everything You Need
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Powerful features designed to enhance your note-taking experience
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-2 hover:border-primary/50 transition-all hover:shadow-lg h-full"
            >
              <CardHeader>
                <div
                  className={`h-12 w-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}
                >
                  <div className={feature.color}>{feature.icon}</div>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl font-bold mb-4 md:text-4xl">
              Why Choose E-nota?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Join thousands of users who have transformed their workflow
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-lg bg-background border hover:shadow-md transition-shadow"
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <div className="text-primary">{benefit.icon}</div>
                </div>
                <span className="font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 py-16 md:py-24">
        <Card className="border-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10 overflow-hidden">
          <CardContent className="pt-16 pb-16 px-4 sm:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4 md:text-4xl">
                Ready to organize your thoughts?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Start for free, no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup">
                  <Button size="lg" className="group w-full sm:w-auto">
                    Create Free Account
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                No setup required • Free forever plan • Cancel anytime
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
