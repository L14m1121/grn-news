"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../../../lib/firebase";


import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
router.push("/news/admin");

    } catch (err) {
      console.error(err);
      setError("Invalid credentials. Try again.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f4ec] text-[#111] flex items-center justify-center font-serif">
      <form
        onSubmit={handleLogin}
        className="bg-white border border-gray-300 shadow-md rounded-xl p-10 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Login</h1>

        <label className="block mb-2 font-semibold">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-400 rounded-md px-3 py-2 mb-4"
        />

        <label className="block mb-2 font-semibold">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-gray-400 rounded-md px-3 py-2 mb-6"
        />

        {error && <p className="text-red-600 text-center mb-3">{error}</p>}

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition"
        >
          Sign In
        </button>
      </form>
    </main>
  );
}
