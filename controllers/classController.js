import Class from '../models/Class.js';

/**
 * Create a class/subject with a linked Google Sheet ID and (optional) Moderator (Teacher) owner.
 */
export async function createClass(req, res) {
  try {
    const { subject, section, sheetId, moderator } = req.body;
    if (!subject || !section || !sheetId) return res.status(400).json({ error: 'subject, section, sheetId required' });
    const item = await Class.create({ subject, section, sheetId, moderator });
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'create class failed' });
  }
}

export async function listClasses(req, res) {
  try {
    const items = await Class.find({}).populate('moderator', 'username roles');
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'list classes failed' });
  }
}

export async function updateClass(req, res) {
  try {
    const { id } = req.params;
    const { subject, section, sheetId, moderator } = req.body;
    const updated = await Class.findByIdAndUpdate(id, { subject, section, sheetId, moderator }, { new: true });
    if (!updated) return res.status(404).json({ error: 'class not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'update class failed' });
  }
}
