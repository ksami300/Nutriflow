export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-md">
        <div className="rounded-[32px] border border-slate-800 bg-slate-900/95 p-8 shadow-[0_35px_90px_-40px_rgba(15,23,42,0.75)]">
          <div className="space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Dashboard</p>
            <h1 className="text-3xl font-semibold text-white">Welcome to NutriFlow</h1>
            <p className="text-slate-400">You are logged in and ready to generate premium nutrition plans.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
