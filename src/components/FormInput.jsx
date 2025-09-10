// src/components/FormInput.jsx
export default function FormInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  error = "",
}) {
  return (
    <label className="block mb-3">
      <span className="block mb-1 text-sm text-white/80">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg border px-3 py-2 bg-white/90 text-gray-900 outline-none
        ${error ? "border-red-400" : "border-transparent"} focus:ring-2 focus:ring-indigo-300`}
      />
      {error ? (
        <span className="mt-1 text-xs text-red-400 block">{error}</span>
      ) : null}
    </label>
  );
}
