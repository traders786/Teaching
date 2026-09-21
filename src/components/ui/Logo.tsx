import React, { useState } from 'react';
import upspeaqLogo from '../../assets/upspeaq-logo.png';
import upspeaqLogoWhiteBg from '../../assets/upspeaq-logo-white-bg.png';

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
  const [hasError, setHasError] = useState(false);

  const heightClasses = {
    sm: 'h-7',
    md: 'h-9 sm:h-10',
    lg: 'h-12 sm:h-14',
    xl: 'h-16 sm:h-20',
  }[size];

  // If the image asset fails for any reason, render a crystal clear SVG fallback
  if (hasError) {
    const isDark = theme === 'dark';
    return (
      <div className={`inline-flex items-center gap-2 font-heading font-black tracking-tight select-none ${className}`}>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF6B00] to-amber-400 flex items-center justify-center text-white shadow-sm shadow-orange-500/20">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Zm6 7v3a6 6 0 0 1-12 0V9a1 1 0 0 0-2 0v3a8 8 0 0 0 7 7.93V22a1 1 0 0 0 2 0v-2.07A8 8 0 0 0 20 12V9a1 1 0 0 0-2 0Z" />
          </svg>
        </div>
        {showText && (
          <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            up<span className="text-[#FF6B00]">speaq</span>
          </span>
        )}
      </div>
    );
  }

  if (theme === 'white-bg') {
    return (
      <div className={`inline-flex items-center rounded-xl bg-white p-1.5 shadow-xs ${className}`}>
        <img
          src={upspeaqLogoWhiteBg || upspeaqLogo}
          alt="upspeaq logo"
          className={`${heightClasses} w-auto object-contain`}
          loading="eager"
          onError={() => setHasError(true)}
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
            src={upspeaqLogo}
            alt="upspeaq logo"
            className={`${heightClasses} w-auto object-contain brightness-0 invert`}
            loading="eager"
            onError={() => setHasError(true)}
          />
        </div>
      </div>
    );
  }

  // Default: Transparent logo for light backgrounds (Navbar, light cards, headers)
  return (
    <div className={`inline-flex items-center ${className}`}>
      <img
        src={upspeaqLogo}
        alt="upspeaq logo"
        className={`${heightClasses} w-auto object-contain transition-transform group-hover:scale-[1.02]`}
        loading="eager"
        onError={() => setHasError(true)}
      />
    </div>
  );
};
