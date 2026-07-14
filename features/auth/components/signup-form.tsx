"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthActions } from "@convex-dev/auth/react"
import { z } from "zod"
import { useAppForm } from "@/hooks/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field"

const signupSchema = z
  .object({
    name: z.string().min(1, "Required"),
    email: z.email("Enter a valid email"),
    password: z.string().min(8, "Must be at least 8 characters long"),
    confirmPassword: z.string().min(1, "Required"),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter()
  const { signIn } = useAuthActions()

  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: signupSchema,
    },
    onSubmit: async ({ value }) => {
      await signIn("password", {
        name: value.name,
        email: value.email,
        password: value.password,
        flow: "signUp",
      })
      router.push("/calendar")
    },
  })

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            form.handleSubmit()
          }}
        >
          <form.AppForm>
            <FieldGroup>
              <form.AppField name="name">
                {(field) => (
                  <field.TextField
                    label="Full Name"
                    autoComplete="name"
                    placeholder="John Doe"
                  />
                )}
              </form.AppField>
              <form.AppField name="email">
                {(field) => (
                  <field.TextField
                    label="Email"
                    type="email"
                    autoComplete="email"
                    placeholder="m@example.com"
                    description="We'll use this to contact you. We will not share your email with anyone else."
                  />
                )}
              </form.AppField>
              <form.AppField name="password">
                {(field) => (
                  <field.TextField
                    label="Password"
                    type="password"
                    autoComplete="new-password"
                    description="Must be at least 8 characters long."
                  />
                )}
              </form.AppField>
              <form.AppField name="confirmPassword">
                {(field) => (
                  <field.TextField
                    label="Confirm Password"
                    type="password"
                    autoComplete="new-password"
                    description="Please confirm your password."
                  />
                )}
              </form.AppField>
              <Field>
                <form.SubmitButton>Create Account</form.SubmitButton>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link href="/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form.AppForm>
        </form>
      </CardContent>
    </Card>
  )
}
