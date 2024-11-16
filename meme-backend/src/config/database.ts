import * as admin from 'firebase-admin';
import 'dotenv/config';

const FIREBASE_CREDENTIALS = process.env.FIREBASE_CREDENTIALS;

let db: admin.firestore.Firestore;

export const connectDB = async () => {
  try {
    if (!FIREBASE_CREDENTIALS) {
      throw new Error('FIREBASE_CREDENTIALS is not defined in environment variables');
    }

    // Parse the credentials from the environment variable
    const serviceAccount = JSON.parse(FIREBASE_CREDENTIALS);

    // Initialize Firebase if not already initialized
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
      });
    }

    db = admin.firestore();
    console.log('Firestore connected successfully');

    return db;
  } catch (error) {
    console.error('Firestore connection error:', error);
    process.exit(1);
  }
};

// Initialize db immediately
if (!admin.apps.length) {
  connectDB();
}

// Export the db instance
export const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};