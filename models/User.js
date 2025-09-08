import mongoose from 'mongoose';

/**
 * Roles (real-world meanings):
 * - SuperAdmin = Principal (highest authority)
 * - Admin = Department Head (manages teachers)
 * - Registrar = Records Office (enrollment/archives)
 * - Moderator = Teacher (owns class record books)
 * - Student (views grades/attendance; can vote)
 * - SSG = Student Government (special additive role)
 * - User = default newly registered account
 */
export const ROLES = Object.freeze({
  SUPER_ADMIN: 'SuperAdmin',
  ADMIN: 'Admin',
  REGISTRAR: 'Registrar',
  MODERATOR: 'Moderator',
  STUDENT: 'Student',
  SSG: 'SSG',
  USER: 'User'
});

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, trim: true },
  // Encrypted using custom Caesar cipher; not secure (by design here).
  password: { type: String, required: true },
  roles: { type: [String], default: [ROLES.USER] }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
