import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { User, GreenBean, RoastingProfile, RoastingSession, Sale, Notification } from '../types';

// Helper function to convert Firestore timestamps to Date objects
const convertTimestamps = (data: any) => {
  const converted = { ...data };
  Object.keys(converted).forEach(key => {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate();
    }
  });
  return converted;
};

// Helper function to convert Date objects to Firestore timestamps
const convertDatesToTimestamps = (data: any) => {
  const converted = { ...data };
  Object.keys(converted).forEach(key => {
    if (converted[key] instanceof Date) {
      converted[key] = Timestamp.fromDate(converted[key]);
    }
  });
  return converted;
};

// Users
export const usersService = {
  async getAll(): Promise<User[]> {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as User[];
  },

  async getById(id: string): Promise<User | null> {
    const docRef = doc(db, 'users', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...convertTimestamps(docSnap.data())
      } as User;
    }
    return null;
  },

  async create(user: Omit<User, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'users'), convertDatesToTimestamps(user));
    return docRef.id;
  },

  async update(id: string, user: Partial<User>): Promise<void> {
    const docRef = doc(db, 'users', id);
    await updateDoc(docRef, convertDatesToTimestamps(user));
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'users', id));
  },

  onSnapshot(callback: (users: User[]) => void) {
    return onSnapshot(collection(db, 'users'), (snapshot) => {
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      })) as User[];
      callback(users);
    });
  }
};

// Green Beans
export const greenBeansService = {
  async getAll(): Promise<GreenBean[]> {
    const querySnapshot = await getDocs(collection(db, 'greenBeans'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as GreenBean[];
  },

  async create(bean: Omit<GreenBean, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'greenBeans'), convertDatesToTimestamps(bean));
    return docRef.id;
  },

  async update(id: string, bean: Partial<GreenBean>): Promise<void> {
    const docRef = doc(db, 'greenBeans', id);
    await updateDoc(docRef, convertDatesToTimestamps(bean));
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'greenBeans', id));
  },

  onSnapshot(callback: (beans: GreenBean[]) => void) {
    return onSnapshot(collection(db, 'greenBeans'), (snapshot) => {
      const beans = snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      })) as GreenBean[];
      callback(beans);
    });
  }
};

// Roasting Profiles
export const roastingProfilesService = {
  async getAll(): Promise<RoastingProfile[]> {
    const querySnapshot = await getDocs(collection(db, 'roastingProfiles'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as RoastingProfile[];
  },

  async create(profile: Omit<RoastingProfile, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'roastingProfiles'), convertDatesToTimestamps(profile));
    return docRef.id;
  },

  async update(id: string, profile: Partial<RoastingProfile>): Promise<void> {
    const docRef = doc(db, 'roastingProfiles', id);
    await updateDoc(docRef, convertDatesToTimestamps(profile));
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'roastingProfiles', id));
  },

  onSnapshot(callback: (profiles: RoastingProfile[]) => void) {
    return onSnapshot(collection(db, 'roastingProfiles'), (snapshot) => {
      const profiles = snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      })) as RoastingProfile[];
      callback(profiles);
    });
  }
};

// Roasting Sessions
export const roastingSessionsService = {
  async getAll(): Promise<RoastingSession[]> {
    const q = query(collection(db, 'roastingSessions'), orderBy('roastDate', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as RoastingSession[];
  },

  async create(session: Omit<RoastingSession, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'roastingSessions'), convertDatesToTimestamps(session));
    return docRef.id;
  },

  async update(id: string, session: Partial<RoastingSession>): Promise<void> {
    const docRef = doc(db, 'roastingSessions', id);
    await updateDoc(docRef, convertDatesToTimestamps(session));
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'roastingSessions', id));
  },

  onSnapshot(callback: (sessions: RoastingSession[]) => void) {
    const q = query(collection(db, 'roastingSessions'), orderBy('roastDate', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const sessions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      })) as RoastingSession[];
      callback(sessions);
    });
  }
};

