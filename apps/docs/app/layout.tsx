import Link from 'next/link';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex w-full h-full text-white bg-black">
          {/* Docs Sidebar */}
          <aside className="w-64 flex-shrink-0 border-r border-gray-800 bg-black/90 p-6 flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-4 text-[#FF5800]">Documentation</h2>
            <nav className="flex flex-col gap-2">
              <Link href="/docs/builder" className="hover:text-[#FF5800] transition-colors">
                Website Builder
              </Link>
              <Link href="/docs/database" className="hover:text-[#FF5800] transition-colors">
                Database
              </Link>
              <Link href="/docs/organizations" className="hover:text-[#FF5800] transition-colors">
                Organizations
              </Link>
              <Link href="/docs/workflow" className="hover:text-[#FF5800] transition-colors">
                Workflow
              </Link>
              <Link href="/docs/darknet" className="hover:text-[#FF5800] transition-colors">
                Darknet
              </Link>
              <div className="my-2 border-t border-gray-800"></div>
              <Link href="/docs/chat" className="hover:text-[#FF5800] transition-colors">
                Chat
              </Link>
              <Link href="/docs/models" className="hover:text-[#FF5800] transition-colors">
                Models
              </Link>
              <Link href="/docs/stayup" className="hover:text-[#FF5800] transition-colors">
                Stayup
              </Link>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

