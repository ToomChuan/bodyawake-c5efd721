interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="px-5 pb-4 pt-12">
      <h1 className="text-[26px] font-semibold leading-tight text-foreground">{title}</h1>
      {subtitle && (
        <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
      )}
    </header>
  );
}
