import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { User, GreenBean, RoastingProfile, RoastingSession, Sale, Notification } from '../types';
import { useFirestoreData } from '../hooks/useFirestore';
import {
  usersService,
  greenBeansService,
  roastingProfilesService,
  roastingSessionsService,
  salesService,
  notificationsService,
  batchOperations
} from '../services/firestore';

interface AppState {
  user: User | null;
  users: User[];
  greenBeans: GreenBean[];
  roastingProfiles: RoastingProfile[];
  roastingSessions: RoastingSession[];
  sales: Sale[];
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

type AppAction = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_DATA'; payload: Partial<AppState> }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'ADD_GREEN_BEAN'; payload: GreenBean }
  | { type: 'UPDATE_GREEN_BEAN'; payload: GreenBean }
  | { type: 'DELETE_GREEN_BEAN'; payload: string }
  | { type: 'ADD_ROASTING_PROFILE'; payload: RoastingProfile }
  | { type: 'UPDATE_ROASTING_PROFILE'; payload: RoastingProfile }
  | { type: 'DELETE_ROASTING_PROFILE'; payload: string }
  | { type: 'ADD_ROASTING_SESSION'; payload: RoastingSession }
  | { type: 'ADD_SALE'; payload: Sale }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string };

const initialState: AppState = {
  user: null,
  users: [],
  greenBeans: [],
  roastingProfiles: [],
  roastingSessions: [],
  sales: [],
  notifications: [],
  loading: true,
  error: null
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_DATA':
      return { ...state, ...action.payload };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        )
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload)
      };
    case 'ADD_GREEN_BEAN':
      return { ...state, greenBeans: [...state.greenBeans, action.payload] };
    case 'UPDATE_GREEN_BEAN':
      return {
        ...state,
        greenBeans: state.greenBeans.map(bean =>
          bean.id === action.payload.id ? action.payload : bean
        )
      };
    case 'DELETE_GREEN_BEAN':
      return {
        ...state,
        greenBeans: state.greenBeans.filter(bean => bean.id !== action.payload)
      };
    case 'ADD_ROASTING_PROFILE':
      return { ...state, roastingProfiles: [...state.roastingProfiles, action.payload] };
    case 'UPDATE_ROASTING_PROFILE':
      return {
        ...state,
        roastingProfiles: state.roastingProfiles.map(profile =>
          profile.id === action.payload.id ? action.payload : profile
        )
      };
    case 'DELETE_ROASTING_PROFILE':
      return {
        ...state,
        roastingProfiles: state.roastingProfiles.filter(profile => profile.id !== action.payload)
      };
    case 'ADD_ROASTING_SESSION':
      return { ...state, roastingSessions: [...state.roastingSessions, action.payload] };
    case 'ADD_SALE':
      return { ...state, sales: [...state.sales, action.payload] };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload ? { ...notif, read: true } : notif
        )
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  services: {
    users: typeof usersService;
    greenBeans: typeof greenBeansService;
    roastingProfiles: typeof roastingProfilesService;
    roastingSessions: typeof roastingSessionsService;
    sales: typeof salesService;
    notifications: typeof notificationsService;
  };
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const firestoreData = useFirestoreData();

  // Update state when Firestore data changes
  useEffect(() => {
    dispatch({
      type: 'SET_DATA',
      payload: {
        users: firestoreData.users,
        greenBeans: firestoreData.greenBeans,
        roastingProfiles: firestoreData.roastingProfiles,
        roastingSessions: firestoreData.roastingSessions,
        sales: firestoreData.sales,
        notifications: firestoreData.notifications,
        loading: firestoreData.loading,
        error: firestoreData.error
      }
    });
  }, [firestoreData]);

  // Initialize default data if collections are empty
  useEffect(() => {
    const initializeData = async () => {
      if (!firestoreData.loading && firestoreData.users.length === 0) {
        try {
          await batchOperations.initializeDefaultData();
        } catch (error) {
          console.error('Error initializing default data:', error);
        }
      }
    };

    initializeData();
  }, [firestoreData.loading, firestoreData.users.length]);

  const services = {
    users: usersService,
    greenBeans: greenBeansService,
    roastingProfiles: roastingProfilesService,
    roastingSessions: roastingSessionsService,
    sales: salesService,
    notifications: notificationsService
  };

  return (
    <AppContext.Provider value={{ state, dispatch, services }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}