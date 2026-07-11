import InteractivePlanDemo from "./components/InteractivePlanDemo";

const socialProof = ["1,204 plans generated today", "4.9/5 rating", "Daily macros delivered"];

const features = [
  {
    title: "AI Meal Plans",
    description: "Personalized weekly nutrition built for your goals and schedule.",
  },
  {
    title: "Smart Grocery List",
    description: "Automatically generated shopping lists that save time and reduce waste.",
  },
  {
    title: "Weekly Planning",
    description: "Stay ahead with a full 7-day meal schedule tailored to you.",
  },
  {
    title: "Personalized Nutrition",
    description: "Adaptive recommendations based on your history and preferences.",
  },
];

export default function Home() {
  return (
    <main className="bg-slate-50 text-slate-900">
      <section className="mx-auto min-h-screen max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="max-w-2xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-900 shadow-sm shadow-emerald-200/70">
              AI-powered nutrition for modern lifestyles
            </div>
            <div className="space-y-6">
              <h1 className="text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                Stop guessing what to eat.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
                Let AI build your perfect weekly meal plan, grocery list, and macros in seconds.
              </p>
              <p className="text-base font-medium text-emerald-700">
                No diets. No confusion. Just results.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#interactive-demo"
                className="inline-flex w-full items-center justify-center rounded-3xl bg-slate-950 px-6 py-4 text-base font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 sm:w-auto"
              >
                Get My Plan ?
              </a>
              <a
                href="#example-plan"
                className="inline-flex w-full items-center justify-center rounded-3xl border border-slate-300 bg-white px-6 py-4 text-base font-semibold text-slate-900 transition duration-200 hover:border-slate-400 sm:w-auto"
              >
                See Example Plan
              </a>
            </div>

            <div className="text-center">
              <p className="text-sm text-slate-600">
                ?? Limited time: Get Premium for 9.99/month
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-600 sm:text-base">
              {socialProof.map((item) => (
                <span key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm shadow-slate-200/60">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-48 rounded-[32px] bg-gradient-to-b from-emerald-200/60 to-transparent blur-2xl" />
            <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_30px_120px_rgba(15,23,42,0.08)] sm:p-8">
              <div className="flex items-center justify-between rounded-3xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-slate-900/20">
                <span>NutriFlow Dashboard</span>
                <span className="rounded-full bg-emerald-500 px-3 py-1 text-[0.75rem] uppercase tracking-[0.18em] text-white">
                  Live AI
                </span>
              </div>

              <div className="mt-6 space-y-6" id="example-plan">
                <div className="rounded-[26px] bg-slate-50 p-5 shadow-sm shadow-slate-200/80">
                  <div className="flex items-center justify-between text-sm font-medium text-slate-900">
                    <span>Weekly Meal Plan</span>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-700">7 days</span>
                  </div>
                  <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                    <div className="rounded-3xl bg-white p-4 shadow-sm shadow-slate-100/80">
                      <p className="font-semibold text-slate-900">Mon</p>
                      <p className="mt-2 text-slate-600">Oat bowl, chicken salad, salmon.</p>
                    </div>
                    <div className="rounded-3xl bg-white p-4 shadow-sm shadow-slate-100/80">
                      <p className="font-semibold text-slate-900">Tue</p>
                      <p className="mt-2 text-slate-600">Greek yogurt, quinoa bowl, stir fry.</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[26px] bg-emerald-50 p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Macros</p>
                    <p className="mt-4 text-3xl font-semibold text-slate-950">2,100 kcal</p>
                    <p className="mt-2 text-sm text-slate-600">Protein 130g  Carbs 215g  Fat 68g</p>
                  </div>
                  <div className="rounded-[26px] bg-slate-900 p-5 text-white">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">Grocery list</p>
                    <ul className="mt-4 space-y-2 text-sm text-slate-100">
                      <li>Avocado</li>
                      <li>Spinach</li>
                      <li>Chicken</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16" id="interactive-demo">
        <div className="mx-auto max-w-4xl px-6 sm:px-8 lg:px-12">
          <InteractivePlanDemo />
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-4 text-center text-slate-700 sm:flex-row sm:items-center sm:justify-center sm:gap-10">
            <span className="text-sm uppercase tracking-[0.24em] text-slate-500">Trusted by</span>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-slate-900">
              <span>1,000+ users</span>
              <span className="hidden sm:inline"></span>
              <span>Healthy professionals</span>
              <span className="hidden sm:inline"></span>
              <span>Busy families</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">What NutriFlow does</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Everything you need to stay consistent.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60 transition duration-200 hover:-translate-y-1 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <span className="text-xl">?</span>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-950">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
