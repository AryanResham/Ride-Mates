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
import api from "../utils/api";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profileCompletionRequired, setProfileCompletionRequired] =
    useState(false);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false); // Flag to prevent race condition
  const googleProvider = new GoogleAuthProvider();

  // Fetches our backend profile and merges it with the firebase user
  const getBackendProfile = async (fbUser) => {
    if (!fbUser) return null;

    try {
      const token = await fbUser.getIdToken();
      const response = await api.get("/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const backendUser = response.data;
      setProfileCompletionRequired(false);
      return { ...fbUser, ...backendUser }; // Return merged user
    } catch (error) {
      if (error.response?.status === 404) {
        // New social user, needs to complete profile
        setProfileCompletionRequired(true);
        return fbUser; // Return partial user for now
      } else if (error.response?.status === 401) {
        // Token invalid/expired, try refreshing
        console.warn("Token expired, attempting refresh...");
        try {
          const freshToken = await fbUser.getIdToken(true); // Force refresh
          const retryResponse = await api.get("/api/user/me", {
            headers: { Authorization: `Bearer ${freshToken}` },
          });

          const backendUser = retryResponse.data;
          setProfileCompletionRequired(false);
          return { ...fbUser, ...backendUser };
        } catch (retryError) {
          throw new Error("Failed to fetch user profile after token refresh.");
        }
      } else {
        console.error("Error in getBackendProfile:", error);
        throw error;
      }
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
      const cred = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      await updateProfile(cred.user, { displayName: formData.name });

      // 2. Get token and create user profile in our backend
      const token = await cred.user.getIdToken();
      const response = await api.post(
        "/register",
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          vehicle: formData.vehicle,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 3. Set the full user state immediately with the returned profile
      const backendUser = response.data;
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

  // Function to get fresh ID token for API calls
  async function getIdToken(forceRefresh = false) {
    if (!auth.currentUser) {
      throw new Error("No authenticated user");
    }
    try {
      return await auth.currentUser.getIdToken(forceRefresh);
    } catch (error) {
      console.error("Failed to get ID token:", error);
      throw error;
    }
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
    getIdToken, // Export this for use in API calls
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
