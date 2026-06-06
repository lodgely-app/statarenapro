import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Tenant } from '../types/tournament';

interface TenantContextType {
  tenantId: string | null;
  tenant: Tenant | null;
  isLoading: boolean;
  error: string | null;
  isGlobal: boolean; // true if accessing statarenapro.com directly
}

const TenantContext = createContext<TenantContextType>({
  tenantId: null,
  tenant: null,
  isLoading: true,
  error: null,
  isGlobal: true,
});

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGlobal, setIsGlobal] = useState(true);

  useEffect(() => {
    const extractSubdomain = () => {
      const hostname = window.location.hostname;
      // Handle localhost and lvh.me for local dev
      if (hostname === 'localhost' || hostname === 'lvh.me' || hostname === 'www.statarenapro.com' || hostname === 'statarenapro.com') {
        setIsGlobal(true);
        setIsLoading(false);
        return null;
      }

      // Extract subdomain (e.g., tenant.lvh.me or tenant.statarenapro.com)
      const parts = hostname.split('.');
      if (parts.length >= 3) {
        // Assume the first part is the subdomain
        return parts[0];
      }
      
      // Fallback
      setIsGlobal(true);
      return null;
    };

    const fetchTenantData = async (id: string) => {
      try {
        const q = query(collection(db, 'tenants'), where('id', '==', id));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          setTenant(querySnapshot.docs[0].data() as Tenant);
        } else {
          setError('Tenant not found');
        }
      } catch (err) {
        console.error('Error fetching tenant:', err);
        setError('Failed to load tenant configuration');
      } finally {
        setIsLoading(false);
      }
    };

    const sub = extractSubdomain();
    if (sub && sub !== 'www') {
      setIsGlobal(false);
      setTenantId(sub);
      fetchTenantData(sub);
    } else {
      setIsGlobal(true);
      setIsLoading(false);
    }
  }, []);

  return (
    <TenantContext.Provider value={{ tenantId, tenant, isLoading, error, isGlobal }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);
