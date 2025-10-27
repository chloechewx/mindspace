import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Users, Heart, BookMarked } from 'lucide-react';

export const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/diary', icon: BookOpen, label: 'Diary' },
    { path: '/therapy', icon: Heart, label: 'Therapy' },
    { path: '/community', icon: Users, label: 'Community' },
    { path: '/resources', icon: BookMarked, label: 'Resources' },
  ];

  return (
    <nav className="bg-white border-b border-sage-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 py-3">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                isActive(path)
                  ? 'bg-gradient-to-r from-sage-500 to-lavender-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-sage-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};
