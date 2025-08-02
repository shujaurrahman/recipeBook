export default function Footer() {
  return (
    <footer className="w-full py-6 mt-8 border-t border-slate-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between md:px-8 gap-4">
        <div>
          <p className="text-sm text-slate-500">
            Built with{" "}
            <a
              className="hover:text-slate-600"
              href="https://nextjs.org/"
              target="_blank"
              rel="noreferrer"
            >
              Next.js{" "}
            </a>
            and{" "}
            <a
              className="hover:text-slate-800"
              href="https://tailwindcss.com/"
              target="_blank"
              rel="noreferrer"
            >
              Tailwind
            </a>
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Recipe data from{" "}
            <a
              className="hover:text-slate-800"
              href="https://spoonacular.com/food-api"
              target="_blank"
              rel="noreferrer"
            >
              Spoonacular API
            </a>
          </p>
        </div>

        <div className="flex items-center">
          <a
            href="https://shujaurrahman.com/"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            <span>Designed & Developed by Shuja ur Rahman</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
