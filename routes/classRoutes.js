import { Router } from 'express';
import { createClass, listClasses, updateClass } from '../controllers/classController.js';
import { authRequired, requireAnyRole } from '../middleware/roleMiddleware.js';
import { ROLES } from '../models/User.js';

const router = Router();

// Admin (Dept Head), Registrar, or SuperAdmin can manage classes
router.post('/',
  authRequired,
  requireAnyRole([ROLES.ADMIN, ROLES.REGISTRAR, ROLES.SUPER_ADMIN]),
  createClass
);

router.get('/',
  authRequired,
  requireAnyRole([ROLES.ADMIN, ROLES.REGISTRAR, ROLES.SUPER_ADMIN]),
  listClasses
);

router.patch('/:id',
  authRequired,
  requireAnyRole([ROLES.ADMIN, ROLES.REGISTRAR, ROLES.SUPER_ADMIN]),
  updateClass
);

export default router;
