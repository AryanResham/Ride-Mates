import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profileCompletionRequired, setProfileCompletionRequired] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false); // Flag to prevent race condition
  const googleProvider = new GoogleAuthProvider();

  // Fetches our backend profile and merges it with the firebase user
  const getBackendProfile = async (fbUser) => {
    if (!fbUser) return null;
    const token = await fbUser.getIdToken();
    const response = await fetch("/api/user/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const backendUser = await response.json();
      setProfileCompletionRequired(false);
      return { ...fbUser, ...backendUser }; // Return merged user
    } else if (response.status === 404) {
      // New social user, needs to complete profile
      setProfileCompletionRequired(true);
      return fbUser; // Return partial user for now
    } else {
      throw new Error("Failed to fetch user profile from backend.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (isSigningUp) return; // Don't run listener during signup process
      try {
        const fullUser = await getBackendProfile(fbUser);
        setUser(fullUser);
      } catch (error) {
        console.error(error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, [isSigningUp]); // Re-run when signup state changes

  async function signup(formData) {
    setAuthLoading(true);
    setIsSigningUp(true); // Set the flag
    try {
      // 1. Create user in Firebase
      const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await updateProfile(cred.user, { displayName: formData.name });

      // 2. Get token and create user profile in our backend
      const token = await cred.user.getIdToken();
      const response = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          vehicle: formData.vehicle,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Backend registration failed.";
        try {
          const errData = await response.json();
          errorMessage = errData.message || errorMessage;
        } catch (e) {
          errorMessage = response.statusText;
        }
        throw new Error(errorMessage);
      }

      // 3. Set the full user state immediately with the returned profile
      const backendUser = await response.json();
      setUser({ ...cred.user, ...backendUser });
      setProfileCompletionRequired(false);
      setLoading(false); // Explicitly set loading to false on success

    } finally {
      setAuthLoading(false);
      setIsSigningUp(false); // Lower the flag
    }
  }

  async function login(email, password) {
    setAuthLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const fullUser = await getBackendProfile(cred.user);
      setUser(fullUser);
    } finally {
      setAuthLoading(false);
    }
  }

  async function loginWithGoogle() {
    setAuthLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      // The onAuthStateChanged listener will handle new vs existing Google users
    } finally {
      setAuthLoading(false);
    }
  }

  async function signout() {
    await fbSignOut(auth);
    setUser(null);
    setProfileCompletionRequired(false);
  }

  const value = {
    user, // This will be the merged user object
    loading,
    authLoading,
    profileCompletionRequired,
    signup,
    login,
    loginWithGoogle,
    signout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
