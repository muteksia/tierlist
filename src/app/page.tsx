import { TierListBoard } from '@/components/tierlist/TierListBoard';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased selection:bg-zinc-200 dark:selection:bg-zinc-800">
      <TierListBoard />
    </main>
  );
}
