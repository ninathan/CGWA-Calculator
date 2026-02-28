export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white/60 backdrop-blur py-6">
      <div className="container mx-auto px-6 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} CGWA Calculator — Built with Next.js
      </div>
    </footer>
  );
}
