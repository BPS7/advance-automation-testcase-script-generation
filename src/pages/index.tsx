import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "password123") {
      localStorage.setItem("isLoggedIn", "true");
      router.push("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1c1b22] text-white">
      <div className="bg-[#2a2835] p-10 rounded-2xl shadow-2xl w-[400px] text-center">
        <h1 className="text-3xl font-bold text-purple-400 mb-4">Login 🔐</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4 text-left">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 rounded-lg bg-[#3b384a] focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-lg bg-[#3b384a] focus:ring-2 focus:ring-purple-500 outline-none"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            className="mt-2 bg-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
