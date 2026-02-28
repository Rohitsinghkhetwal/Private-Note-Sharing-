import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function NotFoundPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-14 flex items-center justify-center px-4">
        <div className="text-center animate-fade-up">
          <p className="text-6xl font-bold text-white/10 font-mono mb-4">404</p>
          <h1 className="text-xl font-bold text-white mb-2">Page not found</h1>
          <p className="text-white/40 text-sm mb-6">
            The page you are looking for does not exist.
          </p>
          <Link href="/" className="btn-primary text-sm inline-flex">
            Go home
          </Link>
        </div>
      </main>
    </>
  );
}
