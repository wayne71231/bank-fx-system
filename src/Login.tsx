import { useState } from "react";
import { loginWithGoogle } from "./firebase";

export default function Login() {
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");
    try {
      await loginWithGoogle();
      window.location.href = "/dashboard"; // 登入成功跳到 Dashboard
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Bank FX System</h1>

      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-500"
      >
        使用 Google 登入
      </button>

      {error && (
        <div className="text-red-600 mt-4 text-center">{error}</div>
      )}
    </div>
  );
}
