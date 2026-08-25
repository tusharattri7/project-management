import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { changePasswordApi } from "../api/auth.api.js";
import { Input } from "../components/Input.jsx";
import { Button } from "../components/Button.jsx";
import { User, Shield } from "lucide-react";
import toast from "react-hot-toast";

export const Settings = () => {
  const { user } = useAuth();
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await changePasswordApi(
        passwordForm.oldPassword,
        passwordForm.newPassword,
      );
      toast.success("Password updated successfully");
      setPasswordForm({ oldPassword: "", newPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Account Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your account profile and credentials.
        </p>
      </div>

      {/* User Information Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-semibold border-b border-slate-100 pb-3">
          <User className="h-4 w-4 text-indigo-600" />
          Profile Details
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-xs text-slate-400">Full Name</span>
            <p className="font-medium text-slate-800">
              {user?.fullName || "Not provided"}
            </p>
          </div>
          <div>
            <span className="text-xs text-slate-400">Username</span>
            <p className="font-medium text-slate-800">{user?.username}</p>
          </div>
          <div>
            <span className="text-xs text-slate-400">Email Address</span>
            <p className="font-medium text-slate-800">{user?.email}</p>
          </div>
          <div>
            <span className="text-xs text-slate-400">Account Role</span>
            <p className="font-medium capitalize text-slate-800">
              {user?.role || "User"}
            </p>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-semibold border-b border-slate-100 pb-3">
          <Shield className="h-4 w-4 text-indigo-600" />
          Change Password
        </div>
        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <Input
            label="Current Password"
            type="password"
            value={passwordForm.oldPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
            }
            required
          />
          <Input
            label="New Password"
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, newPassword: e.target.value })
            }
            required
          />
          <Button type="submit" isLoading={loading}>
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
};
