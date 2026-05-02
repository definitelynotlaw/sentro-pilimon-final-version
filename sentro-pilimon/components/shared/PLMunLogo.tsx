import { cn } from '@/lib/utils'
interface PLMunLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}
export function PLMunLogo({ className, size = 'md' }: PLMunLogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
    xl: 'h-20 w-20',
  }
  return (
    <svg
      viewBox="0 0 680 680"
      className={cn(sizeClasses[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Sentro Pilimon Logo"
    >
      <style>{'.ring{fill:none;stroke:#C9972C}.inner-ring{fill:none;stroke:#6B0000}.label{font-family:Georgia,serif;fill:#FAFAF7}.sub{font-family:Georgia,serif;fill:#C9972C}.dot{fill:#C9972C}'}</style>
      <circle cx="340" cy="340" r="290" fill="#6B0000"/>
      <circle cx="340" cy="340" r="290" fill="none" stroke="#C9972C" strokeWidth="6"/>
      <circle cx="340" cy="340" r="272" fill="none" stroke="#FAFAF7" strokeWidth="1.5" strokeDasharray="6 4"/>
      <circle cx="340" cy="340" r="220" fill="#1A1A18"/>
      <circle cx="340" cy="340" r="220" fill="none" stroke="#C9972C" strokeWidth="3"/>
      <rect x="210" y="210" width="60" height="60" rx="6" fill="#C9972C"/>
      <rect x="218" y="218" width="44" height="44" rx="4" fill="#1A1A18"/>
      <rect x="226" y="226" width="28" height="28" rx="2" fill="#C9972C"/>
      <rect x="410" y="210" width="60" height="60" rx="6" fill="#C9972C"/>
      <rect x="418" y="218" width="44" height="44" rx="4" fill="#1A1A18"/>
      <rect x="426" y="226" width="28" height="28" rx="2" fill="#C9972C"/>
      <rect x="210" y="410" width="60" height="60" rx="6" fill="#C9972C"/>
      <rect x="218" y="418" width="44" height="44" rx="4" fill="#1A1A18"/>
      <rect x="226" y="426" width="28" height="28" rx="2" fill="#C9972C"/>
      <rect x="286" y="216" width="10" height="10" rx="1" fill="#C9972C" opacity="0.8"/>
      <rect x="300" y="216" width="10" height="10" rx="1" fill="#C9972C" opacity="0.6"/>
      <rect x="314" y="216" width="10" height="10" rx="1" fill="#C9972C" opacity="0.9"/>
      <rect x="328" y="216" width="10" height="10" rx="1" fill="#C9972C" opacity="0.5"/>
      <rect x="342" y="216" width="10" height="10" rx="1" fill="#C9972C" opacity="0.8"/>
      <rect x="356" y="216" width="10" height="10" rx="1" fill="#C9972C" opacity="0.4"/>
      <rect x="370" y="216" width="10" height="10" rx="1" fill="#C9972C" opacity="0.7"/>
      <rect x="384" y="216" width="10" height="10" rx="1" fill="#C9972C" opacity="0.9"/>
      <rect x="216" y="286" width="10" height="10" rx="1" fill="#C9972C" opacity="0.6"/>
      <rect x="216" y="300" width="10" height="10" rx="1" fill="#C9972C" opacity="0.9"/>
      <rect x="216" y="314" width="10" height="10" rx="1" fill="#C9972C" opacity="0.4"/>
      <rect x="216" y="328" width="10" height="10" rx="1" fill="#C9972C" opacity="0.8"/>
      <rect x="216" y="342" width="10" height="10" rx="1" fill="#C9972C" opacity="0.5"/>
      <rect x="216" y="356" width="10" height="10" rx="1" fill="#C9972C" opacity="0.7"/>
      <rect x="216" y="370" width="10" height="10" rx="1" fill="#C9972C" opacity="0.9"/>
      <rect x="216" y="384" width="10" height="10" rx="1" fill="#C9972C" opacity="0.6"/>
      <rect x="454" y="286" width="10" height="10" rx="1" fill="#C9972C" opacity="0.8"/>
      <rect x="454" y="300" width="10" height="10" rx="1" fill="#C9972C" opacity="0.5"/>
      <rect x="454" y="314" width="10" height="10" rx="1" fill="#C9972C" opacity="0.9"/>
      <rect x="454" y="328" width="10" height="10" rx="1" fill="#C9972C" opacity="0.4"/>
      <rect x="454" y="342" width="10" height="10" rx="1" fill="#C9972C" opacity="0.7"/>
      <rect x="286" y="454" width="10" height="10" rx="1" fill="#C9972C" opacity="0.9"/>
      <rect x="300" y="454" width="10" height="10" rx="1" fill="#C9972C" opacity="0.5"/>
      <rect x="314" y="454" width="10" height="10" rx="1" fill="#C9972C" opacity="0.7"/>
      <rect x="328" y="454" width="10" height="10" rx="1" fill="#C9972C" opacity="0.4"/>
      <rect x="342" y="454" width="10" height="10" rx="1" fill="#C9972C" opacity="0.9"/>
      <rect x="356" y="454" width="10" height="10" rx="1" fill="#C9972C" opacity="0.6"/>
      <rect x="370" y="454" width="10" height="10" rx="1" fill="#C9972C" opacity="0.8"/>
      <rect x="384" y="454" width="10" height="10" rx="1" fill="#C9972C" opacity="0.5"/>
      <rect x="398" y="454" width="10" height="10" rx="1" fill="#C9972C" opacity="0.7"/>
      <circle cx="340" cy="330" r="90" fill="#FAFAF7"/>
      <text x="340" y="308" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontSize="52" fontWeight="700" fill="#6B0000">SP</text>
      <line x1="296" y1="322" x2="384" y2="322" stroke="#C9972C" strokeWidth="2"/>
      <text x="340" y="348" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fontWeight="500" fill="#1A1A18" letterSpacing="3">PILIMON</text>
      <path id="topArc" d="M 100,340 A 240,240 0 0,1 580,340" fill="none"/>
      <text fontFamily="'Playfair Display', Georgia, serif" fontSize="22" fontWeight="700" fill="#FAFAF7" letterSpacing="8">
        <textPath href="#topArc" startOffset="18%">SENTRO</textPath>
      </text>
      <path id="bottomArc" d="M 130,380 A 220,220 0 0,0 550,380" fill="none"/>
      <text fontFamily="Georgia, serif" fontSize="13" fill="#C9972C" letterSpacing="4">
        <textPath href="#bottomArc" startOffset="12%">BULLETIN · QR · CAMPUS</textPath>
      </text>
      <circle cx="340" cy="52" r="5" fill="#C9972C"/>
      <circle cx="340" cy="628" r="5" fill="#C9972C"/>
      <circle cx="52" cy="340" r="5" fill="#C9972C"/>
      <circle cx="628" cy="340" r="5" fill="#C9972C"/>
      <circle cx="135" cy="135" r="3.5" fill="#C9972C" opacity="0.7"/>
      <circle cx="545" cy="135" r="3.5" fill="#C9972C" opacity="0.7"/>
      <circle cx="135" cy="545" r="3.5" fill="#C9972C" opacity="0.7"/>
      <circle cx="545" cy="545" r="3.5" fill="#C9972C" opacity="0.7"/>
    </svg>
  )
}
