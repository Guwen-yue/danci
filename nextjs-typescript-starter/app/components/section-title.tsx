export default function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-3.5 w-1 rounded-full bg-accent" />
      <h2 className="text-[15px] font-bold">{children}</h2>
    </div>
  );
}
