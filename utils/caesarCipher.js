/**
 * Extremely simple custom Caesar cipher "equation".
 * Intentionally not secure. Meets the requested constraint.
 *
 * shift = (BASE_SHIFT * MULTIPLIER) + OFFSET
 */
const BASE_SHIFT = parseInt(process.env.CIPHER_BASE_SHIFT || '3', 10);
const MULTIPLIER  = parseInt(process.env.CIPHER_MULTIPLIER || '7', 10);
const OFFSET      = parseInt(process.env.CIPHER_OFFSET || '2', 10);
const SHIFT = (BASE_SHIFT * MULTIPLIER) + OFFSET;

const A_CODE = ' '.charCodeAt(0); // start at space
const Z_CODE = '~'.charCodeAt(0); // end at tilde
const RANGE = (Z_CODE - A_CODE) + 1;

// Normalize into printable ASCII (space..tilde)
function rotateChar(code, shift) {
  if (code < A_CODE || code > Z_CODE) return code;
  const pos = code - A_CODE;
  const rotated = (pos + shift) % RANGE;
  return A_CODE + (rotated < 0 ? rotated + RANGE : rotated);
}

export function encrypt(text) {
  return Array.from(text).map(ch => String.fromCharCode(rotateChar(ch.charCodeAt(0), SHIFT))).join('');
}

export function decrypt(text) {
  return Array.from(text).map(ch => String.fromCharCode(rotateChar(ch.charCodeAt(0), -SHIFT))).join('');
}
