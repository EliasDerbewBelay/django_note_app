"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Notes() {
  const [notes, setNotes] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/auth/login");
      return;
    }

    fetch("http://127.0.0.1:8000/api/notes/", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          router.push("/auth/login");
        }
        return res.json();
      })
      .then((data) => setNotes(data));
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20">
      <h2>My Notes</h2>

      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <strong>{note.title}</strong> – {note.content}
          </li>
        ))}
      </ul>
    </main>
  );
}
