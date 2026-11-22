export default function AppLoading() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-8 w-56 rounded-lg skeleton" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-2xl skeleton" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-72 rounded-2xl skeleton lg:col-span-2" />
        <div className="h-72 rounded-2xl skeleton" />
      </div>
    </div>
  );
}