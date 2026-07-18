//gigcards
import {
  Bookmark,
  Clock3,
  IndianRupee,
  MapPin,
  ArrowUpRight,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";

const GigCard = ({ gig }) => {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-400/40 hover:shadow-2xl hover:shadow-blue-500/10">

      {gig?.isFeatured && (
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-400 px-3 py-1 text-xs font-bold text-white">
          <Star size={12} fill="white" />
          Featured
        </div>
      )}

      <div className="h-2 bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400" />

      <div className="p-6">

        <div className="mb-5 flex items-start justify-between gap-4">

          <div>
            <h2 className="line-clamp-2 text-xl font-bold text-white">
              {gig.title}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {gig.category}
            </p>
          </div>

          <button className="rounded-2xl border border-white/10 bg-white/10 p-3 transition hover:bg-blue-500">
            <Bookmark size={18} />
          </button>

        </div>

        <p className="line-clamp-3 text-sm leading-6 text-slate-300">
          {gig.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {gig.skillsRequired?.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">

          <div className="flex items-center gap-2 text-sm">
            <IndianRupee size={17} className="text-green-400" />
            <span className="font-semibold text-white">
              {gig.budget?.min?.toLocaleString()} -
              {gig.budget?.max?.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <MapPin size={17} className="text-cyan-400" />
            <span className="text-slate-300">
              {gig.location?.remote
                ? "Remote"
                : gig.location?.city}
            </span>
          </div>

        </div>

        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">

          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Clock3 size={16} />
            Recently Posted
          </div>

          <Link
            to={`/gigs/${gig.slug || gig._id}`}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-2 text-sm font-bold text-white transition hover:scale-105"
          >
            View
            <ArrowUpRight size={16} />
          </Link>

        </div>

      </div>

    </article>
  );
};

export default GigCard;