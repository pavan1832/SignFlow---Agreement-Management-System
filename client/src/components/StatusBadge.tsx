import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: "Draft" | "Sent" | "Signed";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    Draft: "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200",
    Sent: "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200",
    Signed: "bg-green-100 text-green-700 hover:bg-green-200 border-green-200",
  };

  return (
    <Badge variant="outline" className={`${variants[status]} border font-medium px-3 py-1 ${className}`}>
      {status}
    </Badge>
  );
}
