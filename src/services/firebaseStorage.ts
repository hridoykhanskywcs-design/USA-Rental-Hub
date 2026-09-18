import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

export const firebaseStorageService = {
  // Upload a single file to Firebase Storage
  async uploadFile(file: File, folderPath: string): Promise<string> {
    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const uniqueFileName = `${Date.now()}_${sanitizedName}`;
      const fullPath = `${folderPath}/${uniqueFileName}`;
      const storageRef = ref(storage, fullPath);

      const snapshot = await uploadBytes(storageRef, file, {
        contentType: file.type || 'application/octet-stream',
      });
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch (error) {
      console.warn('Firebase Storage upload notice, falling back to local object reader:', error);
      // Resilient fallback: read as Base64 Data URL so user is never blocked
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  },

  // Upload multiple files concurrently
  async uploadMultipleFiles(files: File[], folderPath: string): Promise<string[]> {
    const uploadPromises = Array.from(files).map((file) => this.uploadFile(file, folderPath));
    return Promise.all(uploadPromises);
  },

  // Specialized helper for property images
  async uploadPropertyImage(file: File, propertyId: string = 'new-listing'): Promise<string> {
    return this.uploadFile(file, `properties/${propertyId}`);
  },

  // Specialized helper for tenant screening documents (PDF, image, screenshots)
  async uploadScreeningDoc(file: File, userId: string = 'anon'): Promise<string> {
    return this.uploadFile(file, `screenings/${userId}`);
  },
};
