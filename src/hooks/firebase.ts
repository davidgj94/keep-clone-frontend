import { useEffect } from 'react';

import '../firebase';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  UserInfo,
} from 'firebase/auth';

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export const useFirebaseAuth = (onUserLoggedIn: (user: UserInfo) => void) => {
  const auth = getAuth();
  const signOut = () => auth.signOut();
  const signIn = () => signInWithRedirect(auth, provider);
  useEffect(
    () =>
      auth.onAuthStateChanged((user) => {
        if (!user) return signIn();
        onUserLoggedIn(user.toJSON() as UserInfo);
      }),
    []
  );
  return [signIn, signOut];
};
