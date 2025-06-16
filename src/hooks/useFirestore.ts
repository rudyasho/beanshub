import { useState, useEffect } from 'react';
import {
  usersService,
  greenBeansService,
  roastingProfilesService,
  roastingSessionsService,
  salesService,
  notificationsService
} from '../services/firestore';
import { User, GreenBean, RoastingProfile, RoastingSession, Sale, Notification } from '../types';

export function useFirestoreData() {
  const [users, setUsers] = useState<User[]>([]);
  const [greenBeans, setGreenBeans] = useState<GreenBean[]>([]);
  const [roastingProfiles, setRoastingProfiles] = useState<RoastingProfile[]>([]);
  const [roastingSessions, setRoastingSessions] = useState<RoastingSession[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribes: (() => void)[] = [];

    try {
      // Set up real-time listeners
      const unsubUsers = usersService.onSnapshot(setUsers);
      const unsubGreenBeans = greenBeansService.onSnapshot(setGreenBeans);
      const unsubProfiles = roastingProfilesService.onSnapshot(setRoastingProfiles);
      const unsubSessions = roastingSessionsService.onSnapshot(setRoastingSessions);
      const unsubSales = salesService.onSnapshot(setSales);
      const unsubNotifications = notificationsService.onSnapshot(setNotifications);

      unsubscribes.push(
        unsubUsers,
        unsubGreenBeans,
        unsubProfiles,
        unsubSessions,
        unsubSales,
        unsubNotifications
      );

      setLoading(false);
    } catch (err) {
      console.error('Error setting up Firestore listeners:', err);
      setError('Failed to connect to database');
      setLoading(false);
    }

    // Cleanup function
    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  return {
    users,
    greenBeans,
    roastingProfiles,
    roastingSessions,
    sales,
    notifications,
    loading,
    error
  };
}

// Individual hooks for specific collections
function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = usersService.onSnapshot((data) => {
      setUsers(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { users, loading };
}

function useGreenBeans() {
  const [greenBeans, setGreenBeans] = useState<GreenBean[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = greenBeansService.onSnapshot((data) => {
      setGreenBeans(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { greenBeans, loading };
}

function useRoastingProfiles() {
  const [roastingProfiles, setRoastingProfiles] = useState<RoastingProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = roastingProfilesService.onSnapshot((data) => {
      setRoastingProfiles(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { roastingProfiles, loading };
}

function useRoastingSessions() {
  const [roastingSessions, setRoastingSessions] = useState<RoastingSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = roastingSessionsService.onSnapshot((data) => {
      setRoastingSessions(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { roastingSessions, loading };
}

function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = salesService.onSnapshot((data) => {
      setSales(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { sales, loading };
}

function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = notificationsService.onSnapshot((data) => {
      setNotifications(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { notifications, loading };
}