import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../lib/firebase';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    leagueName: '',
    email: '',
    password: '',
    agreeTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.leagueName.trim() || !formData.email || !formData.password || !formData.name) {
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
      // Create auth user
      let uid = "local-mock-uid-" + Date.now();
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        uid = userCredential.user.uid;
      } catch (authErr: any) {
        // If the user hasn't set up their .env yet, Firebase uses the mock config and throws this
        if (authErr.code === 'auth/configuration-not-found' || authErr.code === 'auth/invalid-api-key') {
          console.warn("Firebase not configured. Using local mock auth.");
        } else {
          throw authErr; // Re-throw real errors (like email-already-in-use)
        }
      }
      
      // Provision tenant
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

  const handleGoogleSignIn = () => {
    // Optional Google sign in logic could go here
    alert("Google sign in would happen here");
  };

  return (
    <div className="min-h-screen bg-sofa-bg flex flex-col">
      {/* Navigation */}
      <nav className="bg-sofa-blue px-4 md:px-6 h-12 md:h-14 shadow-md w-full">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-center">
          <a href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-sm">
              <img src="/favicon.png" alt="StatArena Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-white font-black text-lg md:text-xl tracking-tighter uppercase">
                STATARENA <span className="font-light opacity-50">PRO</span>
              </span>
            </div>
          </a>
        </div>
      </nav>

      {/* Register Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-2xl border border-slate-100"
        >
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-100 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {success}
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-black text-slate-800 flex items-center">
                  Name <span className="text-pink-400 ml-0.5 text-lg leading-none">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AC5] focus:border-transparent text-slate-800 placeholder:text-slate-400 transition-shadow"
                  required
                />
              </div>

              {/* League Name */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-black text-slate-800 flex items-center">
                  League / Community Name <span className="text-pink-400 ml-0.5 text-lg leading-none">*</span>
                </label>
                <input
                  type="text"
                  name="leagueName"
                  value={formData.leagueName}
                  onChange={handleChange}
                  placeholder="League Name"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AC5] focus:border-transparent text-slate-800 placeholder:text-slate-400 transition-shadow"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-black text-slate-800 flex items-center">
                  Email <span className="text-pink-400 ml-0.5 text-lg leading-none">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AC5] focus:border-transparent text-slate-800 placeholder:text-slate-400 transition-shadow"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-black text-slate-800 flex items-center">
                  Password <span className="text-pink-400 ml-0.5 text-lg leading-none">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password (8+ characters)"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#685AC5] focus:border-transparent text-slate-800 placeholder:text-slate-400 transition-shadow"
                  minLength={8}
                  required
                />
              </div>
            </div>

            <hr className="border-slate-100 my-6" />

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="mt-1 w-4 h-4 rounded border-slate-300 text-[#685AC5] focus:ring-[#685AC5]"
              />
              <label htmlFor="agreeTerms" className="text-sm text-slate-700">
                I agree to the <a href="#" className="text-[#685AC5] hover:underline">Terms of Service</a> and <a href="#" className="text-[#685AC5] hover:underline">Privacy Policy</a>.
              </label>
            </div>

            <div className="flex flex-col items-center max-w-sm mx-auto space-y-6 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-sofa-blue text-white rounded-lg font-bold text-sm tracking-wide hover:bg-blue-700 transition-colors shadow-md shadow-sofa-blue/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center h-[52px]"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'CREATE YOUR ACCOUNT'
                )}
              </button>

              <div className="w-full flex items-center justify-center gap-4 relative">
                <div className="h-px bg-slate-200 w-full" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap bg-white px-2">OR SIGN UP WITH</span>
                <div className="h-px bg-slate-200 w-full" />
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold text-[15px] hover:bg-slate-50 transition-colors flex items-center justify-center gap-3 h-[52px]"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" className="w-5 h-5" />
                Google
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
