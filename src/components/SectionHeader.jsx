// src/components/SectionHeader.jsx
function SectionHeader({ title, moreTo = "#", className = "" }) {
  return (
    <div className={`flex items-end justify-between mb-4 px-4 md:px-6 ${className}`}>
      <h2 className="text-[22px] font-bold tracking-tight text-white">{title}</h2>
      <a
        href={moreTo}
        className="flex items-center gap-1 text-sm text-white/70 hover:text-white"
      >
        더보기 <span aria-hidden>›</span>
      </a>
    </div>
  );
}

export default SectionHeader;
