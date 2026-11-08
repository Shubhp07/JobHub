import React from 'react';
import { Globe, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-spencePrimary border-t border-[#1e3d4c] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <span className="font-serif text-3xl font-bold text-white tracking-wide">
                JobHub<span className="text-spenceSecondary">.</span>
              </span>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed text-sm">
              Connecting talented professionals with their dream careers. Your success is our mission.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-500 hover:text-spenceSecondary transition-colors">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-spenceSecondary transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif font-bold text-white text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/dashboard/jobseeker" className="text-slate-400 hover:text-spenceSecondary transition-colors">Find Jobs</Link></li>
              <li><a href="#" className="text-slate-400 hover:text-spenceSecondary transition-colors">Browse Companies</a></li>
              <li><a href="#" className="text-slate-400 hover:text-spenceSecondary transition-colors">Career Advice</a></li>
              <li><a href="#" className="text-slate-400 hover:text-spenceSecondary transition-colors">Salary Guide</a></li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="font-serif font-bold text-white text-lg mb-6">For Employers</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/signin" className="text-slate-400 hover:text-spenceSecondary transition-colors">Post a Job</Link></li>
              <li><a href="#" className="text-slate-400 hover:text-spenceSecondary transition-colors">Browse Resumes</a></li>
              <li><a href="#" className="text-slate-400 hover:text-spenceSecondary transition-colors">Hiring Solutions</a></li>
              <li><a href="#" className="text-slate-400 hover:text-spenceSecondary transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif font-bold text-white text-lg mb-6">Contact Us</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-spenceSecondary mr-3" />
                <span className="text-slate-400">support@jobhub.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-spenceSecondary mr-3" />
                <span className="text-slate-400">+91 7218566635</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-spenceSecondary mr-3" />
                <span className="text-slate-400">Pune, IND</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#1e3d4c] mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-500 text-xs">
              © {new Date().getFullYear()} JobHub. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-xs">
              <a href="#" className="text-slate-500 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;