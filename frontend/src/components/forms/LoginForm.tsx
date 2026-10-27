import useLoginForm from "@/hooks/use-login-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "../ui/spinner";
import { Controller } from "react-hook-form";

export default function LoginForm() {
  const { isSubmitting, isValid, onSubmit, control } = useLoginForm();

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      {import.meta.env.VITE_HOSTED === "1" && (
        <div className="rounded-lg border bg-muted p-3 text-sm">
          <strong>Shared testing demo</strong>
          <p>Sign in with student@uniconnect.test and password UniConnect123!.</p>
          <p>Sample data is shared by everyone. Registration and uploads are disabled.</p>
        </div>
      )}
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Welcome Back!</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email and password below to login to your account
          </p>
        </div>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">E-Mail</FieldLabel>
              <Input
                {...field}
                id="email"
                aria-invalid={fieldState.invalid}
                placeholder="m@example.com"
                type="email"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                {...field}
                id="password"
                aria-invalid={fieldState.invalid}
                type="password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <Button type="submit" disabled={isSubmitting || !isValid}>
            {isSubmitting ? "Logging in" : "Login"}
            {isSubmitting && <Spinner />}
          </Button>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="underline underline-offset-4">
              Sign up
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
