"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
// import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLogin } from "@/features/auth/services/auth.api";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/slices/authSlice";
import Image from "next/image";

const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = form;

  const { mutateAsync: login, isPending, error } = useLogin();

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const response = await login(values);
    dispatch(
      setCredentials({
        user: response?.data.user,
        token: response?.data.token,
      })
    );
    router.push("/dashboard");
  };

  return (
    <div className="p-xl rounded-3xl mx-auto w-full max-w-105 bg-card flex flex-col gap-7 shadow-xl">
      <div className="flex flex-col items-center">
        <Image
          src={"/auth/jooav-logo.svg"}
          alt="JOOAV Logo"
          width={90.7}
          height={24}
          className="py-xl"
        />
        <div className="flex flex-col items-center text-center gap-6 font-garantpro">
          <h3 className="text-heading">Super-admin login</h3>
          <p className="text-base text-card-foreground font-medium">
            Log in with your admin credentials.
          </p>
        </div>
      </div>
      <FieldSet>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* EMAIL */}
            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => (
                <div>
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      aria-invalid={fieldState.invalid}
                    />
                  </Field>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </div>
              )}
            />

            {/* PASSWORD */}
            <Controller
              control={control}
              name="password"
              render={({ field, fieldState }) => (
                <div>
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Password</FieldLabel>
                    <Input
                      {...field}
                      type="password"
                      placeholder="••••••••"
                      aria-invalid={fieldState.invalid}
                    />
                  </Field>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </div>
              )}
            />

            {/* SERVER ERROR */}
            {/* {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {(error as any)?.response?.data?.message ||
                    "Login failed. Please try again."}
                </AlertDescription>
              </Alert>
            )} */}

            {/* SUBMIT */}
            <Button
              type="submit"
              className="w-full"
              disabled={!isValid || isPending}
            >
              {isPending ? "Logging in..." : "Login"}
            </Button>
          </FieldGroup>
        </form>
      </FieldSet>
    </div>
  );
}

export default LoginForm;
