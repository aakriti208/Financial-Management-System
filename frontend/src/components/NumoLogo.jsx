function NumoLogo({ size = 'md', theme = 'dark' }) {
  const sizes = {
    sm: { box: 24, stroke: 2,   text: 'text-base',  gap: 'gap-1.5' },
    md: { box: 30, stroke: 2.2, text: 'text-lg',    gap: 'gap-2'   },
    lg: { box: 40, stroke: 2.8, text: 'text-2xl',   gap: 'gap-2.5' },
  }
  const { box, stroke, text, gap } = sizes[size]
  const p = box * 0.27
  const mid = box / 2

  return (
    <div className={`flex items-center ${gap}`}>
      {/* Mark: rounded square with stylised N */}
      <svg width={box} height={box} viewBox={`0 0 ${box} ${box}`} fill="none">
        <rect width={box} height={box} rx={box * 0.22} fill="#10b981" />
        {/* N strokes */}
        <path
          d={`M${p} ${box - p} L${p} ${p} L${box - p} ${box - p} L${box - p} ${p}`}
          stroke="white"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Subtle upward tick on top-right */}
        <path
          d={`M${mid + 1} ${p} L${box - p + 3} ${p - 3}`}
          stroke="white"
          strokeWidth={stroke * 0.75}
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>

      {/* Wordmark */}
      <span className={`font-extrabold tracking-tight ${text} ${theme === 'dark' ? 'text-white' : 'text-[#0f2035]'}`}>
        NUMO
      </span>
    </div>
  )
}

export default NumoLogo
