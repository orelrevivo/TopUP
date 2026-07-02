import React from 'react';
import CheckoutClient from './CheckoutClient';

export default function CheckoutPage() {
  // Read the environment variable on the server side where it's guaranteed to be available
  const clientId = (process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '').trim();
  
  return <CheckoutClient clientId={clientId} />;
}
