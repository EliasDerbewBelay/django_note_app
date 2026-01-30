"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ModeToggle } from "../ui/toggleMode";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  X,
  Notebook,
  LogOut,
  User,
  Home,
  StickyNote,
} from "lucide-react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // Sync auth state whenever route changes
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    router.push("/auth/login");
  };

  const navItems = {
    common: [{ href: "/", label: "Home", icon: <Home className="h-4 w-4" /> }],
    authenticated: [
      {
        href: "/notes",
        label: "Notes",
        icon: <StickyNote className="h-4 w-4" />,
      },
      {
        href: "/profile",
        label: "Profile",
        icon: <User className="h-4 w-4" />,
      },
    ],
    unauthenticated: [
      { href: "/auth/login", label: "Login" },
      { href: "/auth/signup", label: "Register" },
    ],
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 transition-opacity hover:opacity-80"
          >
            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-primary rounded-full flex items-center justify-center">
              <Notebook className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight">
              E-nota
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            {navItems.common.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary px-2 py-1 rounded-md hover:bg-accent"
              >
                {item.label}
              </Link>
            ))}

            {isLoggedIn
              ? navItems.authenticated.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium transition-colors hover:text-primary px-2 py-1 rounded-md hover:bg-accent"
                  >
                    {item.label}
                  </Link>
                ))
              : navItems.unauthenticated.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium transition-colors hover:text-primary px-2 py-1 rounded-md hover:bg-accent"
                  >
                    {item.label}
                  </Link>
                ))}

            <div className="flex items-center gap-2 ml-2">
              <ModeToggle />

              {isLoggedIn && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-9 w-9 border border-border hover:bg-accent"
                    >
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-xs">U</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          My Account
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          User Profile
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 w-full"
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link
                        href="/notes"
                        className="flex items-center gap-2 w-full"
                      >
                        <StickyNote className="h-4 w-4" />
                        Notes
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-destructive focus:text-destructive flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </nav>

          {/* Mobile Menu & Auth State */}
          <div className="flex md:hidden items-center gap-2">
            <ModeToggle />

            {isLoggedIn && (
              <div className="hidden sm:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-8 w-8"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">U</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem asChild>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 w-full"
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  {isMenuOpen ? <X /> : <Menu />}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full max-w-xs sm:max-w-sm"
              >
                <div className="mt-8 space-y-6 px-1">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground px-3">
                      Navigation
                    </p>
                    {navItems.common.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground px-3">
                      {isLoggedIn ? "Account" : "Authentication"}
                    </p>
                    {(isLoggedIn
                      ? navItems.authenticated
                      : navItems.unauthenticated
                    ).map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        {item.icon || <span className="h-4 w-4" />}
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  {isLoggedIn && (
                    <div className="pt-4 border-t">
                      <Button
                        variant="destructive"
                        onClick={handleLogout}
                        className="w-full justify-start gap-3"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
