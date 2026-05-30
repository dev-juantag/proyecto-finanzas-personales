export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
          <div className="h-4 w-64 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
        </div>
        <div className="h-10 w-40 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-slate-100 dark:bg-slate-900 rounded-xl"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-slate-100 dark:bg-slate-900 rounded"></div>
                <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* List Skeleton */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 space-y-4">
        <div className="h-6 w-40 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-700/50 last:border-0">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-slate-100 dark:bg-slate-900 rounded-lg"></div>
              <div className="space-y-1">
                <div className="h-4 w-32 bg-slate-100 dark:bg-slate-900 rounded"></div>
                <div className="h-3 w-20 bg-slate-50 dark:bg-slate-900/50 rounded"></div>
              </div>
            </div>
            <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
