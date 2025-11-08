import React from 'react';
import { Heart, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-sage-50 to-lavender-50 border-t border-sage-200 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-sage-500 to-lavender-500 rounded-2xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <span className="text-2xl font-serif font-semibold text-gray-800">MindSpace</span>
            </Link>
            <p className="text-gray-700 leading-relaxed">
              Your gentle companion for emotional wellness and mindful growth.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-serif font-semibold text-lg text-gray-800 mb-4">Navigate</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-700 hover:text-sage-700 transition-colors">Home</Link></li>
              <li><Link to="/therapy" className="text-gray-700 hover:text-sage-700 transition-colors">Therapy</Link></li>
              <li><Link to="/community" className="text-gray-700 hover:text-sage-700 transition-colors">Community</Link></li>
              <li><Link to="/journal" className="text-gray-700 hover:text-sage-700 transition-colors">Journal</Link></li>
              <li><Link to="/resources" className="text-gray-700 hover:text-sage-700 transition-colors">Resources</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-serif font-semibold text-lg text-gray-800 mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-700 hover:text-sage-700 transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-700 hover:text-sage-700 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-700 hover:text-sage-700 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-700 hover:text-sage-700 transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif font-semibold text-lg text-gray-800 mb-4">Get in Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-700">
                <Mail className="w-5 h-5 text-sage-600 flex-shrink-0" />
                <span className="text-sm">hello@mindspace.com</span>
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <Phone className="w-5 h-5 text-sage-600 flex-shrink-0" />
                <span className="text-sm">+65 8123 4567</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <MapPin className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">80 Anson Road 27-03 ABC Towers<br />Singapore </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sage-300 pt-8 text-center">
          <p className="text-gray-700 text-sm mb-2">
            Built with ❤️ using ChatAndBuild • Your journey to emotional wellness starts here
          </p>
          <p className="text-gray-600 text-xs">
            © 2025 MindSpace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
