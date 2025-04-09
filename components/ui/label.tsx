"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  labelRef?: React.Ref<HTMLLabelElement>;
}

const Label = ({ labelRef, className, ...props }: LabelProps) => (
  <LabelPrimitive.Root
    {...(labelRef ? { ref: labelRef } : {})}
    className={cn(labelVariants(), className)}
    {...props}
  />
);

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };