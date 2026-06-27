interface KeywordBadgeProps {
  keywords: string[];
}

export default function KeywordBadge({ keywords }: KeywordBadgeProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {keywords.map((kw) => (
        <span
          key={kw}
          className="text-xs px-2 py-0.5 rounded-full bg-[#f0ede8] text-[#555] font-medium"
        >
          {kw}
        </span>
      ))}
    </div>
  );
}
