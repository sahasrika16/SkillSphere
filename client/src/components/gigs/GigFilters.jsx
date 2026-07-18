import { Filter, Search, SlidersHorizontal, X } from "lucide-react";

const categories = [
  "Web Development",
  "App Development",
  "Graphic Design",
  "Content Writing",
  "Digital Marketing",
  "Data Entry"
];

const levels = ["beginner", "intermediate", "expert"];

const GigFilters = ({ filters, setFilters, onApply, onReset }) => {
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <aside className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 backdrop-blur-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <SlidersHorizontal size={20} className="text-blue-300" />
            Smart Filters
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Find gigs that match your skills.
          </p>
        </div>

        <button
          onClick={onReset}
          className="rounded-xl bg-white/10 p-2 text-slate-300 hover:bg-red-500 hover:text-white"
        >
          <X size={17} />
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-300">
            Search
          </label>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
            <Search size={18} className="text-slate-500" />
            <input
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              placeholder="React, logo, website..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-300">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => updateFilter("category", e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category} className="bg-slate-950">
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-300">
            Skills
          </label>
          <input
            value={filters.skills}
            onChange={(e) => updateFilter("skills", e.target.value)}
            placeholder="react, node, design"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Min ₹
            </label>
            <input
              type="number"
              value={filters.minBudget}
              onChange={(e) => updateFilter("minBudget", e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Max ₹
            </label>
            <input
              type="number"
              value={filters.maxBudget}
              onChange={(e) => updateFilter("maxBudget", e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-300">
            Experience Level
          </label>
          <div className="grid gap-2">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => updateFilter("experienceLevel", level)}
                className={`rounded-2xl px-4 py-3 text-left text-sm capitalize transition ${
                  filters.experienceLevel === level
                    ? "bg-blue-500 text-white"
                    : "bg-white/10 text-slate-300 hover:bg-white/15"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onApply}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 py-3 font-bold shadow-lg shadow-blue-500/20 transition hover:scale-[1.02]"
        >
          <Filter size={18} />
          Apply Filters
        </button>
      </div>
    </aside>
  );
};

export default GigFilters;