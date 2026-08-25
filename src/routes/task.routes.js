import { Router } from "express";
import {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  createSubTask,
  updateSubTask,
  deleteSubtask,
} from "../controllers/task.controllers.js";
import {
  verifyJWT,
  validateProjetPermission,
} from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
import {
  createTaskValidator,
  updateTaskValidator,
  createSubTaskValidator,
  updateSubTaskValidator,
} from "../validators/index.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const router = Router();
router.use(verifyJWT);

// Tasks under a Project
router
  .route("/:projectId")
  .get(validateProjetPermission(AvailableUserRole), getTasks)
  .post(
    validateProjetPermission([UserRolesEnum.ADMIN]),
    upload.array("attachments", 5),
    createTaskValidator(),
    validate,
    createTask,
  );

// Individual Task Operations
router
  .route("/:projectId/task/:taskId")
  .get(validateProjetPermission(AvailableUserRole), getTaskById)
  .put(
    validateProjetPermission([UserRolesEnum.ADMIN]),
    updateTaskValidator(),
    validate,
    updateTask,
  )
  .delete(validateProjetPermission([UserRolesEnum.ADMIN]), deleteTask);

// Subtask Operations
router
  .route("/:projectId/task/:taskId/subtasks")
  .post(
    validateProjetPermission(AvailableUserRole),
    createSubTaskValidator(),
    validate,
    createSubTask,
  );

router
  .route("/:projectId/task/:taskId/subtasks/:subtaskId")
  .put(
    validateProjetPermission(AvailableUserRole),
    updateSubTaskValidator(),
    validate,
    updateSubTask,
  )
  .delete(validateProjetPermission(AvailableUserRole), deleteSubtask);

export default router;
