interface DashboardShellProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardShell({
  children,
  className,
}: DashboardShellProps) {
  return (
    <div className="flex-1 items-start p-6 md:p-8">
      <div className="flex flex-col gap-6">
        {children}
      </div>
    </div>
  );
} 