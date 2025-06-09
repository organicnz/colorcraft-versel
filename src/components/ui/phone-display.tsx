import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhoneDisplayProps {
  phoneNumber: string;
  email?: string;
  className?: string;
  variant?: 'hero' | 'header' | 'contact' | 'footer';
  showIcons?: boolean;
}

export function PhoneDisplay({ 
  phoneNumber, 
  email,
  className, 
  variant = 'contact',
  showIcons = true 
}: PhoneDisplayProps) {
  const baseClasses = "transition-all duration-300";
  
  const variantClasses = {
    hero: "text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg",
    header: "text-lg font-semibold text-gray-900 hover:text-[#3ECF8E]",
    contact: "text-xl font-semibold text-gray-900",
    footer: "text-base font-medium text-gray-300 hover:text-white"
  };

  const iconClasses = {
    hero: "w-6 h-6 md:w-8 md:h-8",
    header: "w-4 h-4",
    contact: "w-5 h-5",
    footer: "w-4 h-4"
  };

  const containerClasses = {
    hero: "flex flex-col items-center gap-4 p-8 bg-gradient-to-r from-[#3ECF8E]/20 to-[#38BC81]/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-2xl",
    header: "flex items-center gap-2",
    contact: "flex flex-col gap-4 p-6 bg-gradient-to-br from-[#3ECF8E]/10 to-[#38BC81]/10 rounded-2xl border border-[#3ECF8E]/20 shadow-lg backdrop-blur-sm",
    footer: "flex flex-col gap-2"
  };

  return (
    <div className={cn(baseClasses, containerClasses[variant], className)}>
      {/* Phone Number */}
      <div className="flex items-center gap-3">
        {showIcons && variant !== 'header' && (
          <div className={cn(
            "flex items-center justify-center rounded-full",
            variant === 'hero' ? "bg-white/20 p-3" : 
            variant === 'contact' ? "bg-[#3ECF8E]/20 p-2" : 
            "bg-gray-700/50 p-2"
          )}>
            <Phone className={cn(iconClasses[variant], "text-current")} />
          </div>
        )}
        {showIcons && variant === 'header' && (
          <Phone className={cn(iconClasses[variant], "text-current")} />
        )}
        <a 
          href={`tel:${phoneNumber.replace(/\s+/g, '')}`}
          className={cn(variantClasses[variant], "hover:scale-105 transition-transform")}
        >
          {phoneNumber}
        </a>
      </div>

      {/* Email (if provided) */}
      {email && (
        <div className="flex items-center gap-3">
          {showIcons && variant !== 'header' && (
            <div className={cn(
              "flex items-center justify-center rounded-full",
              variant === 'hero' ? "bg-white/20 p-3" : 
              variant === 'contact' ? "bg-[#3ECF8E]/20 p-2" : 
              "bg-gray-700/50 p-2"
            )}>
              <Mail className={cn(iconClasses[variant], "text-current")} />
            </div>
          )}
          {showIcons && variant === 'header' && (
            <Mail className={cn(iconClasses[variant], "text-current")} />
          )}
          <a 
            href={`mailto:${email}`}
            className={cn(variantClasses[variant], "hover:scale-105 transition-transform")}
          >
            {email}
          </a>
        </div>
      )}

      {/* Decorative elements for hero variant */}
      {variant === 'hero' && (
        <>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#3ECF8E] rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-[#38BC81] rounded-full opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </>
      )}
    </div>
  );
}

export default PhoneDisplay; 