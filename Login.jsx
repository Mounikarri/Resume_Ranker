import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.href = "/";
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    base44.auth.loginWithProvider("google", "/");
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-emerald-400/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-100">ResumeScreen</h1>
          <p className="text-sm text-zinc-500 mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          <Input
            type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-900 border-zinc-800 text-zinc-100 h-11" required
          />
          <Input
            type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="bg-zinc-900 border-zinc-800 text-zinc-100 h-11" required
          />
          <Button type="submit" disabled={loading} className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-medium">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-zinc-950 px-3 text-zinc-500">or</span></div>
        </div>

        <Button variant="outline" onClick={handleGoogle} className="w-full h-11 border-zinc-800 text-zinc-300 hover:bg-zinc-900">
          Continue with Google
        </Button>

        <div className="text-center text-sm text-zinc-500 space-y-1">
          <Link to="/forgot-password" className="hover:text-zinc-300 block">Forgot password?</Link>
          <span>Don't have an account? <Link to="/register" className="text-emerald-400 hover:text-emerald-300">Sign up</Link></span>
        </div>
      </div>
    </div>
  );
}