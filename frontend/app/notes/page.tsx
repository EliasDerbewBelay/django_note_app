"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/authFetch";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Clock,
  Calendar,
  Filter,
  MoreVertical,
  FileText,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronFirst,
  ChevronLast,
  Eye
} from "lucide-react";

// Components
import { NoteDetail } from "@/components/models/NotesDetail";

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
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_BASE } from "@/lib/api";

type Note = {
  id: number;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
};

type SortOption = "newest" | "oldest" | "title-asc" | "title-desc" | "updated";

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
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // 5 notes per page

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

  // Sort notes based on selected sort option
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
        );
      case "oldest":
        return (
          new Date(a.created_at || 0).getTime() -
          new Date(b.created_at || 0).getTime()
        );
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      case "updated":
        return (
          new Date(b.updated_at || b.created_at || 0).getTime() -
          new Date(a.updated_at || a.created_at || 0).getTime()
        );
      default:
        return 0;
    }
  });

  // Calculate paginated notes
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedNotes = sortedNotes.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedNotes.length / pageSize);

  // Reset to page 1 when search, filter, or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filter, sortBy]);

  // Load notes
  const loadNotes = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await authFetch(`${API_BASE}/api/notes/`);

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
      console.error(err);
      setError("Failed to load notes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    loadNotes();
  }, [router]);

  // Create or update note
  async function createOrUpdateNote(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("access_token");
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
        const res = await authFetch(
          `${API_BASE}/api/notes/update/${editingId}/`,
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

        // Update selected note if it's being viewed
        if (selectedNote?.id === editingId) {
          setSelectedNote(updated);
        }

        setEditingId(null);
      } else {
        // CREATE
        const res = await authFetch(`${API_BASE}/api/notes/`, {
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
        // Reset to page 1 after creating new note
        setCurrentPage(1);
      }

      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err);
      setError("Operation failed. Please try again.");
    }
  }

  // Delete note
  async function deleteNote(id: number) {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const res = await authFetch(`${API_BASE}/api/notes/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!res.ok) throw new Error("Failed to delete note");

      setNotes((prev) => prev.filter((n) => n.id !== id));

      // Clear selected note if it was deleted
      if (selectedNote?.id === id) {
        setSelectedNote(null);
      }

      // Adjust page if needed
      if (paginatedNotes.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }

      setDeleteDialogOpen(false);
      setNoteToDelete(null);
    } catch (err) {
      console.error(err);
      setError("Failed to delete note. Please try again.");
    }
  }

  // Start editing a note
  function startEdit(note: Note) {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setSelectedNote(null); // Exit detail view when editing
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

  // Handle note click to show detail
  function handleNoteClick(note: Note) {
    setSelectedNote(note);
  }

  function closeDetailView() {
    setSelectedNote(null);
  }

  // Handle page navigation
  function goToPage(page: number) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  // Get sort option display name
  const getSortDisplayName = (option: SortOption) => {
    switch (option) {
      case "newest":
        return "Newest First";
      case "oldest":
        return "Oldest First";
      case "title-asc":
        return "Title A-Z";
      case "title-desc":
        return "Title Z-A";
      case "updated":
        return "Recently Updated";
      default:
        return "Newest First";
    }
  };

  // Get sort icon
  const getSortIcon = (option: SortOption) => {
    switch (option) {
      case "newest":
        return <ArrowDown className="h-4 w-4" />;
      case "oldest":
        return <ArrowUp className="h-4 w-4" />;
      case "title-asc":
        return <ArrowUp className="h-4 w-4" />;
      case "title-desc":
        return <ArrowDown className="h-4 w-4" />;
      case "updated":
        return <Clock className="h-4 w-4" />;
      default:
        return <ArrowUpDown className="h-4 w-4" />;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Note Detail Modal */}
        {selectedNote && (
          <NoteDetail
            note={selectedNote}
            onClose={closeDetailView}
            onEdit={startEdit}
            onDelete={(id) => {
              setNoteToDelete(id);
              setDeleteDialogOpen(true);
            }}
          />
        )}

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
                <CardTitle>Filters & Sorting</CardTitle>
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

                {/* Sort Options */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Sort By</h3>
                  <Select
                    value={sortBy}
                    onValueChange={(value: SortOption) => setSortBy(value)}
                  >
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        {getSortIcon(sortBy)}
                        <SelectValue placeholder="Sort by..." />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">
                        <div className="flex items-center gap-2">
                          <ArrowDown className="h-4 w-4" />
                          Newest First
                        </div>
                      </SelectItem>
                      <SelectItem value="oldest">
                        <div className="flex items-center gap-2">
                          <ArrowUp className="h-4 w-4" />
                          Oldest First
                        </div>
                      </SelectItem>
                      <SelectItem value="title-asc">
                        <div className="flex items-center gap-2">
                          <ArrowUp className="h-4 w-4" />
                          Title A-Z
                        </div>
                      </SelectItem>
                      <SelectItem value="title-desc">
                        <div className="flex items-center gap-2">
                          <ArrowDown className="h-4 w-4" />
                          Title Z-A
                        </div>
                      </SelectItem>
                      <SelectItem value="updated">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Recently Updated
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Stats */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Stats</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-muted rounded-lg text-center">
                      <p className="text-2xl font-bold">{notes.length}</p>
                      <p className="text-xs text-muted-foreground">
                        Total Notes
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg text-center">
                      <p className="text-2xl font-bold">{sortedNotes.length}</p>
                      <p className="text-xs text-muted-foreground">Filtered</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-muted rounded-lg text-center">
                      <p className="text-2xl font-bold">{totalPages}</p>
                      <p className="text-xs text-muted-foreground">Pages</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg text-center">
                      <p className="text-2xl font-bold">{pageSize}</p>
                      <p className="text-xs text-muted-foreground">Per Page</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Notes List */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">Your Notes</h2>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? `Search results for "${searchQuery}"`
                      : `Sorted by: ${getSortDisplayName(sortBy)}`}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    Page {currentPage} of {totalPages}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 sm:w-48"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Sort Notes By</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSortBy("newest")}>
                      <ArrowDown className="h-4 w-4 mr-2" />
                      Newest First
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                      <ArrowUp className="h-4 w-4 mr-2" />
                      Oldest First
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSortBy("title-asc")}>
                      <ArrowUp className="h-4 w-4 mr-2" />
                      Title A-Z
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("title-desc")}>
                      <ArrowDown className="h-4 w-4 mr-2" />
                      Title Z-A
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSortBy("updated")}>
                      <Clock className="h-4 w-4 mr-2" />
                      Recently Updated
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="grid gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
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
            ) : sortedNotes.length === 0 ? (
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
              <>
                {/* Notes Count */}
                <div className="mb-4 text-sm text-muted-foreground">
                  Showing {startIndex + 1}-
                  {Math.min(endIndex, sortedNotes.length)} of{" "}
                  {sortedNotes.length} notes
                </div>

                {/* Notes Grid */}
                <div className="grid gap-4">
                  {paginatedNotes.map((note) => (
                    <Card
                      key={note.id}
                      className={`group hover:shadow-lg transition-all duration-200 cursor-pointer ${
                        editingId === note.id ? "ring-2 ring-primary" : ""
                      } ${selectedNote?.id === note.id ? "ring-2 ring-primary" : ""}`}
                      onClick={() => handleNoteClick(note)}
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
                              {note.updated_at !== note.created_at && (
                                <Badge variant="outline" className="text-xs">
                                  Updated
                                </Badge>
                              )}
                            </CardDescription>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleNoteClick(note);
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEdit(note);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
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
                            onClick={(e) => {
                              e.stopPropagation();
                              startEdit(note);
                            }}
                            className="h-8"
                          >
                            <Edit className="h-3 w-3 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
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

                {/* Pagination - Only show if there are more than 5 notes */}
                {sortedNotes.length > pageSize && (
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages} • {sortedNotes.length}{" "}
                      total notes
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronFirst className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>

                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }

                            return (
                              <Button
                                key={pageNum}
                                variant={
                                  currentPage === pageNum
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                className="h-8 w-8"
                                onClick={() => goToPage(pageNum)}
                              >
                                {pageNum}
                              </Button>
                            );
                          },
                        )}
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                          <>
                            <span className="px-2">...</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8"
                              onClick={() => goToPage(totalPages)}
                            >
                              {totalPages}
                            </Button>
                          </>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(totalPages)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronLast className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
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
              © {new Date().getFullYear()} E-nota. All your thoughts, organized.
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
