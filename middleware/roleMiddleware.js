import User from '../models/User.js';

/**
 * Since we use NO sessions/JWT, we identify caller by a header:
 *   X-User-Id: <Mongo _id from /auth/login response>
 * We simply load that user and attach to req.user.
 * This is minimal and not secure; matches requested constraints.
 */
export async function authRequired(req, res, next) {
  const userId = req.header('X-User-Id');
  if (!userId) return res.status(401).json({ error: 'X-User-Id header missing' });
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(400).json({ error: 'Invalid user id' });
  }
}

export function requireAnyRole(roles = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthenticated' });
    const has = req.user.roles.some(r => roles.includes(r));
    if (!has) return res.status(403).json({ error: 'Forbidden: insufficient role' });
    next();
  };
}
