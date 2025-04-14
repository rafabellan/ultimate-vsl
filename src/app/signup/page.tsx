'use client';

import SignupForm from '@/components/SignupForm';
import { Suspense } from 'react';

export default function SignupPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <Suspense fallback={<div>Carregando...</div>}>
        <SignupForm />
      </Suspense>
    </div>
  );
} 