export const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
}) => {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          error ? "border-red-500" : "border-slate-300"
        }`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
