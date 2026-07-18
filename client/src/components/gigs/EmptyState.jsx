const EmptyState = ({
  icon: Icon,
  title = "Nothing here yet",
  description = "Once data is available, it will appear here.",
  actionLabel,
  onAction
}) => {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-10 text-center backdrop-blur-xl">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-blue-500/15 text-blue-300">
        {Icon ? <Icon size={28} /> : null}
      </div>

      <h3 className="mt-5 text-xl font-black text-white">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.02]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;