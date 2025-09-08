import mongoose from 'mongoose';

/**
 * Class/Subject metadata, linked to a Google Sheet via sheetId.
 * Each class ideally mapped to a Teacher (Moderator) who owns the record book.
 */
const classSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  section: { type: String, required: true },
  // Reference to user who is the Moderator (Teacher)
  moderator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // Google Sheet ID for the class record book
  sheetId: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Class', classSchema);
