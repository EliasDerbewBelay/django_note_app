"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/toggleMode";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Github,
  Linkedin,
  Send,
  Mail,
  MapPin,
  Phone,
  Instagram,
  Twitter,
  Heart,
  Notebook,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      url: "https://linkedin.com/in/yourusername",
      color: "hover:text-[#0A66C2]",
    },
    {
      name: "GitHub",
      icon: <Github className="h-5 w-5" />,
      url: "https://github.com/yourusername",
      color: "hover:text-gray-900 dark:hover:text-gray-100",
    },
    {
      name: "Telegram",
      icon: <Send className="h-5 w-5" />,
      url: "https://t.me/yourusername",
      color: "hover:text-[#0088cc]",
    },
    {
      name: "Twitter",
      icon: <Twitter className="h-5 w-5" />,
      url: "https://twitter.com/yourusername",
      color: "hover:text-[#1DA1F2]",
    },
    {
      name: "Instagram",
      icon: <Instagram className="h-5 w-5" />,
      url: "https://instagram.com/yourusername",
      color: "hover:text-[#E4405F]",
    },
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms-of-service" },
    { name: "Cookie Policy", href: "/cookie-policy" },
  ];

  const contactInfo = [
    {
      icon: <Mail className="h-4 w-4" />,
      text: "elias@example.com",
      href: "mailto:elias@example.com",
    },
    {
      icon: <Phone className="h-4 w-4" />,
      text: "+1 (555) 123-4567",
      href: "tel:+15551234567",
    },
    {
      icon: <MapPin className="h-4 w-4" />,
      text: "San Francisco, CA",
      href: "#",
    },
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription submitted");
  };

  return (
    <footer className="border-t bg-background">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Brand & Description */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-xl font-bold tracking-tight text-foreground sm:text-2xl relative inline-block group"
              >
                <div className="relative flex items-center gap-3">
                  {/* Elegant circular logo */}
                  <div className="relative h-12 w-12">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300" />
                    <div className="relative h-12 w-12 bg-gradient-to-br from-primary to-primary/90 rounded-full flex items-center justify-center shadow-md">
                      <Notebook className="h-6 w-6 text-primary-foreground" />
                    </div>
                    {/* Small badge for "E" */}
                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-background rounded-full border-2 border-primary flex items-center justify-center">
                      <span className="text-[10px] font-bold text-primary">
                        E
                      </span>
                    </div>
                  </div>

                  {/* Clean text */}
                  <div className="flex flex-col items-start">
                    <span className="text-2xl font-bold text-foreground">
                      E-nota
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Notes by Elias
                    </span>
                  </div>
                </div>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              Full Stack Developer passionate about creating beautiful,
              functional web applications. Always learning, always building.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4 pt-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`rounded-full border p-2 transition-all duration-300 hover:scale-110 ${link.color}`}
                  aria-label={`Visit ${link.name}`}
                >
                  {link.icon}
                </a>
              ))}
            </div>

            {/* Theme Toggle in Footer */}
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-2">Theme</p>
              <ModeToggle />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
            <ul className="space-y-4">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    {info.icon}
                  </div>
                  <a
                    href={info.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {info.text}
                  </a>
                </li>
              ))}
            </ul>

            {/* Let's Connect CTA */}
            <div className="mt-6">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/contact">
                  <Mail className="mr-2 h-4 w-4" />
                  Let's Connect
                </Link>
              </Button>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to my newsletter for the latest projects and insights.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-background"
                required
              />
              <Textarea
                placeholder="Any specific interests? (Optional)"
                className="bg-background min-h-[100px]"
                rows={3}
              />
              <Button type="submit" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Copyright */}
          <div className="text-center text-sm text-muted-foreground md:text-left">
            © {currentYear} Elias. All rights reserved.
            <p className="mt-1">
              Built with <Heart className="inline h-3 w-3 text-red-500" /> using
              Next.js & Tailwind CSS
            </p>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Back to Top Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-sm"
          >
            ↑ Back to Top
          </Button>
        </div>
      </div>

      {/* Mobile Bottom Navigation (Optional) */}
      <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-around">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <span className="text-xs">Home</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/portfolio">
                <span className="text-xs">Portfolio</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/contact">
                <span className="text-xs">Contact</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm">
              <span
                className="text-xs"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Top
              </span>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
