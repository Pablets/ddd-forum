// node_modules
import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config();

const serviceAccountKeys = readFileSync(process.env.SERVICE_ACCOUNT_KEYS, { encoding: 'utf8' });

const app = admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccountKeys) as admin.ServiceAccount),
});

const auth = getAuth(app);

export async function verifyGoogleToken(token: string) {
  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    const err = error;
    throw err;
  }
}
