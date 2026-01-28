"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  LogOut,
  X,
  Save,
  Clock,
  Calendar,
  Filter,
  MoreVertical,
  FileText,
  ChevronLeft,
  ChevronRight,
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
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Note = {
  id: number;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
};

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "recent">("all");

  const router = useRouter();

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter notes based on search and filter
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());

    if (filter === "recent") {
      const noteDate = note.updated_at ? new Date(note.updated_at) : null;
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const isRecent = noteDate && noteDate > oneWeekAgo;
      return matchesSearch && isRecent;
    }

    return matchesSearch;
  });

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    sessionStorage.clear();
    router.push("/auth/login");
  }

  useEffect(() => {
    const token =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    async function loadNotes() {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch("http://127.0.0.1:8000/api/notes/", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        if (res.status === 401) {
          router.push("/auth/login");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to load notes");
        }

        const data = await res.json();
        setNotes(data);
      } catch (err) {
        setError("Failed to load notes. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadNotes();
  }, [router]);

  async function createOrUpdateNote(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const token =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    try {
      if (editingId) {
        // UPDATE
        const res = await fetch(
          `http://127.0.0.1:8000/api/notes/update/${editingId}/`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({ title, content }),
          },
        );

        if (!res.ok) throw new Error("Failed to update note");

        const updated = await res.json();
        setNotes((prev) => prev.map((n) => (n.id === editingId ? updated : n)));
        setEditingId(null);
      } else {
        // CREATE
        const res = await fetch("http://127.0.0.1:8000/api/notes/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ title, content }),
        });

        if (!res.ok) throw new Error("Failed to create note");

        const newNote = await res.json();
        setNotes((prev) => [newNote, ...prev]);
      }

      setTitle("");
      setContent("");
    } catch (err) {
      setError("Operation failed. Please try again.");
    }
  }

  async function deleteNote(id: number) {
    const token =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token");
    if (!token) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/notes/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!res.ok) throw new Error("Failed to delete note");

      setNotes((prev) => prev.filter((n) => n.id !== id));
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
    } catch (err) {
      setError("Failed to delete note. Please try again.");
    }
  }

  function startEdit(note: Note) {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    // Scroll to form
    document
      .getElementById("note-form")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setTitle("");
    setContent("");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">NoteFlow</h1>
                <p className="text-sm text-muted-foreground">
                  {filteredNotes.length}{" "}
                  {filteredNotes.length === 1 ? "note" : "notes"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* User Profile & Logout */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <span className="font-semibold">U</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form & Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Note Form */}
            <Card id="note-form">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{editingId ? "Edit Note" : "New Note"}</span>
                  {editingId && (
                    <Button variant="ghost" size="sm" onClick={cancelEdit}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>
                  {editingId ? "Update your note" : "Capture your thoughts"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={createOrUpdateNote} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="Note title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="h-11"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Textarea
                      placeholder="Start typing your note here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[200px] resize-none"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {editingId ? (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Update Note
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Note
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Filters & Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs
                  value={filter}
                  onValueChange={(value) =>
                    setFilter(value as "all" | "recent")
                  }
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="all">
                      <Filter className="h-4 w-4 mr-2" />
                      All Notes
                    </TabsTrigger>
                    <TabsTrigger value="recent">
                      <Clock className="h-4 w-4 mr-2" />
                      Recent
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Stats</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-muted rounded-lg text-center">
                      <p className="text-2xl font-bold">{notes.length}</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg text-center">
                      <p className="text-2xl font-bold">
                        {filteredNotes.length}
                      </p>
                      <p className="text-xs text-muted-foreground">Filtered</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Notes List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Your Notes</h2>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? `Search results for "${searchQuery}"`
                    : "All your notes in one place"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-1/2" />
                      <Skeleton className="h-4 w-1/4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredNotes.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No notes found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery
                      ? "No notes match your search. Try different keywords."
                      : "Create your first note to get started!"}
                  </p>
                  <Button
                    onClick={() => {
                      document
                        .getElementById("note-form")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Note
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredNotes.map((note) => (
                  <Card
                    key={note.id}
                    className={`group hover:shadow-lg transition-all duration-200 ${
                      editingId === note.id ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-1">
                            {note.title}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(note.updated_at || note.created_at)}
                          </CardDescription>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => startEdit(note)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setNoteToDelete(note.id);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {note.content}
                      </p>
                    </CardContent>

                    <CardFooter className="pt-3 border-t flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {note.content.length} characters
                      </Badge>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEdit(note)}
                          className="h-8"
                        >
                          <Edit className="h-3 w-3 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setNoteToDelete(note.id);
                            setDeleteDialogOpen(true);
                          }}
                          className="h-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && filteredNotes.length > 0 && (
              <div className="mt-8 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {Math.min(filteredNotes.length, 10)} of{" "}
                  {filteredNotes.length} notes
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this note? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setNoteToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => noteToDelete && deleteNote(noteToDelete)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="mt-12 border-t py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} NoteFlow. All your thoughts,
              organized.
            </p>
            <div className="flex items-center gap-4">
              <Button variant="link" size="sm" className="h-auto p-0">
                Privacy
              </Button>
              <Button variant="link" size="sm" className="h-auto p-0">
                Terms
              </Button>
              <Button variant="link" size="sm" className="h-auto p-0">
                Help
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
