import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';

export const firebaseAuthService = {
  // Listen to auth changes
  onAuthChange(callback: (user: UserProfile | null) => void) {
    return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (!fbUser) {
        callback(null);
        return;
      }
      try {
        const userDocRef = doc(db, 'users', fbUser.uid);
        const snapshot = await getDoc(userDocRef);
        if (snapshot.exists()) {
          const data = snapshot.data() as UserProfile;
          callback({
            ...data,
            id: fbUser.uid,
            email: fbUser.email || data.email,
            fullName: fbUser.displayName || data.fullName,
            emailVerified: fbUser.emailVerified,
          });
        } else {
          // Construct baseline profile if firestore doc doesn't exist yet
          const newProfile: UserProfile = {
            id: fbUser.uid,
            fullName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
            email: fbUser.email || '',
            phone: fbUser.phoneNumber || '',
            role: 'TENANT',
            membershipTier: 'FREE',
            isVerifiedMember: false,
            verificationStatus: 'NOT_SUBMITTED',
            welcomeCredits: 250,
            createdAt: new Date().toISOString(),
            emailVerified: fbUser.emailVerified,
          };
          await setDoc(userDocRef, newProfile, { merge: true });
          callback(newProfile);
        }
      } catch (err) {
        console.warn('Firebase Auth State listener fallback:', err);
        callback({
          id: fbUser.uid,
          fullName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          email: fbUser.email || '',
          phone: fbUser.phoneNumber || '',
          role: 'TENANT',
          membershipTier: 'FREE',
          isVerifiedMember: false,
          verificationStatus: 'NOT_SUBMITTED',
          welcomeCredits: 250,
          createdAt: new Date().toISOString(),
          emailVerified: fbUser.emailVerified,
        });
      }
    });
  },

  // Signup with Email & Password
  async signUp(
    fullName: string,
    email: string,
    password: string,
    phone: string,
    role: UserRole
  ): Promise<UserProfile> {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const fbUser = userCredential.user;

    // Update display name
    try {
      await updateProfile(fbUser, { displayName: fullName });
    } catch (e) {
      console.warn('Failed to update display name:', e);
    }

    // Trigger email verification
    try {
      await sendEmailVerification(fbUser);
    } catch (e) {
      console.warn('Email verification send notice:', e);
    }

    const profile: UserProfile = {
      id: fbUser.uid,
      fullName,
      email: fbUser.email || email,
      phone,
      role: role === 'RENTER' ? 'TENANT' : role,
      membershipTier: 'FREE',
      isVerifiedMember: false,
      verificationStatus: 'NOT_SUBMITTED',
      welcomeCredits: 250,
      createdAt: new Date().toISOString(),
      emailVerified: fbUser.emailVerified,
    };

    // Store in Firestore
    try {
      await setDoc(doc(db, 'users', fbUser.uid), profile, { merge: true });
    } catch (e) {
      console.warn('Firestore user doc create notice:', e);
    }

    return profile;
  },

  // Login with Email & Password
  async signIn(email: string, password: string): Promise<UserProfile> {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const fbUser = userCredential.user;

    try {
      const userDocRef = doc(db, 'users', fbUser.uid);
      const snapshot = await getDoc(userDocRef);
      if (snapshot.exists()) {
        const data = snapshot.data() as UserProfile;
        return {
          ...data,
          id: fbUser.uid,
          email: fbUser.email || data.email,
          fullName: fbUser.displayName || data.fullName,
          emailVerified: fbUser.emailVerified,
        };
      }
    } catch (e) {
      console.warn('Could not read user profile from firestore:', e);
    }

    const fallbackProfile: UserProfile = {
      id: fbUser.uid,
      fullName: fbUser.displayName || email.split('@')[0],
      email: fbUser.email || email,
      phone: '',
      role: 'TENANT',
      membershipTier: 'FREE',
      isVerifiedMember: false,
      verificationStatus: 'NOT_SUBMITTED',
      welcomeCredits: 250,
      createdAt: new Date().toISOString(),
      emailVerified: fbUser.emailVerified,
    };

    try {
      await setDoc(doc(db, 'users', fbUser.uid), fallbackProfile, { merge: true });
    } catch {}

    return fallbackProfile;
  },

  // Send Password Reset
  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email.trim());
  },

  // Resend Email Verification
  async resendVerificationEmail(): Promise<void> {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    } else {
      throw new Error('No user is currently signed in.');
    }
  },

  // Logout
  async logOut(): Promise<void> {
    await signOut(auth);
  },

  // Sync profile update
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, { ...updates, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (err) {
      console.warn('Failed to update firestore user profile:', err);
    }
  },
};
