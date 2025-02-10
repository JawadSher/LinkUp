import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import PasswordStrength from "./PasswordStrength";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(10, "Password must be at least 10 characters long"),
});

const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(40),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(40),
  email: z.string().email("Invalid email address"),
  password: z.string().min(10, "Password must be at least 10 characters"),
  channelName: z
    .string()
    .min(2, "Channel name must be at least 2 characters")
    .max(30, "Channel name must be less than 30 characters"),
  avatar: z.instanceof(File).optional(),
  bannerImage: z.instanceof(File).optional(),
});

const AuthForm = ({ mode = "login" }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  const schema = mode === "login" ? loginSchema : registerSchema;
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      channelName: "",
    },
  });

  const onSubmit = (data) => {
    startTransition(async () => {
      console.log(data);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {mode === "register" && (
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="firstName">First Name</FormLabel>
                <FormControl>
                  <Input id="firstName" placeholder="First name" {...field} />
                </FormControl>
                <FormMessage>
                  {form.formState.errors?.firstName?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        )}

        {mode === "register" && (
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="lastName">Last Name</FormLabel>
                <FormControl>
                  <Input id="lastName" placeholder="Last name" {...field} />
                </FormControl>
                <FormMessage>
                  {form.formState.errors?.lastName?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormControl>
                <Input id="email" placeholder="Email address" {...field} />
              </FormControl>
              <FormMessage>{form.formState.errors?.email?.message}</FormMessage>
            </FormItem>
          )}
        />

        {mode === "register" && (
          <FormField
            control={form.control}
            name="channelName"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="channelName">Channel Name</FormLabel>
                <FormControl>
                  <Input
                    id="channelName"
                    placeholder="Channel name"
                    {...field}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors?.channelName?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel htmlFor="password">Password</FormLabel>
              <FormControl>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...field}
                />
              </FormControl>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-7 border-none text-gray-600 hover:bg-transparent active:bg-transparent focus:outline-none"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </Button>

              {mode === "register" && (
                <PasswordStrength password={field.value} className="mt-5" />
              )}
              <FormMessage>
                {form.formState.errors?.password?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "login" ? "Login" : "Register"}
        </Button>
      </form>
    </Form>
  );
};

export default AuthForm;
