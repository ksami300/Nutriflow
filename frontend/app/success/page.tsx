export default function Success() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-md">
        <div className="rounded-[32px] border border-slate-800 bg-slate-900/95 p-8 shadow-[0_35px_90px_-40px_rgba(15,23,42,0.75)] text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-emerald-500/10 px-4 py-1 text-sm text-emerald-200">
            Success
          </div>
          <h1 className="mt-6 text-3xl font-semibold text-white">Payment completed</h1>
          <p className="mt-4 text-slate-400">Your premium subscription is active. Thank you for upgrading!</p>
        </div>
      </div>
    </div>
  );
}
