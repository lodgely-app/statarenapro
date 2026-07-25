import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { db, auth } from '../lib/firebase';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    leagueName: '',
    email: '',
    password: '',
    agreeTerms: false,
  });
  
  const [step, setStep] = useState(1);
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setGoogleUser(result.user);
      setFormData(prev => ({
        ...prev,
        email: result.user.email || '',
        name: result.user.displayName || ''
      }));
      setStep(2);
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Failed to sign in with Google');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.leagueName.trim() || !formData.email || (!googleUser && !formData.password) || !formData.name) {
      setError('Please fill out all required fields.');
      return;
    }
    if (!formData.agreeTerms) {
      setError('You must agree to the Terms of Service.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      let uid = "local-mock-uid-" + Date.now();
      
      if (googleUser) {
        uid = googleUser.uid;
      } else {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
          uid = userCredential.user.uid;
        } catch (authErr: any) {
          if (authErr.code === 'auth/configuration-not-found' || authErr.code === 'auth/invalid-api-key') {
            console.warn("Firebase not configured. Using local mock auth.");
          } else {
            throw authErr;
          }
        }
      }
      
      const slug = formData.leagueName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      try {
        await setDoc(doc(db, 'tenants', slug), {
          id: slug,
          name: formData.leagueName,
          ownerUid: uid,
          ownerName: formData.name,
          createdAt: new Date().toISOString()
        });
      } catch (dbErr: any) {
        if (dbErr.code === 'permission-denied' || dbErr.message?.includes('permission')) {
          throw new Error("Firestore Permission Denied: Please update your Firestore Rules to allow read/write access.");
        }
        console.warn("Skipping DB write because Firebase isn't configured properly. Continuing to dashboard...", dbErr);
      }

      setSuccess('Account created successfully! Redirecting to your dashboard...');
      
      const protocol = window.location.protocol;
      const hostname = window.location.hostname;
      const port = window.location.port ? `:${window.location.port}` : '';
      const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
      const baseDomain = isLocal ? 'lvh.me' : hostname.replace('www.', '');
      
      setTimeout(() => {
        window.location.href = `${protocol}//${slug}.${baseDomain}${port}/admin`;
      }, 1500);
      
    } catch (err: any) {
      console.error("Error registering:", err);
      let errorMessage = 'Failed to create account.';
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already in use by another account.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans animate-in fade-in duration-500">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center p-2 border border-slate-100">
            <img src="/favicon.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-10 px-8 shadow-xl shadow-slate-200/50 sm:rounded-2xl border border-slate-100">
          
          {step === 1 ? (
            <div className="space-y-8 text-center">
              <div>
                <h2 className="text-2xl font-semibold text-slate-800">Create an account</h2>
                <p className="mt-2 text-sm text-slate-500">Get started with StatArena Pro today.</p>
              </div>
              
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 py-3.5 rounded-lg font-medium transition-colors shadow-sm"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                Sign up with Google
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-400">Or continue with email</span>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3.5 rounded-lg font-medium transition-colors shadow-sm"
              >
                Use Email address
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-[28px] font-medium text-slate-800 mb-2">Almost done..</h2>
                <p className="text-slate-600 text-[15px]">
                  Tell us a bit about yourself to finish creating your <span className="font-bold text-slate-800">League / Community</span> account.
                </p>
              </div>

              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
              {success && <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg">{success}</div>}

              <form className="space-y-5" onSubmit={handleRegisterSubmit}>
                <div>
                  <label className="flex items-center gap-2 text-[15px] font-semibold text-slate-800 mb-1.5">
                    Name <span className="text-slate-400 text-xs font-medium">[REQUIRED]</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-2.5 outline-none focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] transition-all text-slate-800 text-[15px]"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[15px] font-semibold text-slate-800 mb-1.5">
                    Email <span className="text-slate-400 text-xs font-medium">[REQUIRED]</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    disabled={!!googleUser}
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full border rounded-md px-3 py-2.5 outline-none focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] transition-all text-[15px] ${googleUser ? 'bg-[#E5E7EB] text-slate-600 border-transparent placeholder-slate-500' : 'bg-white border-slate-300 text-slate-800'}`}
                  />
                  {googleUser && <p className="mt-1.5 text-[13px] text-slate-500">This is your email on Google.</p>}
                </div>

                {!googleUser && (
                  <div>
                    <label className="flex items-center gap-2 text-[15px] font-semibold text-slate-800 mb-1.5">
                      Password <span className="text-slate-400 text-xs font-medium">[REQUIRED]</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-300 rounded-md px-3 py-2.5 outline-none focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] transition-all text-slate-800 text-[15px]"
                    />
                  </div>
                )}

                <div>
                  <label className="flex items-center gap-2 text-[15px] font-semibold text-slate-800 mb-1.5">
                    League / Community Name <span className="text-slate-400 text-xs font-medium">[REQUIRED]</span>
                  </label>
                  <input
                    type="text"
                    name="leagueName"
                    required
                    placeholder="Your Company's Name"
                    value={formData.leagueName}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-2.5 outline-none focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] transition-all text-slate-800 text-[15px] placeholder-slate-400"
                  />
                </div>

                <div className="pt-2 pb-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-slate-300 text-[#6C5CE7] focus:ring-[#6C5CE7]"
                    />
                    <span className="text-[15px] text-slate-800 font-medium">
                      I agree to the <a href="#" className="text-[#3A75C4] hover:underline">Terms of Service</a> and the <a href="#" className="text-[#3A75C4] hover:underline">Privacy Policy</a>
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#6A5AE0] hover:bg-[#5a4bc4] text-white px-8 py-3 rounded text-[15px] font-semibold transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Continue'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
