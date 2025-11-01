import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.replace("/");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    // Use replace() with a short delay to ensure re-render
    setTimeout(() => {
      router.replace("/");
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#1c1b22] flex items-center justify-center text-white">
      <div className="bg-[#2a2835] rounded-2xl p-10 shadow-2xl text-center">
        <h1 className="text-3xl font-bold mb-4 text-purple-400">
          Welcome to Dashboard ✨
        </h1>
        <p className="text-gray-300 mb-6">
          You are logged in as <b>admin</b>.
        </p>
        <button
          onClick={handleLogout}
          className="bg-purple-600 px-6 py-2 rounded-lg hover:bg-purple-700 transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
