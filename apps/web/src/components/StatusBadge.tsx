import { Badge } from "@/components/ui/badge";

export type UserStatusValue = "ACTIVE" | "PENDING" | "REJECTED";

type StatusBadgeProps = {
  status: UserStatusValue;
  className?: string;
};

const statusLabels: Record<UserStatusValue, string> = {
  ACTIVE: "Active",
  PENDING: "Pending",
  REJECTED: "Rejected",
};

const statusVariants: Record<UserStatusValue, "success" | "warning" | "destructive"> = {
  ACTIVE: "success",
  PENDING: "warning",
  REJECTED: "destructive",
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  return (
    <Badge variant={statusVariants[status]} className={className}>
      {statusLabels[status]}
    </Badge>
  );
};

export default StatusBadge;
