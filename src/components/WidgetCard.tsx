type WidgetCardProps = {
  title: string;
  children: React.ReactNode;
};

export default function WidgetCard({ title, children }: WidgetCardProps) {
  return (
    <section className="flex min-h-80 flex-col rounded-2xl border border-white/10 bg-white/5 p-5">
      <h2 className="mb-4 text-sm font-semibold tracking-widest text-slate-400 uppercase">
        {title}
      </h2>
      <div className="flex flex-1 flex-col">{children}</div>
    </section>
  );
}