import { ArrowLeft, Code2, Github, Globe, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";

const About = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl space-y-6">

        <button
          onClick={() => navigate("/settings")}
          className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to Settings
        </button>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-8">

          <div className="mb-8 flex items-center gap-4">

            <div className="rounded-3xl bg-gradient-to-br from-blue-500 to-violet-500 p-5">
              <Info size={34} />
            </div>

            <div>
              <h1 className="text-3xl font-black">
                About SkillSphere
              </h1>

              <p className="mt-1 text-slate-400">
                Hyperlocal Freelance Marketplace
              </p>
            </div>

          </div>

          <div className="space-y-5">

            <InfoCard
              icon={Code2}
              title="Version"
              value="1.0.0"
            />

            <InfoCard
              icon={Globe}
              title="Technology"
              value="React • Node.js • Express • MongoDB • Socket.io"
            />

            <InfoCard
              icon={Github}
              title="Developed For"
              value="Full Stack Development Internship Project"
            />

          </div>

        </section>

      </div>
    </AppLayout>
  );
};

const InfoCard = ({ icon: Icon, title, value }) => (
  <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">

    <div className="flex items-center gap-3">

      <div className="rounded-xl bg-blue-500/10 p-3 text-blue-300">
        <Icon size={20} />
      </div>

      <div>
        <p className="text-sm text-slate-400">
          {title}
        </p>

        <p className="font-bold">
          {value}
        </p>
      </div>

    </div>

  </div>
);

export default About;