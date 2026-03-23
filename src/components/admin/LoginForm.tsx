"use client";

import { useActionState, useEffect } from "react";
import { loginOrRegister } from "@/app/admin/actions";
import { Lock } from "lucide-react";

export default function LoginForm({ isFirstSetup }: { isFirstSetup: boolean }) {
  const [state, formAction, pending] = useActionState(loginOrRegister, null);

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg border border-primary-light">
      <div className="flex justify-center mb-6">
        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-primary-dark">
          <Lock className="w-6 h-6" />
        </div>
      </div>
      <h2 className="text-2xl font-heading text-center text-primary-dark mb-2">
        {isFirstSetup ? "Setup Admin Account" : "Admin Login"}
      </h2>
      <p className="text-center text-foreground/70 mb-8 text-sm">
        {isFirstSetup ? "Create your credentials to manage the wedding app." : "Welcome back. Please login."}
      </p>

      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Email</label>
          <input 
            type="email" 
            name="email" 
            required 
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Password</label>
          <input 
            type="password" 
            name="password" 
            required 
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
          />
        </div>
        {state?.error && (
          <p className="text-red-500 text-sm mt-2">{state.error}</p>
        )}
        <button 
          disabled={pending}
          className="w-full bg-primary text-white font-medium rounded-xl px-4 py-3 mt-4 hover:bg-primary-dark transition disabled:opacity-50"
        >
          {pending ? "Please wait..." : "Continue"}
        </button>
      </form>
    </div>
  );
}
