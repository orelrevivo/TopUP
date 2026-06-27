import '@unocss/reset/tailwind.css';
import './globals.css';
import './styles/index.scss';
import { AuthProvider } from '~/hooks/useAuth';
import { StorageSync } from '~/lib/auth/StorageSync';

export const metadata = {
  title: 'Bolt',
  description: 'Talk with Bolt, an AI assistant from StackBlitz',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <AuthProvider>
          <StorageSync />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}