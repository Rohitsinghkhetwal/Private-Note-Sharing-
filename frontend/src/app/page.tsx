import Navbar from '@/components/Navbar';
import CreateNoteForm from '@/components/CreateNoteForm';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-14 flex items-center justify-center px-4 py-16">
        <CreateNoteForm />
      </main>
    </>
  );
}
