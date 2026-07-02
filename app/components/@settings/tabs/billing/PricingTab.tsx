"use client"

import React, { useState, useEffect } from "react"
import { Check, X, CreditCard, DollarSign } from "lucide-react"

const PRO_PRICE = 20;

const features = {
  free: [
    { text: "Public and private projects", included: true },
    { text: "Website deployment to Netlify", included: true },
    { text: "Short Screen Recordings (up to 20 mins)", included: true },
    { text: "Standard AI models", included: true },
    { text: "$1.50 initial AI credit balance", included: true },
    { text: "Custom Supabase Databases", included: false },
    { text: "Website deployment to Vercel", included: false },
    { text: "Long Screen Recordings (up to 3 hours)", included: false },
    { text: "Premium AI models (GPT-4o Vision)", included: false },
  ],
  pro: [
    { text: "Public and private projects", included: true },
    { text: "Website deployment to Netlify & Vercel", included: true },
    { text: "Short & Long Screen Recordings (up to 3 hours)", included: true },
    { text: "Standard & Premium AI models", included: true },
    { text: "Custom Supabase Databases", included: true },
    { text: `$${PRO_PRICE}.00 AI credit balance included`, included: true },
    { text: "Priority Support (Coming soon)", included: true },
  ]
};

export default function PricingTab() {
  const [subscriptionTier, setSubscriptionTier] = useState("free")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAmount, setSelectedAmount] = useState(10)

  const fetchTier = async () => {
    const res = await fetch("/api/user/credits")
    if (res.ok) {
      const data = await res.json()
      setSubscriptionTier((data.subscriptionTier || "free").toLowerCase())
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchTier()

    // Listen for successful payments from the checkout tab
    const bc = new BroadcastChannel('paypal_checkout');
    bc.onmessage = (event) => {
      if (event.data && event.data.type === 'PAYMENT_SUCCESS') {
        fetchTier();
      }
    };

    return () => {
      bc.close();
    }
  }, [])

  const openCheckout = (amount: number, tier?: string) => {
    const url = `/checkout?amount=${amount}${tier ? `&tier=${tier}` : ''}`;
    window.open(url, '_blank', 'width=600,height=800,menubar=no,toolbar=no,location=no,status=no');
  }

  if (isLoading) {
    return <div className="flex justify-center p-8"><div className="i-svg-spinners:90-ring-with-bg text-purple-500 text-3xl animate-spin" /></div>
  }

  return (
    <div className="flex flex-col gap-6 p-2 h-full overflow-y-auto pr-2">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-purple-500" />
          Subscription & Billing
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Upgrade your account to unlock premium features and add balance for AI operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Free Tier */}
        <div className={`border rounded-xl p-6 flex flex-col ${subscriptionTier === 'free' ? 'border-purple-500 bg-purple-500/5 shadow-sm shadow-purple-500/10' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'}`}>
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Free</h3>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">$0</p>
          </div>
          
          <ul className="space-y-3 mb-6 flex-1">
            {features.free.map((feat, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                {feat.included ? (
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-red-500/50 mt-0.5 flex-shrink-0" />
                )}
                <span className={!feat.included ? "opacity-50" : ""}>{feat.text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto">
            {subscriptionTier === 'free' ? (
              <div className="w-full text-center py-2 bg-purple-500/20 text-purple-500 font-semibold rounded-lg border border-purple-500/30">
                Current Plan
              </div>
            ) : (
              <div className="w-full text-center py-2 text-gray-500 dark:text-gray-500 font-semibold">
                -
              </div>
            )}
          </div>
        </div>

        {/* Pro Tier */}
        <div className={`border rounded-xl p-6 flex flex-col relative ${subscriptionTier === 'pro' ? 'border-purple-500 bg-purple-500/5 shadow-sm shadow-purple-500/10' : 'border-purple-500/30 bg-gray-50 dark:bg-gray-950'}`}>
          {subscriptionTier === 'free' && (
            <div className="absolute top-0 right-6 -translate-y-1/2 bg-purple-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md">
              Recommended
            </div>
          )}
          
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Pro <span className="text-xs bg-purple-500/20 text-purple-500 px-2 py-0.5 rounded">One-time</span>
            </h3>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">${PRO_PRICE}</p>
          </div>
          
          <ul className="space-y-3 mb-6 flex-1">
            {features.pro.map((feat, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                {feat.included ? (
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-red-500/50 mt-0.5 flex-shrink-0" />
                )}
                <span>{feat.text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto relative z-10">
            {subscriptionTier === 'pro' ? (
              <div className="w-full text-center py-2 bg-purple-500/20 text-purple-500 font-semibold rounded-lg border border-purple-500/30">
                Current Plan
              </div>
            ) : (
              <button
                onClick={() => openCheckout(PRO_PRICE, 'pro')}
                className="w-full bg-[#0070ba] hover:bg-[#003087] text-white font-bold py-2.5 px-4 rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Pay with</span>
                <span className="font-serif italic font-bold">PayPal</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Add Balance Section */}
      <div className="mt-4 mb-8 border border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-white dark:bg-gray-900">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
          <DollarSign className="w-5 h-5 text-green-500" />
          Add AI Balance
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Need more AI credits? You can top up your balance at any time. ($1 = $1 AI Balance)
        </p>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:w-1/3">
            <select 
              className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors"
              value={selectedAmount}
              onChange={(e) => setSelectedAmount(Number(e.target.value))}
            >
              {[5, 10, 20, 50, 100].map((amt) => (
                <option key={amt} value={amt}>
                  ${amt}.00 Balance
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-2/3 relative z-0">
             <button
                onClick={() => openCheckout(selectedAmount)}
                className="w-full md:w-auto min-w-[200px] bg-[#0070ba] hover:bg-[#003087] text-white font-bold py-3 px-6 rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Pay with</span>
                <span className="font-serif italic font-bold text-lg">PayPal</span>
              </button>
          </div>
        </div>
      </div>
    </div>
  )
}
