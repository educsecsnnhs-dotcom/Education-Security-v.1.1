import { Router } from 'express';
import { readRecordBook, writeRecordBook, exportRecordBookXlsx } from '../controllers/recordBookController.js';
import { authRequired, requireAnyRole } from '../middleware/roleMiddleware.js';
import { ROLES } from '../models/User.js';

const router = Router();

// Teachers (Moderator) can write. Registrar/Admin/SuperAdmin can read/export.
router.get('/:classId',
  authRequired,
  requireAnyRole([ROLES.MODERATOR, ROLES.REGISTRAR, ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  readRecordBook
);

router.post('/:classId',
  authRequired,
  requireAnyRole([ROLES.MODERATOR]),
  writeRecordBook
);

router.get('/:classId/export',
  authRequired,
  requireAnyRole([ROLES.REGISTRAR, ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  exportRecordBookXlsx
);

export default router;
