import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/courses", label: "Courses" },
    { href: "/success-stories", label: "Success Stories" },
    { href: "/career", label: "Career" },
    { href: "/contact", label: "Contact" },
  ];

  if (location.startsWith("/admin")) return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Droplets className="w-6 h-6" />
          </div>
          <span className="font-bold text-lg text-slate-900 hidden sm:inline">H2O Classes</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <span className="text-slate-700 hover:text-blue-600 transition cursor-pointer">
                {link.label}
              </span>
            </Link>
          ))}
          <Link href="/contact">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Book Counseling Session
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 py-4 px-4">
          <div className="space-y-3">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className="block py-2 text-slate-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                  {link.label}
                </span>
              </Link>
            ))}
            <Link href="/contact">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIsOpen(false)}>
                Book Counseling Session
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
