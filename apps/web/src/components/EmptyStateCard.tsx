import { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EmptyStateCard = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: ReactNode;
}) => {
  return (
    <Card className="border-dashed">
      <CardHeader className="flex flex-row items-center gap-3">
        {icon ? (
          <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            {icon}
          </div>
        ) : null}
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{description}</CardContent>
    </Card>
  );
};

export default EmptyStateCard;
