import type { CategorySlug, MetalSlug } from "@/lib/catalog";

interface Props {
  category: CategorySlug;
  metal?: MetalSlug;
  className?: string;
}

/** A single stone: a faceted diamond or a polished gold bead. */
function Stone({ x, y, r, metal }: { x: number; y: number; r: number; metal: MetalSlug }) {
  if (metal === "diamond") {
    return (
      <g>
        <circle cx={x} cy={y} r={r} fill="#fffdf8" stroke="currentColor" strokeWidth={0.9} />
        <path
          d={`M${x - r * 0.7} ${y} L${x} ${y - r * 0.7} L${x + r * 0.7} ${y} L${x} ${y + r * 0.7} Z`}
          fill="none"
          stroke="currentColor"
          strokeWidth={0.6}
          opacity={0.7}
        />
      </g>
    );
  }
  return <circle cx={x} cy={y} r={r} fill="currentColor" opacity={0.85} />;
}

function Gem({ x, y, s, metal }: { x: number; y: number; s: number; metal: MetalSlug }) {
  const fill = metal === "diamond" ? "#fffdf8" : "currentColor";
  return (
    <g>
      <path
        d={`M${x - s} ${y - s * 0.35} L${x - s * 0.55} ${y - s} L${x + s * 0.55} ${y - s} L${x + s} ${y - s * 0.35} L${x} ${y + s} Z`}
        fill={fill}
        fillOpacity={metal === "diamond" ? 1 : 0.25}
        stroke="currentColor"
        strokeWidth={1}
        strokeLinejoin="round"
      />
      <path
        d={`M${x - s} ${y - s * 0.35} H${x + s} M${x - s * 0.55} ${y - s} L${x - s * 0.25} ${y - s * 0.35} L${x} ${y + s} M${x + s * 0.55} ${y - s} L${x + s * 0.25} ${y - s * 0.35} L${x} ${y + s}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={0.6}
      />
    </g>
  );
}

export default function JewelIcon({ category, metal = "gold", className }: Props) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  let art: React.ReactNode;

  switch (category) {
    case "ladies-ring":
      art = (
        <>
          <ellipse cx={60} cy={74} rx={28} ry={30} {...common} />
          <ellipse cx={60} cy={74} rx={23} ry={25} {...common} strokeWidth={0.8} />
          <path d="M48 46 Q60 38 72 46" {...common} />
          <Gem x={60} y={34} s={11} metal={metal} />
          {metal === "gold" && (
            <>
              <path d="M44 42 q-6 -6 -2 -12 q6 2 6 10" {...common} strokeWidth={1} />
              <path d="M76 42 q6 -6 2 -12 q-6 2 -6 10" {...common} strokeWidth={1} />
            </>
          )}
        </>
      );
      break;

    case "gents-ring":
      art = (
        <>
          <ellipse cx={60} cy={72} rx={30} ry={30} {...common} strokeWidth={2.4} />
          <ellipse cx={60} cy={72} rx={22} ry={22} {...common} strokeWidth={1} />
          <rect x={42} y={30} width={36} height={24} rx={6} {...common} fill="#fffaf0" />
          <rect x={47} y={35} width={26} height={14} rx={3} {...common} strokeWidth={0.8} />
          {metal === "diamond" ? (
            [52, 60, 68].map((x) => <Stone key={x} x={x} y={42} r={3} metal={metal} />)
          ) : (
            <text x={60} y={46} textAnchor="middle" fontSize={10} fill="currentColor" fontFamily="serif">
              P
            </text>
          )}
        </>
      );
      break;

    case "necklace":
      art = (
        <>
          <path d="M18 22 C22 70 44 88 60 90 C76 88 98 70 102 22" {...common} />
          <path d="M26 22 C30 62 46 78 60 80 C74 78 90 62 94 22" {...common} strokeWidth={0.8} />
          {[
            [24, 44], [30, 60], [38, 72], [48, 81], [72, 81], [82, 72], [90, 60], [96, 44],
          ].map(([x, y]) => (
            <Stone key={`${x}-${y}`} x={x} y={y} r={2.6} metal={metal} />
          ))}
          <path d="M60 90 v4" {...common} />
          <Gem x={60} y={103} s={9} metal={metal} />
        </>
      );
      break;

    case "earring":
      art = (
        <>
          {[38, 82].map((cx) => (
            <g key={cx}>
              <Stone x={cx} y={26} r={6} metal={metal} />
              <path d={`M${cx} 32 v10`} {...common} />
              <path
                d={`M${cx} 42 C${cx - 14} 62 ${cx - 12} 84 ${cx} 92 C${cx + 12} 84 ${cx + 14} 62 ${cx} 42 Z`}
                {...common}
              />
              <path
                d={`M${cx} 52 C${cx - 7} 66 ${cx - 6} 78 ${cx} 83 C${cx + 6} 78 ${cx + 7} 66 ${cx} 52 Z`}
                {...common}
                strokeWidth={0.7}
              />
              <Stone x={cx} y={70} r={3} metal={metal} />
            </g>
          ))}
        </>
      );
      break;

    case "jhumka":
      art = (
        <>
          <circle cx={60} cy={20} r={8} {...common} />
          <Stone x={60} y={20} r={4} metal={metal} />
          <path d="M60 28 v8" {...common} />
          <path d="M34 78 C34 50 46 38 60 38 C74 38 86 50 86 78 Z" {...common} fill="#fffaf0" />
          <path d="M40 66 H80 M44 54 H76" {...common} strokeWidth={0.7} />
          {[42, 50, 58, 66, 74].map((x) => (
            <Stone key={x} x={x + 2} y={60} r={1.6} metal={metal} />
          ))}
          <path d="M32 78 H88" {...common} strokeWidth={1.8} />
          {[36, 44, 52, 60, 68, 76, 84].map((x, i) => (
            <g key={x}>
              <path d={`M${x} 79 v${6 + (i % 2) * 4}`} {...common} strokeWidth={0.8} />
              <Stone x={x} y={88 + (i % 2) * 4} r={2.8} metal={metal} />
            </g>
          ))}
        </>
      );
      break;

    case "bangles":
      art = (
        <>
          <ellipse cx={52} cy={58} rx={32} ry={24} {...common} strokeWidth={2.2} />
          <ellipse cx={52} cy={58} rx={27} ry={19} {...common} strokeWidth={0.8} />
          <ellipse cx={68} cy={66} rx={32} ry={24} {...common} strokeWidth={2.2} />
          <ellipse cx={68} cy={66} rx={27} ry={19} {...common} strokeWidth={0.8} />
          {[
            [40, 88], [52, 90], [64, 90], [76, 88], [88, 83],
          ].map(([x, y]) => (
            <Stone key={x} x={x} y={y - 2} r={2.4} metal={metal} />
          ))}
        </>
      );
      break;

    case "chain":
      art = (
        <>
          {Array.from({ length: 7 }).map((_, i) => {
            const x = 22 + i * 12.5;
            const y = 88 - i * 10.5;
            return (
              <ellipse
                key={i}
                cx={x}
                cy={y}
                rx={9}
                ry={5.5}
                transform={`rotate(${i % 2 ? -40 : 50} ${x} ${y})`}
                {...common}
                strokeWidth={i % 2 ? 1.2 : 1.8}
              />
            );
          })}
          {metal === "diamond" &&
            [[35, 77], [60, 56], [85, 35]].map(([x, y]) => (
              <Stone key={x} x={x} y={y} r={3.4} metal={metal} />
            ))}
        </>
      );
      break;

    case "mangalsutra":
      art = (
        <>
          <path d="M20 18 C24 56 42 76 60 80 C78 76 96 56 100 18" {...common} strokeWidth={0.8} />
          {Array.from({ length: 13 }).map((_, i) => {
            const t = (i + 1) / 14;
            const x = 20 + 80 * t;
            const y = 18 + 62 * Math.sin(Math.PI * t) * 0.97;
            const gold = i % 3 === 1;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={gold ? 2.8 : 2.2}
                fill={gold ? "currentColor" : "#1a1210"}
              />
            );
          })}
          <path d="M60 81 v5" {...common} />
          <circle cx={52} cy={96} r={8} {...common} fill="#fffaf0" />
          <circle cx={68} cy={96} r={8} {...common} fill="#fffaf0" />
          <Stone x={52} y={96} r={3.4} metal={metal} />
          <Stone x={68} y={96} r={3.4} metal={metal} />
        </>
      );
      break;

    case "bracelet":
      art = (
        <>
          <ellipse cx={60} cy={62} rx={40} ry={26} {...common} strokeWidth={1.2} />
          <ellipse cx={60} cy={62} rx={34} ry={20} {...common} strokeWidth={0.7} />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (Math.PI * 2 * i) / 12;
            return (
              <Stone
                key={i}
                x={60 + Math.cos(a) * 37}
                y={62 + Math.sin(a) * 23}
                r={i % 3 === 0 ? 3.6 : 2.6}
                metal={metal}
              />
            );
          })}
          <rect x={92} y={56} width={10} height={12} rx={2} {...common} fill="#fffaf0" />
        </>
      );
      break;
  }

  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      {art}
    </svg>
  );
}
