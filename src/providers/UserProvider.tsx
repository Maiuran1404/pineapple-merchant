import {
  GoogleAuthProvider,
  UserInfo,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "~/../firebase";

interface UserContextType {
  user: UserInfo | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);

      // Redirect to register page if not authenticated
      if (!user) {
        router
          .replace("/signin")
          .catch(() => window.alert("Failed to redirect to signing page"));
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    // Sign in using a popup.
    const provider = new GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");
    const result = await signInWithPopup(auth, provider);

    // The signed-in user info.
    const user = result.user;
    setUser(user);
  };

  const userSignOut = async () => {
    await signOut(auth);
  };

  return (
    <UserContext.Provider value={{ user, signIn, signOut: userSignOut }}>
      {children}
    </UserContext.Provider>
  );
}
