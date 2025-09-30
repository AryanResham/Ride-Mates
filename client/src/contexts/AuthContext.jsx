// client/src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  getIdToken,
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser ? fbUser : null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function signup(email, password, displayName) {
    setAuthLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(cred.user, { displayName });
        // refresh local user object
        setUser({ ...cred.user, displayName });
      } else {
        setUser(cred.user);
      }
      setAuthLoading(false);
      return { user: cred.user };
    } catch (err) {
      setAuthLoading(false);
      throw err;
    }
  }

  async function login(email, password) {
    setAuthLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      setUser(cred.user);
      setAuthLoading(false);
      return { user: cred.user };
    } catch (err) {
      setAuthLoading(false);
      throw err;
    }
  }

  async function loginWithGoogle() {
    setAuthLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      setUser(cred.user);
      setAuthLoading(false);
      return { user: cred.user };
    } catch (err) {
      setAuthLoading(false);
      throw err;
    }
  }

  async function signout() {
    setAuthLoading(true);
    try {
      await fbSignOut(auth);
      setUser(null);
      setAuthLoading(false);
    } catch (err) {
      setAuthLoading(false);
      throw err;
    }
  }

  async function getIdTokenForBackend(forceRefresh = false) {
    if (!auth.currentUser) return null;
    return await getIdToken(auth.currentUser, forceRefresh);
  }

  const value = {
    user,
    loading,
    authLoading,
    signup,
    login,
    loginWithGoogle,
    signout,
    getIdTokenForBackend,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
