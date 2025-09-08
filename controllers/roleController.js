import User, { ROLES } from '../models/User.js';

/**
 * SuperAdmin (Principal) assigns Registrar/Admin.
 */
export async function assignStaffRole(req, res) {
  try {
    const { targetUserId, role } = req.body;
    const allowed = [ROLES.REGISTRAR, ROLES.ADMIN];
    if (!allowed.includes(role)) return res.status(400).json({ error: 'role must be Registrar or Admin' });

    const user = await User.findById(targetUserId);
    if (!user) return res.status(404).json({ error: 'target user not found' });

    if (!user.roles.includes(role)) user.roles.push(role);
    await user.save();
    res.json({ _id: user._id, username: user.username, roles: user.roles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'assign staff role failed' });
  }
}

/**
 * Registrar (Records Office) assigns Student/Moderator/SSG roles.
 * - Student and Moderator can be added to a User.
 * - SSG is additive (special role on top of Student or Moderator).
 */
export async function assignStudentRole(req, res) {
  try {
    const { targetUserId, role } = req.body;
    const allowed = [ROLES.STUDENT, ROLES.MODERATOR, ROLES.SSG];
    if (!allowed.includes(role)) return res.status(400).json({ error: 'role must be Student, Moderator, or SSG' });

    const user = await User.findById(targetUserId);
    if (!user) return res.status(404).json({ error: 'target user not found' });

    if (!user.roles.includes(role)) user.roles.push(role);
    // If they were only 'User', keep it or remove? We'll keep it for trace; client can manage pruning if needed.
    await user.save();
    res.json({ _id: user._id, username: user.username, roles: user.roles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'assign student role failed' });
  }
}
