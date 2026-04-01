import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

export default function Login() {
  const [, navigate] = useLocation();
  const trpcUtils = trpc.useContext();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔁 ถ้ามี session อยู่แล้ว → เข้าเลย
  useEffect(() => {
    fetch("/api/me", {
      credentials: "include",
    })
      .then(res => {
        if (res.ok) navigate("/");
      })
      .catch(() => {});
  }, [navigate]);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🔥 สำคัญมาก
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }
      // ✅ login สำเร็จ
      await trpcUtils.auth.me.fetch();
      navigate("/");
    } catch (err) {
      setError("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-border">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-indigo-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">W</span>
            </div>
            <h1 className="text-2xl font-bold">Work Online</h1>
            <p className="text-sm text-muted-foreground">เข้าสู่ระบบ</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 text-sm text-red-600 text-center">
              {error}
            </div>
          )}

          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mb-3 p-2 border rounded-lg"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 p-2 border rounded-lg"
          />

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "Login"}
          </Button>

          
        </div>
      </div>
    </div>
  );
}