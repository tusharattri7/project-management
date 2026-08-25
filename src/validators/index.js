import { body } from "express-validator";
import { AvailableUserRole } from "../utils/constants.js";

const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("Email is invalid"),

    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required.")
      .isLowercase()
      .withMessage("username must be in lowercase")
      .isLength({ min: 3 })
      .withMessage("Username must be atleast 3 characters"),

    body("password").trim().notEmpty().withMessage("Password is required."),

    body("fullName").optional().trim(),
  ];
};

const userLoginValidator = () => {
  return [
    body("email").isEmail().withMessage("Email is invalid"),

    body("password").notEmpty().withMessage("Password is required"),
  ];
};

const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword").notEmpty().withMessage("Old password is required."),
    body("newPassword").notEmpty().withMessage("New password is required."),
  ];
};

const userForgotPasswordValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
  ];
};

const resetForgotPasswordValidator = () => {
  return [
    body("newPassword")
      .notEmpty()
      .withMessage("New password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ];
};

const createProjectValidator = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("Project name is required")
      .isLength({ min: 3 })
      .withMessage("Project name must be at least 3 characters long"),
    body("description").optional(),
  ];
};

const addMemberToProjectValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("Email is invalid"),
    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .isIn(AvailableUserRole)
      .withMessage(
        `Role must be one of the following: ${AvailableUserRole.join(", ")}`,
      ),
  ];
};
// --- Task & Subtask Validators ---

const createTaskValidator = () => {
  return [
    body("title").trim().notEmpty().withMessage("Task title is required"),
    body("description").optional().trim(),
    body("status")
      .optional()
      .isIn(AvailableTaskStatus)
      .withMessage(`Status must be one of: ${AvailableTaskStatus.join(", ")}`),
    body("assignedTo")
      .optional()
      .isMongoId()
      .withMessage("Invalid assigned user ID"),
  ];
};

const updateTaskValidator = () => {
  return [
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Task title cannot be empty"),
    body("description").optional().trim(),
    body("status")
      .optional()
      .isIn(AvailableTaskStatus)
      .withMessage(`Status must be one of: ${AvailableTaskStatus.join(", ")}`),
    body("assignedTo")
      .optional()
      .isMongoId()
      .withMessage("Invalid assigned user ID"),
  ];
};

const createSubTaskValidator = () => {
  return [
    body("title").trim().notEmpty().withMessage("Subtask title is required"),
  ];
};

const updateSubTaskValidator = () => {
  return [
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Subtask title cannot be empty"),
    body("isCompleted")
      .optional()
      .isBoolean()
      .withMessage("isCompleted must be a boolean value"),
  ];
};

export {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  resetForgotPasswordValidator,
  createProjectValidator,
  addMemberToProjectValidator,
  createTaskValidator,
  updateTaskValidator,
  createSubTaskValidator,
  updateSubTaskValidator,
};
