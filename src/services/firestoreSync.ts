import {
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PropertyListing, RentalApplication, TourBooking, AffiliatePartnerLink } from '../types';

export const firestoreSync = {
  // Save or update a property in Firestore
  async saveProperty(property: PropertyListing): Promise<void> {
    try {
      const docRef = doc(db, 'properties', property.id);
      await setDoc(docRef, {
        ...property,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore: failed to save property', err);
    }
  },

  // Save multiple properties (initial seed or bulk import)
  async batchSeedProperties(properties: PropertyListing[]): Promise<void> {
    try {
      const existing = await getDocs(collection(db, 'properties'));
      if (existing.empty) {
        // Seed initial properties
        for (const prop of properties.slice(0, 15)) {
          await setDoc(doc(db, 'properties', prop.id), {
            ...prop,
            createdAt: new Date().toISOString(),
          });
        }
      }
    } catch (err) {
      console.warn('Firestore: failed to seed properties', err);
    }
  },

  // Real-time listener for properties
  subscribeProperties(onUpdate: (properties: PropertyListing[]) => void) {
    try {
      const q = query(collection(db, 'properties'));
      return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const list: PropertyListing[] = [];
          snapshot.forEach((d) => {
            list.push(d.data() as PropertyListing);
          });
          onUpdate(list);
        }
      }, (error) => {
        console.warn('Firestore property subscription notice:', error.message);
      });
    } catch (err) {
      console.warn('Firestore listener initialization notice:', err);
      return () => {};
    }
  },

  // Save rental application to Firestore
  async submitApplication(application: RentalApplication): Promise<void> {
    try {
      const docRef = doc(db, 'applications', application.id);
      await setDoc(docRef, {
        ...application,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Firestore: application submission notice:', err);
    }
  },

  // Schedule tour booking to Firestore
  async scheduleTour(tour: TourBooking): Promise<void> {
    try {
      const docRef = doc(db, 'tours', tour.id);
      await setDoc(docRef, {
        ...tour,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Firestore: tour booking notice:', err);
    }
  },

  // Track affiliate click in Firestore
  async trackAffiliateClick(affiliateId: string): Promise<void> {
    try {
      const docRef = doc(db, 'affiliate_clicks', `${affiliateId}_${Date.now()}`);
      await setDoc(docRef, {
        affiliateId,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Firestore: affiliate click tracking notice:', err);
    }
  },

  // Save screening document
  async saveScreeningDoc(docData: any): Promise<void> {
    try {
      const docRef = doc(db, 'screening_documents', docData.id);
      await setDoc(docRef, {
        ...docData,
        uploadedAt: docData.uploadedAt || new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore: screening document save notice:', err);
    }
  },

  // Save settings in Firestore
  async saveSettings(settingsData: any): Promise<void> {
    try {
      const docRef = doc(db, 'system', 'settings');
      await setDoc(docRef, settingsData, { merge: true });
    } catch (err) {
      console.warn('Firestore: settings save notice:', err);
    }
  },

  // Save user profile in Firestore
  async saveUserProfile(profileData: any): Promise<void> {
    try {
      if (!profileData?.id) return;
      const docRef = doc(db, 'users', profileData.id);
      await setDoc(docRef, {
        ...profileData,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore: user profile save notice:', err);
    }
  },
};
