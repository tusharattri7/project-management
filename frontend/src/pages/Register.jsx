import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Input } from "../components/Input.jsx";
import { Button } from "../components/Button.jsx";

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      navigate("/login");
    } catch (err) {
      // Error toasted in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Create an account
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Start collaborating with your team today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
          />

          <Input
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="johndoe"
            required
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <Button type="submit" isLoading={loading} className="w-full">
            Register
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
