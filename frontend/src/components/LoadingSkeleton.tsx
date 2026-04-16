"use client";

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
      <div className="space-y-4">
        <div className="h-6 bg-gradient-to-r from-neutral-200 to-neutral-100 rounded-lg w-3/4"></div>
        <div className="h-4 bg-gradient-to-r from-neutral-200 to-neutral-100 rounded-lg w-full"></div>
        <div className="h-4 bg-gradient-to-r from-neutral-200 to-neutral-100 rounded-lg w-5/6"></div>
        <div className="h-8 bg-gradient-to-r from-primary-200 to-accent-light/30 rounded-lg w-1/3 mt-6"></div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonFormInput() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="h-4 bg-gradient-to-r from-neutral-200 to-neutral-100 rounded-lg w-1/4"></div>
      <div className="h-10 bg-gradient-to-r from-neutral-200 to-neutral-100 rounded-lg w-full"></div>
    </div>
  );
}

export function SkeletonHeader() {
  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-neutral-200 p-4 animate-pulse">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="h-8 bg-gradient-to-r from-primary-200 to-accent-light/30 rounded-lg w-32"></div>
        <div className="flex gap-4">
          <div className="h-8 bg-gradient-to-r from-neutral-200 to-neutral-100 rounded-lg w-24"></div>
          <div className="h-8 bg-gradient-to-r from-neutral-200 to-neutral-100 rounded-lg w-20"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-8 animate-pulse">
      <SkeletonHeader />
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="h-32 bg-gradient-to-r from-primary-200 to-accent-light/30 rounded-2xl"></div>
        <div className="space-y-4">
          <div className="h-10 bg-gradient-to-r from-neutral-200 to-neutral-100 rounded-xl w-full"></div>
          <SkeletonGrid count={6} />
        </div>
      </div>
    </div>
  );
}
