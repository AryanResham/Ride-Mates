import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api, { getStoredToken, setStoredToken } from "../utils/api";

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // initial session restore
  const [authLoading, setAuthLoading] = useState(false); // login / signup in flight
  const [sessionKey, setSessionKey] = useState(0); // bumps on login/switch/reset so views remount

  const applySession = useCallback(({ token, user: profile }) => {
    setStoredToken(token);
    setUser(profile);
    setSessionKey((k) => k + 1);
    return profile;
  }, []);

  // Restore the session from a stored token on first load.
  useEffect(() => {
    let cancelled = false;
    const restore = async () => {
      const token = getStoredToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/api/user/me");
        if (!cancelled) setUser(data);
      } catch {
        setStoredToken(null);
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    restore();
    return () => {
      cancelled = true;
    };
  }, []);

  const signup = useCallback(
    async (formData) => {
      setAuthLoading(true);
      try {
        const { data } = await api.post("/register", {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          vehicle: formData.vehicle,
        });
        return applySession(data);
      } finally {
        setAuthLoading(false);
      }
    },
    [applySession]
  );

  const login = useCallback(
    async (email, password) => {
      setAuthLoading(true);
      try {
        const { data } = await api.post("/auth", { email, password });
        return applySession(data);
      } finally {
        setAuthLoading(false);
      }
    },
    [applySession]
  );

  // Demo mode: sign in as one of the seeded profiles with no password.
  const loginAsDemo = useCallback(
    async (profileId) => {
      setAuthLoading(true);
      try {
        const { data } = await api.post("/api/demo/login", { id: profileId });
        return applySession(data);
      } finally {
        setAuthLoading(false);
      }
    },
    [applySession]
  );

  // Demo mode: wipe and reseed everything, then stay signed in as the same profile.
  const resetDemo = useCallback(async () => {
    setAuthLoading(true);
    try {
      const { data } = await api.post("/api/demo/reset");
      if (data.token && data.user) applySession(data);
      return data;
    } finally {
      setAuthLoading(false);
    }
  }, [applySession]);

  const signout = useCallback(async () => {
    setStoredToken(null);
    setUser(null);
  }, []);

  // Re-fetch the profile (after editing it, rating someone, etc.)
  const refreshUser = useCallback(async () => {
    const { data } = await api.get("/api/user/me");
    setUser(data);
    return data;
  }, []);

  // Kept for components that still pass the token explicitly.
  const getIdToken = useCallback(async () => {
    const token = getStoredToken();
    if (!token) throw new Error("No authenticated user");
    return token;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      authLoading,
      isDemo: Boolean(user?.isDemo),
      sessionKey,
      signup,
      login,
      loginAsDemo,
      resetDemo,
      signout,
      refreshUser,
      getIdToken,
    }),
    [user, loading, authLoading, sessionKey, signup, login, loginAsDemo, resetDemo, signout, refreshUser, getIdToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
