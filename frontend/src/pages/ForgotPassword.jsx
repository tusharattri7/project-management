import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPasswordApi } from "../api/auth.api.js";
import { Input } from "../components/Input.jsx";
import { Button } from "../components/Button.jsx";
import toast from "react-hot-toast";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await forgotPasswordApi(email);
      toast.success(res.data?.message || "Reset link sent to your email!");
      setSubmitted(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send reset email",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Forgot Password
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Enter your email and we'll send a password recovery link.
          </p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-emerald-600 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
              Check your inbox! We've sent instructions to{" "}
              <strong>{email}</strong>.
            </p>
            <Link
              to="/login"
              className="block text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" isLoading={loading} className="w-full">
              Send Reset Link
            </Button>
            <p className="text-center text-sm text-slate-500">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
