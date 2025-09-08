import User, { ROLES } from '../models/User.js';
import { encrypt, decrypt } from '../utils/caesarCipher.js';

/**
 * Register: all new accounts get the 'User' role only.
 * Password is encrypted using the custom Caesar cipher.
 */
export async function register(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });

    const exists = await User.findOne({ username });
    if (exists) return res.status(409).json({ error: 'username already taken' });

    const enc = encrypt(password);
    const user = await User.create({ username, password: enc, roles: [ROLES.USER] });
    res.status(201).json({ _id: user._id, username: user.username, roles: user.roles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'register failed' });
  }
}

/**
 * Login: decrypt stored password and compare to supplied password.
 * Returns _id and roles; client must send X-User-Id for subsequent requests.
 */
export async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'invalid credentials' });

    const dec = decrypt(user.password);
    if (dec !== password) return res.status(401).json({ error: 'invalid credentials' });

    res.json({ _id: user._id, username: user.username, roles: user.roles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'login failed' });
  }
}
