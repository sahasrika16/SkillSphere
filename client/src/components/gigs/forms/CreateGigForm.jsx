import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, IndianRupee, Loader2, MapPin, Plus, Sparkles, X } from "lucide-react";
import toast from "react-hot-toast";
import { gigService } from "../../../services/gigService";

const categories = [
  "Web Development",
  "App Development",
  "Graphic Design",
  "Content Writing",
  "Digital Marketing",
  "Data Entry",
  "UI/UX Design",
  "Video Editing"
];

const CreateGigForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Web Development",
    subCategory: "",
    skillsRequired: [],
    tags: [],
    pricingType: "fixed",
    budget: {
      min: "",
      max: "",
      currency: "INR"
    },
    experienceLevel: "intermediate",
    deadline: "",
    location: {
      city: "Hyderabad",
      state: "Telangana",
      country: "India",
      remote: true
    },
    visibility: "public"
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateNested = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const addItem = (type, value, clearFn) => {
    const clean = value.trim().toLowerCase();
    if (!clean) return;

    setFormData((prev) => {
      if (prev[type].includes(clean)) return prev;
      return { ...prev, [type]: [...prev[type], clean] };
    });

    clearFn("");
  };

  const removeItem = (type, item) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((value) => value !== item)
    }));
  };

  const validateForm = () => {
    if (formData.title.trim().length < 5) return "Title must be at least 5 characters.";
    if (formData.description.trim().length < 20) return "Description must be at least 20 characters.";
    if (formData.skillsRequired.length === 0) return "Add at least one required skill.";
    if (!formData.budget.min || !formData.budget.max) return "Enter both minimum and maximum budget.";
    if (Number(formData.budget.min) > Number(formData.budget.max)) return "Minimum budget cannot be greater than maximum budget.";
    if (!formData.deadline) return "Select a project deadline.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,
        budget: {
          ...formData.budget,
          min: Number(formData.budget.min),
          max: Number(formData.budget.max)
        }
      };

      const data = await gigService.createGig(payload);
      toast.success("Gig posted successfully!");
      navigate(`/gigs/${data.gig.slug || data.gig._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create gig");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 backdrop-blur-2xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-500/15 text-blue-300">
            <Sparkles size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black">Gig Overview</h2>
            <p className="text-sm text-slate-400">Describe what you need clearly.</p>
          </div>
        </div>

        <div className="grid gap-5">
          <input
            value={formData.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Example: Build a modern portfolio website"
            className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3.5 outline-none focus:border-blue-400"
          />

          <textarea
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Explain project requirements, pages, features, design expectations..."
            rows={6}
            className="resize-none rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3.5 outline-none focus:border-blue-400"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <select
              value={formData.category}
              onChange={(e) => updateField("category", e.target.value)}
              className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3.5 outline-none focus:border-blue-400"
            >
              {categories.map((category) => (
                <option key={category} value={category} className="bg-slate-950">
                  {category}
                </option>
              ))}
            </select>

            <input
              value={formData.subCategory}
              onChange={(e) => updateField("subCategory", e.target.value)}
              placeholder="Sub-category, e.g. Frontend"
              className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3.5 outline-none focus:border-blue-400"
            />
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 backdrop-blur-2xl">
        <h2 className="text-xl font-black">Skills & Tags</h2>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <TagInput
            label="Required Skills"
            value={skillInput}
            setValue={setSkillInput}
            items={formData.skillsRequired}
            onAdd={() => addItem("skillsRequired", skillInput, setSkillInput)}
            onRemove={(item) => removeItem("skillsRequired", item)}
            placeholder="react, node, figma..."
          />

          <TagInput
            label="Tags"
            value={tagInput}
            setValue={setTagInput}
            items={formData.tags}
            onAdd={() => addItem("tags", tagInput, setTagInput)}
            onRemove={(item) => removeItem("tags", item)}
            placeholder="startup, ui, responsive..."
          />
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 backdrop-blur-2xl">
        <h2 className="text-xl font-black">Budget, Deadline & Location</h2>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <FieldIcon icon={IndianRupee}>
            <input
              type="number"
              value={formData.budget.min}
              onChange={(e) => updateNested("budget", "min", e.target.value)}
              placeholder="Min budget"
              className="w-full bg-transparent outline-none"
            />
          </FieldIcon>

          <FieldIcon icon={IndianRupee}>
            <input
              type="number"
              value={formData.budget.max}
              onChange={(e) => updateNested("budget", "max", e.target.value)}
              placeholder="Max budget"
              className="w-full bg-transparent outline-none"
            />
          </FieldIcon>

          <FieldIcon icon={CalendarDays}>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => updateField("deadline", e.target.value)}
              className="w-full bg-transparent outline-none"
            />
          </FieldIcon>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <FieldIcon icon={MapPin}>
            <input
              value={formData.location.city}
              onChange={(e) => updateNested("location", "city", e.target.value)}
              placeholder="City"
              className="w-full bg-transparent outline-none"
            />
          </FieldIcon>

          <select
            value={formData.experienceLevel}
            onChange={(e) => updateField("experienceLevel", e.target.value)}
            className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3.5 outline-none focus:border-blue-400"
          >
            <option value="beginner" className="bg-slate-950">Beginner</option>
            <option value="intermediate" className="bg-slate-950">Intermediate</option>
            <option value="expert" className="bg-slate-950">Expert</option>
          </select>

          <button
            type="button"
            onClick={() => updateNested("location", "remote", !formData.location.remote)}
            className={`rounded-2xl border px-4 py-3.5 font-bold transition ${
              formData.location.remote
                ? "border-blue-400 bg-blue-500/20 text-blue-200"
                : "border-white/10 bg-white/10 text-slate-300"
            }`}
          >
            {formData.location.remote ? "Remote Enabled" : "On-site Only"}
          </button>
        </div>
      </section>

      <button
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 py-4 font-black shadow-lg shadow-blue-500/25 transition hover:scale-[1.01] disabled:opacity-60"
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
        {loading ? "Publishing Gig..." : "Publish Gig"}
      </button>
    </form>
  );
};

const TagInput = ({ label, value, setValue, items, onAdd, onRemove, placeholder }) => (
  <div>
    <label className="mb-2 block text-sm font-bold text-slate-300">{label}</label>

    <div className="flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onAdd();
          }
        }}
        placeholder={placeholder}
        className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 outline-none focus:border-blue-400"
      />
      <button
        type="button"
        onClick={onAdd}
        className="rounded-2xl bg-blue-500 px-4 font-bold hover:bg-blue-600"
      >
        Add
      </button>
    </div>

    <div className="mt-3 flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-300"
        >
          {item}
          <button type="button" onClick={() => onRemove(item)}>
            <X size={13} />
          </button>
        </span>
      ))}
    </div>
  </div>
);

const FieldIcon = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3.5 focus-within:border-blue-400">
    <Icon size={18} className="text-blue-300" />
    {children}
  </div>
);

export default CreateGigForm;