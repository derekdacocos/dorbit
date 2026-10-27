type WidgetCardProps = {
  title: string;
  children: React.ReactNode;
  className?: string; // optional extra classes, like a wider column span
};

export default function WidgetCard({
  title,
  children,
  className = "",
}: WidgetCardProps) {
  return (
    <section
      className={`flex h-full min-h-80 flex-col rounded-2xl glass border border-white/10 p-5 backdrop-blur-md ${className}`}
    >
      <h2 className="mb-4 text-sm font-semibold tracking-widest text-slate-400 uppercase">
        {title}
      </h2>
      <div className="flex flex-1 flex-col">{children}</div>
    </section>
  );
}