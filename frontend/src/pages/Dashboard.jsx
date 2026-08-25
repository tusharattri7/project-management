import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getProjectsApi,
  createProjectApi,
  deleteProjectApi,
} from "../api/project.api.js";
import { Button } from "../components/Button.jsx";
import { Input } from "../components/Input.jsx";
import { Modal } from "../components/Modal.jsx";
import { Plus, FolderKanban, Users, Clock, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await getProjectsApi();
      const rawData = res.data?.data || [];

      const normalized = rawData.map((item) => {
        const projectObj = item.project || item;
        return {
          _id: projectObj._id || item._id,
          name: projectObj.name || item.name || "Untitled Project",
          description: projectObj.description || item.description || "",
          role: item.role || projectObj.role || "member",
          membersCount: item.membersCount || projectObj.membersCount || 1,
          createdAt:
            projectObj.createdAt || item.createdAt || new Date().toISOString(),
        };
      });

      setProjects(normalized);
    } catch (error) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setCreating(true);
      await createProjectApi(formData);
      toast.success("Project created!");
      setIsModalOpen(false);
      setFormData({ name: "", description: "" });
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteProject = async (e, projectId) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project? All associated tasks will be removed.",
    );

    if (!confirmDelete) return;

    try {
      await deleteProjectApi(projectId);
      toast.success("Project deleted successfully");
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to delete project";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Projects
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your active boards, team members, and task deadlines.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Project
        </Button>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-44 rounded-xl border border-slate-200 bg-white p-6 animate-pulse space-y-4"
            >
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              <div className="h-3 bg-slate-100 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="rounded-full bg-indigo-50 p-4 text-indigo-600 mb-3">
            <FolderKanban className="h-8 w-8" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">
            No projects yet
          </h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm">
            Create your first workspace to begin organizing tasks and
            collaborating with your team.
          </p>
          <Button onClick={() => setIsModalOpen(true)} className="mt-5 gap-2">
            <Plus className="h-4 w-4" />
            Create Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project._id}
              to={`/projects/${project._id}`}
              className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-xs hover:border-indigo-400 hover:shadow-md transition duration-200"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-900 text-base group-hover:text-indigo-600 transition truncate">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                      {project.role}
                    </span>
                    <button
                      onClick={(e) => handleDeleteProject(e, project._id)}
                      title="Delete Project"
                      className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {project.description || "No description provided."}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 font-medium text-slate-500">
                  <Users className="h-3.5 w-3.5 text-slate-400" />
                  {project.membersCount}{" "}
                  {project.membersCount === 1 ? "member" : "members"}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {new Date(project.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Project Name"
            placeholder="e.g. Website Redesign"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <div className="w-full space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="What is the goal of this project?"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={creating}>
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
