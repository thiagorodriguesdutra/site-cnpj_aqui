"use client";

import { forwardRef } from "react";
import { formatCNPJ } from "@/lib/utils";
import { Input } from "./input";

export interface CnpjInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}

export const CnpjInput = forwardRef<HTMLInputElement, CnpjInputProps>(
  ({ onChange, value, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCNPJ(e.target.value);
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: formatted,
        },
      };
      onChange?.(syntheticEvent);
    };

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        inputMode="numeric"
        value={value}
        onChange={handleChange}
        placeholder="00.000.000/0000-00"
        maxLength={18}
      />
    );
  },
);

CnpjInput.displayName = "CnpjInput";
