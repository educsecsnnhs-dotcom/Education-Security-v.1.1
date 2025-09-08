import { google } from 'googleapis';
import Class from '../models/Class.js';

/**
 * Build Google Sheets client using a Service Account.
 * Credentials are loaded from env GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY.
 */
function getSheetsClient() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  if (!clientEmail || !privateKey) throw new Error('Missing Google service account envs');

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  return google.sheets({ version: 'v4', auth });
}

export async function readRecordBook(req, res) {
  try {
    const { classId } = req.params;
    const range = req.query.range || process.env.DEFAULT_SHEET_RANGE || 'Sheet1!A1:Z1000';
    const cls = await Class.findById(classId);
    if (!cls) return res.status(404).json({ error: 'class not found' });

    const sheets = getSheetsClient();
    const resp = await sheets.spreadsheets.values.get({
      spreadsheetId: cls.sheetId,
      range
    });
    res.json({ classId, sheetId: cls.sheetId, range, values: resp.data.values || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'read record book failed' });
  }
}

export async function writeRecordBook(req, res) {
  try {
    const { classId } = req.params;
    const { range, values } = req.body;
    if (!range || !Array.isArray(values)) return res.status(400).json({ error: 'range and values[] required' });

    const cls = await Class.findById(classId);
    if (!cls) return res.status(404).json({ error: 'class not found' });

    const sheets = getSheetsClient();
    const resp = await sheets.spreadsheets.values.update({
      spreadsheetId: cls.sheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values }
    });

    res.json({ classId, sheetId: cls.sheetId, range, updated: resp.data.updatedCells });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'write record book failed' });
  }
}

// Optional: export to .xlsx (stub). Typically requires Drive API export if Sheet is in Google Drive.
export async function exportRecordBookXlsx(req, res) {
  res.status(501).json({ error: 'Export to .xlsx not implemented in this scaffold' });
}
