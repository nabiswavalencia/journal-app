import { NavLink } from 'react-router-dom';
import { Heart, Calendar, Target, BookOpen, Settings, TrendingUp, DollarSign } from 'lucide-react';

const Navbar = () => {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: Heart },
    { path: '/habits', label: 'Habits', icon: Target },
    { path: '/cycle', label: 'Cycle', icon: Calendar },
    { path: '/budget', label: 'Budget', icon: DollarSign },
    { path: '/mood', label: 'Mood', icon: TrendingUp },
    { path: '/journal', label: 'Journal', icon: BookOpen },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 soft-shadow">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <h1 className="text-lg sm:text-2xl font-script font-bold text-primary">
              My Journal
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-6 xl:space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-primary-foreground soft-shadow'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Tablet Navigation */}
          <div className="hidden md:flex lg:hidden space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-primary-foreground soft-shadow'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`
                  }
                  title={item.label}
                >
                  <Icon className="h-5 w-5" />
                </NavLink>
              );
            })}
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden space-x-2 overflow-x-auto">
            {navItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-[40px] ${
                      isActive
                        ? 'bg-primary text-primary-foreground soft-shadow'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`
                  }
                  title={item.label}
                >
                  <Icon className="h-4 w-4" />
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;