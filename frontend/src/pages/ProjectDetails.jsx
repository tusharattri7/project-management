import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getProjectByIdApi,
  getProjectMembersApi,
  addMemberToProjectApi,
  deleteMemberFromProjectApi,
} from "../api/project.api.js";
import {
  getTasksApi,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
} from "../api/task.api.js";
import { Button } from "../components/Button.jsx";
import { Input } from "../components/Input.jsx";
import { Modal } from "../components/Modal.jsx";
import { TaskModal } from "../components/TaskModal.jsx";
import {
  ArrowLeft,
  Plus,
  Trash2,
  UserPlus,
  CheckSquare,
  Paperclip,
} from "lucide-react";
import toast from "react-hot-toast";

const COLUMNS = [
  {
    id: "todos",
    title: "To Do",
    bg: "bg-slate-100",
    border: "border-slate-200",
  },
  {
    id: "in_progress",
    title: "In Progress",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  {
    id: "done",
    title: "Done",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
];

export const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals & Selected Task
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Task creation state
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    status: "todos",
    assignedTo: "",
  });
  const [attachments, setAttachments] = useState([]);
  const [memberForm, setMemberForm] = useState({ email: "", role: "member" });

  const fetchProjectData = async () => {
    try {
      const [projRes, tasksRes, membersRes] = await Promise.all([
        getProjectByIdApi(projectId),
        getTasksApi(projectId),
        getProjectMembersApi(projectId),
      ]);

      setProject(projRes?.data?.data || null);
      const fetchedTasks = tasksRes?.data?.data || [];
      setTasks(fetchedTasks);
      setMembers(membersRes?.data?.data || []);

      // If a task modal is currently open, keep its state synced
      if (selectedTask) {
        const updated = fetchedTasks.find((t) => t._id === selectedTask._id);
        setSelectedTask(updated || null);
      }
    } catch (error) {
      toast.error("Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", taskForm.title.trim());
      if (taskForm.description?.trim())
        formData.append("description", taskForm.description.trim());
      formData.append("status", taskForm.status);
      if (taskForm.assignedTo?.trim())
        formData.append("assignedTo", taskForm.assignedTo.trim());

      // Append files
      Array.from(attachments).forEach((file) => {
        formData.append("attachments", file);
      });

      await createTaskApi(projectId, formData);
      toast.success("Task created!");
      setIsTaskModalOpen(false);
      setTaskForm({
        title: "",
        description: "",
        status: "todos",
        assignedTo: "",
      });
      setAttachments([]);
      fetchProjectData();
    } catch (error) {
      const errorMsg =
        error.response?.data?.errors?.[0]?.msg ||
        error.response?.data?.message ||
        "Failed to create task";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (e, taskId, newStatus) => {
    e.stopPropagation();
    try {
      await updateTaskApi(projectId, taskId, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)),
      );
      toast.success("Task status updated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteTask = async (e, taskId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTaskApi(projectId, taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      if (selectedTask?._id === taskId) setSelectedTask(null);
      toast.success("Task deleted");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await addMemberToProjectApi(projectId, memberForm);
      toast.success("Member added successfully!");
      setMemberForm({ email: "", role: "member" });
      fetchProjectData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add member");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm("Remove this member from the project?")) return;
    try {
      await deleteMemberFromProjectApi(projectId, userId);
      toast.success("Member removed");
      fetchProjectData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove member");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {project?.name || "Project"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {project?.description || "No description provided."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsMemberModalOpen(true)}
              className="gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Manage Members ({members.length})
            </Button>
            <Button onClick={() => setIsTaskModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className={`flex flex-col rounded-2xl border ${col.border} ${col.bg} p-4 min-h-[500px]`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-4">
                <span className="font-semibold text-slate-800 text-sm">
                  {col.title}
                </span>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-slate-600 shadow-sm">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {colTasks.map((task) => {
                  const completedSubtasks =
                    task.subtasks?.filter((s) => s.isCompleted).length || 0;
                  const totalSubtasks = task.subtasks?.length || 0;

                  return (
                    <div
                      key={task._id}
                      onClick={() => setSelectedTask(task)}
                      className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow-md space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-slate-900 text-sm leading-snug">
                          {task.title}
                        </h4>
                        <button
                          onClick={(e) => handleDeleteTask(e, task._id)}
                          className="text-slate-400 hover:text-red-500 p-1 rounded-md transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {task.description && (
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {/* Subtask & Attachment Badges */}
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        {totalSubtasks > 0 && (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                            <CheckSquare className="h-3.5 w-3.5 text-slate-400" />
                            {completedSubtasks}/{totalSubtasks}
                          </span>
                        )}
                        {task.attachments?.length > 0 && (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                            <Paperclip className="h-3.5 w-3.5 text-slate-400" />
                            {task.attachments.length}
                          </span>
                        )}
                      </div>

                      {/* Status Selector & Assignee */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <select
                          value={task.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            handleStatusChange(e, task._id, e.target.value)
                          }
                          className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="todos">To Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>

                        {task.assignedTo && (
                          <span className="text-[11px] font-medium text-slate-500 truncate max-w-[100px]">
                            {task.assignedTo?.fullName ||
                              task.assignedTo?.username}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Details & Subtasks Modal */}
      <TaskModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        projectId={projectId}
        onTaskUpdated={fetchProjectData}
      />

      {/* Create Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Create New Task"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Task Title"
            placeholder="e.g. Implement OAuth Flow"
            value={taskForm.title}
            onChange={(e) =>
              setTaskForm({ ...taskForm, title: e.target.value })
            }
            required
          />

          <div className="w-full space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Task details and acceptance criteria"
              value={taskForm.description}
              onChange={(e) =>
                setTaskForm({ ...taskForm, description: e.target.value })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="w-full space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                value={taskForm.status}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, status: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
              >
                <option value="todos">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="w-full space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                Assign Member
              </label>
              <select
                value={taskForm.assignedTo}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, assignedTo: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.user?._id} value={m.user?._id}>
                    {m.user?.fullName || m.user?.username}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="w-full space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Attachments
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => setAttachments(e.target.files)}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Create Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* Manage Members Modal */}
      <Modal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        title="Manage Team Members"
      >
        <div className="space-y-6">
          <form onSubmit={handleAddMember} className="space-y-3">
            <Input
              label="Invite by Email"
              type="email"
              placeholder="teammate@company.com"
              value={memberForm.email}
              onChange={(e) =>
                setMemberForm({ ...memberForm, email: e.target.value })
              }
              required
            />
            <div className="flex gap-2">
              <select
                value={memberForm.role}
                onChange={(e) =>
                  setMemberForm({ ...memberForm, role: e.target.value })
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 flex-1"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <Button type="submit" isLoading={submitting}>
                Add Member
              </Button>
            </div>
          </form>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Current Members
            </h4>
            <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
              {members.map((m) => (
                <div
                  key={m._id}
                  className="flex items-center justify-between py-2.5 text-sm"
                >
                  <div>
                    <p className="font-medium text-slate-800">
                      {m.user?.fullName || m.user?.username}
                    </p>
                    <p className="text-xs text-slate-400">{m.user?.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      {m.role}
                    </span>
                    <button
                      onClick={() => handleRemoveMember(m.user?._id)}
                      className="text-slate-400 hover:text-red-500 p-1"
                      title="Remove member"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
