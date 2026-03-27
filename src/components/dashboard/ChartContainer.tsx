import type { ReactNode } from "react";
import Card from "../ui/Card";

export default function ChartContainer({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <Card className="p-6 fade-in">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
      </div>
      <div className="h-[240px] max-h-[240px]">{children}</div>
    </Card>
  );
}
