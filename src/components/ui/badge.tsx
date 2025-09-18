import * as React from "react";
import { cn } from "@/lib/utils";
import { badgeVariants as _badgeVariants } from "./badge-variants";
import { type VariantProps } from "class-variance-authority";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof _badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(_badgeVariants({ variant }), className)} {...props} />
  );
}
