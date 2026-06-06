import { useState, useEffect } from 'react';
import { useTenant } from '@/context/TenantContext';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';

export const useAuth = () => {
  const { tenant } = useTenant();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return {
    user,
    loading,
    isAdmin: !!user && (!tenant || tenant.ownerUid === user.uid),
    logout
  };
};
