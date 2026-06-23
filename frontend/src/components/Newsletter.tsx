'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { apiUrl } from '../lib/siteConfig';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(apiUrl('/api/newsletter/subscribe'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || 'Could not subscribe.');
      }

      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Could not subscribe.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      className="py-4"
    >
      <div className="relative overflow-hidden rounded-2xl border border-stone-300 bg-stone-950 p-8 text-white backdrop-blur md:p-12 dark:border-stone-800 dark:bg-stone-100 dark:text-stone-950">
        <div className="relative z-10">
          {/* Header */}
          <motion.div
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl border border-white/15 bg-white/10 p-3 dark:border-stone-300 dark:bg-stone-200">
                <Mail className="text-amber-300 dark:text-amber-800" size={24} />
              </div>
              <h3 className="text-3xl font-black md:text-4xl">
                Get the daily income brief
              </h3>
            </div>
            <p className="mb-8 text-lg leading-relaxed text-stone-300 dark:text-stone-700">
              Three practical online income ideas every day: ethical strategies, realistic expectations, tools, FAQs, and action steps.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="flex gap-3 flex-col sm:flex-row max-w-md"
          >
            <div className="flex-1 relative">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-white/15 bg-white px-5 py-3 text-stone-950 transition-all placeholder:text-stone-500 focus:border-amber-300 focus:outline-none focus:ring-4 focus:ring-amber-300/20 dark:border-stone-300 dark:bg-white"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-amber-300 px-6 py-3 font-bold text-stone-950 transition-all duration-300 hover:bg-amber-200"
            >
              {submitted ? (
                <>
                  <CheckCircle2 size={18} />
                  Subscribed!
                </>
              ) : (
                <>
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </motion.form>

          {error && (
            <p className="mt-4 text-sm font-semibold text-red-300 dark:text-red-700">
              {error}
            </p>
          )}

          {/* Trust badge */}
          <motion.p
            className="mt-6 text-sm text-stone-400 dark:text-stone-600"
          >
            No hype. No get-rich-quick promises. Just practical online income research from e-CashEngine.
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
}
