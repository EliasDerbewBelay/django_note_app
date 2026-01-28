"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Note = {
  id: number;
  title: string;
  content: string;
};

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/auth/login");
  }

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    async function loadNotes() {
      const res = await fetch("http://127.0.0.1:8000/api/notes/", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!res.ok) {
        router.push("/auth/login");
        return;
      }

      const data = await res.json();
      setNotes(data);
    }

    loadNotes();
  }, [router]);

  async function createOrUpdateNote(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token) return;

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

      const newNote = await res.json();
      setNotes((prev) => [...prev, newNote]);
    }

    setTitle("");
    setContent("");
  }

  async function deleteNote(id: number) {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    await fetch(`http://127.0.0.1:8000/api/notes/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  function startEdit(note: Note) {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
  }

  return (
    <main style={{ padding: "40px" }}>
      <h2>My Notes</h2>

      <button onClick={handleLogout}>Logout</button>

      <form onSubmit={createOrUpdateNote}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <br />
        <button type="submit">{editingId ? "Update Note" : "Add Note"}</button>
      </form>

      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <strong>{note.title}</strong> – {note.content}
            <button onClick={() => startEdit(note)}>Edit</button>
            <button onClick={() => deleteNote(note.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
