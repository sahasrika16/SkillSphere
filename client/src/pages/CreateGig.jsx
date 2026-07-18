import AppLayout from "../layouts/AppLayout";
import CreateGigForm from "../components/gigs/forms/CreateGigForm";

const CreateGig = () => {
  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl space-y-7">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-blue-950/30 sm:p-8">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-28 left-20 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />

          <div className="relative">
            <p className="text-sm font-bold text-blue-300">Post a New Gig</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">
              Tell freelancers exactly what you need.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
              Create a clear, attractive requirement so the right freelancers can find and apply to your project.
            </p>
          </div>
        </section>

        <CreateGigForm />
      </div>
    </AppLayout>
  );
};

export default CreateGig;