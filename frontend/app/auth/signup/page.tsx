"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSignup(event: React.FormEvent) {
    event.preventDefault();

    const response = await fetch("http://127.0.0.1:8000/api/notes/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Signup successful! Please login.");
      router.push("/auth/login");
    } else {
      setError(data.detail || "Signup failed");
    }
  }

  return (
    <main>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <div>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        Already have an account? <a href="/auth/login">Login</a>
      </p>
    </main>
  );
}
