import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { Button } from './Button';
import { Avatar } from './Avatar';

export interface NavLink {
  label: string;
  href: string;
  badge?: string | number;
}

export interface NavbarProps {
  logo?: React.ReactNode;
  links?: NavLink[];
  user?: {
    name: string;
    avatar?: string;
    email?: string;
  };
  actions?: React.ReactNode;
  sticky?: boolean;
  transparent?: boolean;
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  logo,
  links = [],
  user,
  actions,
  sticky = true,
  transparent = false,
  className,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className={cn(
          'w-full border-b border-white/10 transition-all duration-500',
          sticky && 'sticky top-0 z-50',
          transparent
            ? 'bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-purple-900/20 backdrop-blur-2xl'
            : 'bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl',
          'shadow-2xl shadow-black/20',
          className
        )}
      >
        <div className="w-full px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Links */}
            <div className="flex items-center gap-8">
              {logo && (
                <div className="flex-shrink-0">
                  {logo}
                </div>
              )}
              
              {/* Desktop Links */}
              <div className="hidden md:flex items-center gap-1">
                {links.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className={cn(
                      'relative px-4 py-2 text-sm font-medium',
                      'text-gray-300 hover:text-white',
                      'transition-all duration-300',
                      'rounded-xl hover:bg-white/10',
                      'hover:shadow-lg hover:shadow-purple-500/20',
                      'group'
                    )}
                  >
                    <span className="relative z-10">{link.label}</span>
                    <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                    {link.badge !== undefined && (
                      <span className="ml-2 inline-flex items-center justify-center h-5 min-w-[20px] px-2 text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white shadow-lg">
                        {link.badge}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Actions and User */}
            <div className="flex items-center gap-4">
              {actions && (
                <div className="hidden md:flex items-center gap-2">
                  {actions}
                </div>
              )}

              {user && (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-3 rounded-lg p-1.5 hover:bg-background-tertiary transition-colors duration-quick"
                  >
                    <Avatar
                      size="sm"
                      src={user.avatar}
                      fallback={user.name}
                    />
                    <div className="hidden lg:block text-left">
                      <p className="text-small font-medium text-text-primary">
                        {user.name}
                      </p>
                      {user.email && (
                        <p className="text-mini text-text-tertiary">
                          {user.email}
                        </p>
                      )}
                    </div>
                    <svg
                      className={cn(
                        'hidden lg:block transition-transform duration-300',
                        userMenuOpen && 'rotate-180'
                      )}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* User Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl shadow-black/40">
                      <div className="p-3 border-b border-white/10">
                        <p className="text-sm font-semibold text-white">
                          {user.name}
                        </p>
                        {user.email && (
                          <p className="text-xs text-gray-300">
                            {user.email}
                          </p>
                        )}
                      </div>
                      <div className="p-2">
                        <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
                          Profile
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
                          Settings
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
                          Help
                        </button>
                        <div className="my-2 border-t border-white/10" />
                        <button className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300">
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md hover:bg-background-tertiary transition-colors duration-quick"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-300"
                >
                  {mobileMenuOpen ? (
                    <>
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </>
                  ) : (
                    <>
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 z-header bg-background-secondary border-b border-border-primary shadow-high">
          <div className="px-4 py-3 space-y-1">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="flex items-center justify-between px-3 py-2 text-small font-medium text-text-secondary hover:text-text-primary hover:bg-background-tertiary rounded-md transition-colors duration-quick"
              >
                {link.label}
                {link.badge !== undefined && (
                  <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 text-micro font-medium bg-brand rounded-full text-white">
                    {link.badge}
                  </span>
                )}
              </a>
            ))}
            {actions && (
              <>
                <div className="my-2 border-t border-border-primary" />
                <div className="px-3 py-2 space-y-2">
                  {actions}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};