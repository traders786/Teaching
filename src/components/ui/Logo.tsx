import React, { useState } from 'react';
import upspeaqLogo from '../../assets/upspeaq-logo.png';
import upspeaqLogoWhiteBg from '../../assets/upspeaq-logo-white-bg.png';

interface LogoProps {
  theme?: 'light' | 'dark' | 'white-bg';
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
  const [imageFailed, setImageFailed] = useState(false);

  const isDark = theme === 'dark';

  const sizeConfig = {
    sm: { imgH: 'h-7', iconBox: 'w-7 h-7', text: 'text-lg', mic: 'w-3.5 h-3.5' },
    md: { imgH: 'h-9 sm:h-10', iconBox: 'w-8 h-8 sm:w-9 sm:h-9', text: 'text-xl sm:text-2xl', mic: 'w-4 h-4 sm:w-4.5 sm:h-4.5' },
    lg: { imgH: 'h-12 sm:h-14', iconBox: 'w-10 h-10 sm:w-12 sm:h-12', text: 'text-2xl sm:text-3xl', mic: 'w-5 h-5 sm:w-6 sm:h-6' },
    xl: { imgH: 'h-16 sm:h-20', iconBox: 'w-14 h-14 sm:w-16 sm:h-16', text: 'text-3xl sm:text-4xl', mic: 'w-7 h-7 sm:w-8 sm:h-8' },
  }[size];

  // If image failed to load or in fallback mode, render pristine vector logo
  if (imageFailed) {
    return (
      <div className={`inline-flex items-center gap-2.5 font-heading tracking-tight select-none ${className}`}>
        <div className={`${sizeConfig.iconBox} rounded-xl bg-gradient-to-tr from-[#FF6B00] via-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0`}>
          <svg className={`${sizeConfig.mic} fill-current`} viewBox="0 0 24 24">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Zm6 7v3a6 6 0 0 1-12 0V9a1 1 0 0 0-2 0v3a8 8 0 0 0 7 7.93V22a1 1 0 0 0 2 0v-2.07A8 8 0 0 0 20 12V9a1 1 0 0 0-2 0Z" />
          </svg>
        </div>
        {showText && (
          <div className="flex items-baseline">
            <span className={`${sizeConfig.text} font-black ${isDark ? 'text-white' : 'text-slate-900'} leading-none`}>
              up<span className="text-[#FF6B00]">speaq</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] ml-0.5 inline-block"></span>
          </div>
        )}
      </div>
    );
  }

  const selectedSrc = theme === 'white-bg' ? (upspeaqLogoWhiteBg || upspeaqLogo) : upspeaqLogo;

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src={selectedSrc}
        alt="upspeaq"
        className={`${sizeConfig.imgH} w-auto object-contain ${isDark ? 'brightness-0 invert' : ''} transition-transform group-hover:scale-[1.02]`}
        loading="eager"
        onError={() => setImageFailed(true)}
      />
    </div>
  );
};
