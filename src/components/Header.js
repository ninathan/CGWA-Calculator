import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-gray-900">
          <div className="h-9 w-9 rounded-lg bg-primary-500 flex items-center justify-center text-white font-bold">C</div>
          <div className="text-lg font-semibold">CGWA <span className="text-primary-500">Calculator</span></div>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <a href="#calculator" className="hover:text-primary-500">Calculator</a>
          <a href="#how" className="hover:text-primary-500">How it works</a>
        </nav>
      </div>
    </header>
  );
}
