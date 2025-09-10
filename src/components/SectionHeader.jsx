function SectionHeader({ title, moreTo = "#", className = "" }) {
  return (
    <div className={`flex items-end justify-between mb-4 ${className}`}>
      <h2 className="text-[22px] font-bold tracking-tight text-white">{title}</h2>
      <a
        href={moreTo}
        className="text-sm text-white/70 hover:text-white flex items-center gap-1"
      >
        더보기 <span aria-hidden>›</span>
      </a>
    </div>
  );
}

export default SectionHeader; 