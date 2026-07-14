"use client"

import { createFormHook } from "@tanstack/react-form"
import { TextField } from "@/components/form/text-field"
import { SubmitButton } from "@/components/form/submit-button"
import { fieldContext, formContext } from "./form-context"

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubmitButton,
  },
})
