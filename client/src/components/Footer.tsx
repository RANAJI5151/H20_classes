import { Link, useLocation } from "wouter";
import { Droplets } from "lucide-react";

export function Footer() {
  const [location] = useLocation();
  
  if (location.startsWith("/admin")) return null;

  return (
    <footer className="bg-slate-900 text-slate-200 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Droplets className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white">H2O Classes</span>
            </div>
            <p className="text-slate-400 text-sm">Concept-based learning for academic excellence</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><Link href="/"><span className="hover:text-white cursor-pointer">Home</span></Link></li>
              <li><Link href="/courses"><span className="hover:text-white cursor-pointer">Courses</span></Link></li>
              <li><Link href="/success-stories"><span className="hover:text-white cursor-pointer">Success Stories</span></Link></li>
              <li><Link href="/career"><span className="hover:text-white cursor-pointer">Career</span></Link></li>
              <li><Link href="/contact"><span className="hover:text-white cursor-pointer">Contact</span></Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-4">Contact</h3>
            <p className="text-slate-400 text-sm mb-2">Email: info@h2oclasses.com</p>
            <p className="text-slate-400 text-sm">Phone: +91-XXXXXXXXXX</p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} H2O Classes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
