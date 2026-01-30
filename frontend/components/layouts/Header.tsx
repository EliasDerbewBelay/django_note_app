"use client";

import Link from "next/link";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ModeToggle } from "../ui/toggleMode";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Notebook } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
  }, []);

  function syncAuth() {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
  }

  useEffect(() => {
    const handleStorageChange = () => {
      syncAuth();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    syncAuth();
    setIsMenuOpen(false);
    router.push("/auth/login");
  };

  // Navigation items
  const navItems = {
    common: [{ href: "/", label: "Home" }],
    authenticated: [
      { href: "/notes", label: "Notes" },
      { href: "/profile", label: "Profile" },
    ],
    unauthenticated: [
      { href: "/auth/login", label: "Login" },
      { href: "/auth/signup", label: "Register" },
    ],
  };

  return (
    <header className="sticky m-2 top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {/* Common Navigation */}
            {navItems.common.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}

            {/* Conditional Navigation */}
            {isLoggedIn ? (
              <>
                {navItems.authenticated.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </>
            ) : (
              <>
                {navItems.unauthenticated.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </>
            )}

            {/* Theme Toggle */}
            <div className="ml-4">
              <ModeToggle />
            </div>

            {/* Authenticated User Dropdown (Desktop) */}
            {isLoggedIn && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatar.png" alt="User" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Mobile Menu Button and Controls */}
          <div className="flex items-center gap-4 md:hidden">
            {/* Theme Toggle on Mobile */}
            <ModeToggle />

            {/* Mobile Menu Sheet */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  {/* Mobile Navigation */}
                  <div className="flex-1 py-6">
                    <div className="space-y-6">
                      {/* Common Navigation */}
                      {navItems.common.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block text-lg font-medium transition-colors hover:text-foreground/80 py-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}

                      {/* Conditional Navigation */}
                      {isLoggedIn ? (
                        <>
                          {navItems.authenticated.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="block text-lg font-medium transition-colors hover:text-foreground/80 py-2"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {item.label}
                            </Link>
                          ))}
                          <div className="pt-6 border-t">
                            <Button
                              variant="destructive"
                              className="w-full"
                              onClick={handleLogout}
                            >
                              Logout
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          {navItems.unauthenticated.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="block text-lg font-medium transition-colors hover:text-foreground/80 py-2"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </>
                      )}
                    </div>
                  </div>

                  {/* User Info for Mobile */}
                  {isLoggedIn && (
                    <div className="border-t pt-6">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="/avatar.png" alt="User" />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">User Name</p>
                          <p className="text-xs text-muted-foreground">
                            user@example.com
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Auth Buttons for Non-Logged In Users */}
          {!isLoggedIn && (
            <div className="hidden md:flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
