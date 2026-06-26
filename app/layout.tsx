import '@unocss/reset/tailwind.css';
import './globals.css';
import './styles/index.scss';

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}