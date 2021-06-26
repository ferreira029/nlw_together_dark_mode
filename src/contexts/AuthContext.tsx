import { ReactNode } from "react";
import { useCallback } from "react";
import { createContext, useEffect, useState } from "react";
import { auth, firebase } from '../services/firebase';

type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => void;
}

type AuthContextProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProps) {
  const [user, setUser] = useState<User>()

  const handleInfoUser = useCallback((user) => {
    if (user) {
      const { displayName, photoURL, uid } = user

      if (!displayName || !photoURL) {
        throw new Error('Missing information from Google Account');
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      })
    }
  }, [])

  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    const result  = await auth.signInWithPopup(provider)

    handleInfoUser(result.user)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => handleInfoUser(user))

    return () => unsubscribe()
  }, [handleInfoUser])

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  )
}