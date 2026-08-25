export const Button = ({
  children,
  type = "button",
  variant = "primary",
  isLoading = false,
  disabled = false,
  onClick,
  className = "",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary:
      "bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline:
      "border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-50 focus:ring-indigo-500",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};
