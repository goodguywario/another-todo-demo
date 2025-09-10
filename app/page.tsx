import TodoApp from "./components/TodoApp";

export default function Home() {
  return (
    <div className="min-h-screen p-8 sm:p-16 flex flex-col gap-12 items-center">
      <TodoApp />
      <footer className="mt-auto flex gap-6 flex-wrap items-center justify-center text-xs text-neutral-500">
        <span>Simple Todo Demo (localStorage)</span>
        <a
          className="hover:underline"
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Next.js
        </a>
      </footer>
    </div>
  );
}
