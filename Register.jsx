import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, Loader2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function Register() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords don't match"); return; }
    setError("");
    setLoading(true);
    try {
      await base44.auth.register({ email, password });
      setStep(2);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const { access_token } = await base44.auth.verifyOtp({ email, otpCode: otp });
      base44.auth.setToken(access_token);
      window.location.href = "/";
    } catch (err) {
      setError(err.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try { await base44.auth.resendOtp(email); } catch {}
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
          <h1 className="text-2xl font-bold text-zinc-100">Create Account</h1>
          <p className="text-sm text-zinc-500 mt-1">{step === 1 ? "Get started with ResumeScreen" : "Verify your email"}</p>
        </div>

        {step === 1 ? (
          <>
            <form onSubmit={handleRegister} className="space-y-4">
              {error && <p className="text-sm text-red-400 text-center">{error}</p>}
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-zinc-100 h-11" required />
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-zinc-100 h-11" required />
              <Input type="password" placeholder="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-zinc-100 h-11" required />
              <Button type="submit" disabled={loading} className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-medium">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
              </Button>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-zinc-950 px-3 text-zinc-500">or</span></div>
            </div>
            <Button variant="outline" onClick={handleGoogle} className="w-full h-11 border-zinc-800 text-zinc-300 hover:bg-zinc-900">
              Continue with Google
            </Button>
            <p className="text-center text-sm text-zinc-500">
              Already have an account? <Link to="/login" className="text-emerald-400 hover:text-emerald-300">Sign in</Link>
            </p>
          </>
        ) : (
          <div className="space-y-6 text-center">
            {error && <p className="text-sm text-red-400">{error}</p>}
            <p className="text-sm text-zinc-400">Enter the code sent to <span className="text-zinc-200">{email}</span></p>
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  {[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} className="bg-zinc-900 border-zinc-800 text-zinc-100" />)}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button onClick={handleVerify} disabled={loading || otp.length < 6}
              className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-medium">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
            </Button>
            <button onClick={handleResend} className="text-sm text-zinc-500 hover:text-zinc-300">Resend code</button>
          </div>
        )}
      </div>
    </div>
  );
}