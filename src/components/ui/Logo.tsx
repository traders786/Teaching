import React from 'react';

interface LogoProps {
  theme?: 'light' | 'dark' | 'white-bg'; // light: for light backgrounds, dark: for dark backgrounds, white-bg: boxed on white
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  theme = 'light',
  size = 'md',
  className = '',
  showText = true,
}) => {
  const heightClasses = {
    sm: 'h-7',
    md: 'h-9 sm:h-10',
    lg: 'h-12 sm:h-14',
    xl: 'h-16 sm:h-20',
  }[size];

  if (theme === 'white-bg') {
    return (
      <div className={`inline-flex items-center rounded-xl bg-white p-1.5 shadow-xs ${className}`}>
        <img
          src="/upspeaq-logo.png"
          alt="upspeaq"
          className={`${heightClasses} w-auto object-contain`}
          loading="eager"
        />
      </div>
    );
  }

  if (theme === 'dark') {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        <div className="relative inline-flex items-center">
          {/* Transparent logo with bright white text filter for dark backgrounds */}
          <img
            src="/upspeaq-logo.png"
            alt="upspeaq"
            className={`${heightClasses} w-auto object-contain brightness-0 invert`}
            loading="eager"
          />
        </div>
      </div>
    );
  }

  // Default: Transparent logo for light backgrounds (Navbar, light cards, headers)
  return (
    <div className={`inline-flex items-center ${className}`}>
      <img
        src="/upspeaq-logo.png"
        alt="upspeaq"
        className={`${heightClasses} w-auto object-contain transition-transform group-hover:scale-[1.02]`}
        loading="eager"
      />
    </div>
  );
};
