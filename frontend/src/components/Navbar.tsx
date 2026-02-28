import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.05] bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

    
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 bg-brand-500/15 border border-brand-500/25 rounded-lg flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
            <svg
              className="w-3.5 h-3.5 text-brand-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <span className="text-sm font-semibold text-white/90">PrivateNote</span>
        </Link>
        
        <Link href="/" className="btn-ghost text-xs">
          New note
        </Link>

      </div>
    </nav>
  );
}