// Sales
export const salesService = {
  async getAll(): Promise<Sale[]> {
    const q = query(collection(db, 'sales'), orderBy('saleDate', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as Sale[];
  },

  async create(sale: Omit<Sale, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'sales'), convertDatesToTimestamps(sale));
    return docRef.id;
  },

  async update(id: string, sale: Partial<Sale>): Promise<void> {
    const docRef = doc(db, 'sales', id);
    await updateDoc(docRef, convertDatesToTimestamps(sale));
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'sales', id));
  },

  onSnapshot(callback: (sales: Sale[]) => void) {
    const q = query(collection(db, 'sales'), orderBy('saleDate', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const sales = snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      })) as Sale[];
      callback(sales);
    });
  }
};

// Notifications
export const notificationsService = {
  async getAll(): Promise<Notification[]> {
    const q = query(collection(db, 'notifications'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as Notification[];
  },

  async create(notification: Omit<Notification, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'notifications'), convertDatesToTimestamps(notification));
    return docRef.id;
  },

  async update(id: string, notification: Partial<Notification>): Promise<void> {
    const docRef = doc(db, 'notifications', id);
    await updateDoc(docRef, convertDatesToTimestamps(notification));
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'notifications', id));
  },

  onSnapshot(callback: (notifications: Notification[]) => void) {
    const q = query(collection(db, 'notifications'), orderBy('timestamp', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      })) as Notification[];
      callback(notifications);
    });
  }
};

// Batch operations
export const batchOperations = {
  async initializeDefaultData() {
    const batch = writeBatch(db);

    // Default users
    const defaultUsers = [
      {
        email: 'admin@beanshub.com',
        name: 'Admin BeansHub',
        role: 'Admin',
        phone: '+62 812 4100 3047',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        lastLogin: new Date()
      },
      {
        email: 'roaster@beanshub.com',
        name: 'Master Roaster',
        role: 'Roaster',
        phone: '+62 821 5555 1234',
        isActive: true,
        createdAt: new Date('2024-01-05'),
        lastLogin: new Date('2024-01-28')
      },
      {
        email: 'staff@beanshub.com',
        name: 'Staff Penjualan',
        role: 'Staff',
        phone: '+62 856 7777 9999',
        isActive: true,
        createdAt: new Date('2024-01-10'),
        lastLogin: new Date('2024-01-27')
      }
    ];

    defaultUsers.forEach((user, index) => {
      const userRef = doc(collection(db, 'users'));
      batch.set(userRef, convertDatesToTimestamps(user));
    });

    // Default green beans
    const defaultGreenBeans = [
      {
        supplierName: 'Koperasi Kopi Gayo',
        variety: 'Arabica Gayo',
        origin: 'Aceh, Indonesia',
        quantity: 500,
        purchasePricePerKg: 85000,
        entryDate: new Date('2024-01-15'),
        batchNumber: 'GB-2024-001',
        lowStockThreshold: 50
      },
      {
        supplierName: 'Petani Toraja',
        variety: 'Toraja Kalosi',
        origin: 'Sulawesi, Indonesia',
        quantity: 200,
        purchasePricePerKg: 95000,
        entryDate: new Date('2024-01-20'),
        batchNumber: 'GB-2024-002',
        lowStockThreshold: 30
      },
      {
        supplierName: 'Koperasi Mandailing',
        variety: 'Mandailing',
        origin: 'Sumatera Utara, Indonesia',
        quantity: 25,
        purchasePricePerKg: 90000,
        entryDate: new Date('2024-01-25'),
        batchNumber: 'GB-2024-003',
        lowStockThreshold: 50
      }
    ];

    defaultGreenBeans.forEach((bean) => {
      const beanRef = doc(collection(db, 'greenBeans'));
      batch.set(beanRef, convertDatesToTimestamps(bean));
    });

    await batch.commit();
  }
};