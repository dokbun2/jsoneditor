import React from 'react';
import { cn } from '@/utils/cn';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  logo?: React.ReactNode;
  description?: string;
  sections?: FooterSection[];
  bottomLinks?: FooterLink[];
  copyright?: string;
  socials?: Array<{
    name: string;
    href: string;
    icon: React.ReactNode;
  }>;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({
  logo,
  description,
  sections = [],
  bottomLinks = [],
  copyright,
  socials = [],
  className,
}) => {
  return (
    <footer
      className={cn(
        'w-full bg-background-secondary border-t border-border-primary',
        className
      )}
    >
      <div className="w-full px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Logo and Description */}
            <div className="lg:col-span-4">
              {logo && <div className="mb-4">{logo}</div>}
              {description && (
                <p className="text-small text-text-secondary max-w-md">
                  {description}
                </p>
              )}
              {socials.length > 0 && (
                <div className="mt-6 flex items-center gap-3">
                  {socials.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className={cn(
                        'h-9 w-9 rounded-lg',
                        'bg-background-tertiary hover:bg-background-quaternary',
                        'border border-border-secondary hover:border-border-tertiary',
                        'flex items-center justify-center',
                        'text-text-tertiary hover:text-text-primary',
                        'transition-all duration-quick'
                      )}
                      aria-label={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Sections */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
                {sections.map((section, index) => (
                  <div key={index}>
                    <h3 className="text-small font-semibold text-text-primary mb-3">
                      {section.title}
                    </h3>
                    <ul className="space-y-2">
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <a
                            href={link.href}
                            className={cn(
                              'text-small text-text-tertiary',
                              'hover:text-text-primary',
                              'transition-colors duration-quick'
                            )}
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border-primary py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            {copyright && (
              <p className="text-mini text-text-quaternary">
                {copyright}
              </p>
            )}

            {/* Bottom Links */}
            {bottomLinks.length > 0 && (
              <div className="flex items-center gap-6">
                {bottomLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className={cn(
                      'text-mini text-text-quaternary',
                      'hover:text-text-secondary',
                      'transition-colors duration-quick'
                    )}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export const SimpleFooter: React.FC<{
  text?: string;
  links?: FooterLink[];
  className?: string;
}> = ({ text, links = [], className }) => {
  return (
    <footer
      className={cn(
        'w-full bg-background-secondary border-t border-border-primary',
        className
      )}
    >
      <div className="w-full px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {text && (
            <p className="text-small text-text-secondary">
              {text}
            </p>
          )}
          {links.length > 0 && (
            <div className="flex items-center gap-6">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className={cn(
                    'text-small text-text-tertiary',
                    'hover:text-text-primary',
                    'transition-colors duration-quick'
                  )}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};