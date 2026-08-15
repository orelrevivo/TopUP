import '@unocss/reset/tailwind.css';
import './globals.css';
import './styles/index.scss';
import { AuthProvider } from './hooks/useAuth';
import { StorageSync } from './lib/auth/StorageSync';
import { ThemeSync } from './components/ui/ThemeSync.client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { StayUpInit } from './components/stayup/StayUpInit.client';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata = {
  title: 'Falbor',
  description: 'Talk with Falbor, an AI assistant',
};

export default function FalborLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                let theme = localStorage.getItem('falbor_theme');
                if (!theme) {
                  theme = 'light';
                  localStorage.setItem('falbor_theme', theme);
                }
                document.documentElement.setAttribute('data-theme', theme);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${montserrat.className} ${montserrat.variable}`}>
        <ThemeSync />
        <StayUpInit />
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || ""}>
          <AuthProvider>
            <StorageSync />
            {children}
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}