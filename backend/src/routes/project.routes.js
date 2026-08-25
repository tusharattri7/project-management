import { Router } from "express";
import {
  addMemberToProject,
  createProject,
  deleteMemberFromProject,
  deleteProject,
  getProjectById,
  getProjectMembers,
  getProjects,
  updateMemberRole,
  updateProject,
} from "../controllers/project.controllers.js";
import { validate } from "../middlewares/validator.middlewares.js";
import {
  createProjectValidator,
  addMemberToProjectValidator,
} from "../validators/index.js";
import {
  verifyJWT,
  validateProjetPermission,
} from "../middlewares/auth.middleware.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const router = Router();
router.use(verifyJWT);

router
  .route("/")
  .get(getProjects)
  .post(createProjectValidator(), validate, createProject);

router
  .route("/:projectId")
  .get(validateProjetPermission(AvailableUserRole), getProjectById)
  .put(
    validateProjetPermission([UserRolesEnum.ADMIN]),
    createProjectValidator(),
    validate,
    updateProject,
  )
  .delete(validateProjetPermission([UserRolesEnum.ADMIN]), deleteProject);

router
  .route("/:projectId/members")
  .get(validateProjetPermission(AvailableUserRole), getProjectMembers)
  .post(
    validateProjetPermission([UserRolesEnum.ADMIN]),
    addMemberToProjectValidator(),
    validate,
    addMemberToProject,
  );

router
  .route("/:projectId/members/:userId")
  .put(validateProjetPermission([UserRolesEnum.ADMIN]), updateMemberRole)
  .delete(
    validateProjetPermission([UserRolesEnum.ADMIN]),
    deleteMemberFromProject,
  );

export default router;
