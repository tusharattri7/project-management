import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { verifyEmailApi } from "../api/auth.api.js";
import { CheckCircle2, XCircle } from "lucide-react";

export const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying"); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await verifyEmailApi(token);
        setMessage(res.data?.message || "Email verified successfully!");
        setStatus("success");
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Verification link is invalid or expired.",
        );
        setStatus("error");
      }
    };

    if (token) verify();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 text-center shadow-sm border border-slate-200">
        {status === "verifying" && (
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            <p className="text-sm text-slate-600">
              Verifying your email address...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="inline-flex rounded-full bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Email Verified!
            </h2>
            <p className="text-sm text-slate-500">{message}</p>
            <Link
              to="/login"
              className="inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Sign In
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="inline-flex rounded-full bg-red-50 p-3 text-red-600">
              <XCircle className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Verification Failed
            </h2>
            <p className="text-sm text-slate-500">{message}</p>
            <Link
              to="/login"
              className="inline-block rounded-lg bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
