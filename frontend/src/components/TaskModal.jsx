import { useState } from "react";
import {
  createSubtaskApi,
  updateSubtaskApi,
  deleteSubtaskApi,
} from "../api/task.api.js";
import { Modal } from "./Modal.jsx";
import { Button } from "./Button.jsx";
import { Input } from "./Input.jsx";
import {
  CheckSquare,
  Square,
  Trash2,
  Plus,
  Paperclip,
  User,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";

export const TaskModal = ({
  isOpen,
  onClose,
  task,
  projectId,
  onTaskUpdated,
}) => {
  const [newSubtask, setNewSubtask] = useState("");
  const [addingSubtask, setAddingSubtask] = useState(false);

  if (!task) return null;

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;

    try {
      setAddingSubtask(true);
      await createSubtaskApi(projectId, task._id, newSubtask.trim());
      setNewSubtask("");
      toast.success("Subtask added");
      onTaskUpdated();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add subtask");
    } finally {
      setAddingSubtask(false);
    }
  };

  const handleToggleSubtask = async (subtaskId, currentStatus) => {
    try {
      await updateSubtaskApi(projectId, task._id, subtaskId, {
        isCompleted: !currentStatus,
      });
      onTaskUpdated();
    } catch (error) {
      toast.error("Failed to update subtask");
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    try {
      await deleteSubtaskApi(projectId, task._id, subtaskId);
      toast.success("Subtask removed");
      onTaskUpdated();
    } catch (error) {
      toast.error("Failed to delete subtask");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task.title}>
      <div className="space-y-6">
        {/* Description */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Description
          </h4>
          <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 min-h-[60px]">
            {task.description || "No description provided."}
          </p>
        </div>

        {/* Task Meta Details */}
        <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400" />
            <span>
              Assignee:{" "}
              <strong>
                {task.assignedTo?.fullName ||
                  task.assignedTo?.username ||
                  "Unassigned"}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>
              Created:{" "}
              <strong>{new Date(task.createdAt).toLocaleDateString()}</strong>
            </span>
          </div>
        </div>

        {/* Subtasks Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Subtasks (
              {task.subtasks?.filter((s) => s.isCompleted).length || 0}/
              {task.subtasks?.length || 0})
            </h4>
          </div>

          {/* Subtask list */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {task.subtasks && task.subtasks.length > 0 ? (
              task.subtasks.map((st) => (
                <div
                  key={st._id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 border border-slate-100 transition"
                >
                  <button
                    type="button"
                    onClick={() => handleToggleSubtask(st._id, st.isCompleted)}
                    className="flex items-center gap-2.5 text-left text-sm flex-1"
                  >
                    {st.isCompleted ? (
                      <CheckSquare className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                    <span
                      className={
                        st.isCompleted
                          ? "line-through text-slate-400"
                          : "text-slate-800"
                      }
                    >
                      {st.title}
                    </span>
                  </button>
                  <button
                    onClick={() => handleDeleteSubtask(st._id)}
                    className="p-1 text-slate-400 hover:text-red-600 transition rounded"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No subtasks yet.</p>
            )}
          </div>

          {/* Add Subtask Form */}
          <form onSubmit={handleAddSubtask} className="flex gap-2 pt-1">
            <input
              type="text"
              placeholder="Add a new checklist item..."
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button
              type="submit"
              isLoading={addingSubtask}
              className="text-xs px-3 py-1.5"
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Add
            </Button>
          </form>
        </div>

        {/* Attachments Section */}
        {task.attachments && task.attachments.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Attachments ({task.attachments.length})
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {task.attachments.map((file, idx) => (
                <a
                  key={idx}
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs text-slate-700 truncate transition"
                >
                  <Paperclip className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">
                    {file.name || `Attachment ${idx + 1}`}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
