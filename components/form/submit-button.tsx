"use client"

import { useFormContext } from "@/hooks/form-context"
import { type ButtonHTMLAttributes } from "react"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "link"
    | "secondary"
    | "destructive"
  size?: "default" | "sm" | "lg" | "icon" | "xs"
}

export function SubmitButton({
  variant = "default",
  size = "default",
  disabled,
  className,
  children,
  ...props
}: SubmitButtonProps) {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button
          type="submit"
          disabled={isSubmitting || disabled}
          variant={variant}
          size={size}
          className={className}
          {...props}
        >
          {isSubmitting ? <Spinner /> : children}
        </Button>
      )}
    </form.Subscribe>
  )
}
