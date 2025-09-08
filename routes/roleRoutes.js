import { Router } from 'express';
import { assignStaffRole, assignStudentRole } from '../controllers/roleController.js';
import { authRequired, requireAnyRole } from '../middleware/roleMiddleware.js';
import { ROLES } from '../models/User.js';

const router = Router();

// Principal (SuperAdmin) -> assign Registrar/Admin
router.post('/assign-staff',
  authRequired,
  requireAnyRole([ROLES.SUPER_ADMIN]),
  assignStaffRole
);

// Registrar -> assign Student/Moderator/SSG
router.post('/assign-student',
  authRequired,
  requireAnyRole([ROLES.REGISTRAR]),
  assignStudentRole
);

export default router;
