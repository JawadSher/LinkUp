import React, { useState, useTransition } from "react";
import { z } from "zod";
import { register, handleSubmit } from "react-hook-form";
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


const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(10, "Password must be at least 10 characters long"),
});

const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters long")
    .max(40, "First name must be less than 40 characters"),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters long")
    .max(40, "Last name must be less than 40 characters"),

  email: z.string().email("Invalid email address"),
  password: z.string().min(10, "Password must be at least 10 characters long"),
  channelName: z
    .string()
    .max(30, "Channel name must be less than 30 characters"),
  avatar: z.instanceof(File).optional,
  bannerImage: z.instanceof(File).optional,
});


const AuthForm = ({ mode = "login" }) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  const onSubmit = (data) => {
    startTransition(async () => {
      console.log(data);
    })
  };

  const schema = mode === "login" ? loginSchema : registerSchema;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      channelName: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {mode === "register" && (
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="firstName">First Name</FormLabel>
                <FormControl>
                  <Input
                    {...register("firstName")}
                    id="firstName"
                    placeholder="Enter first name"
                    {...field}
                  />
                </FormControl>
                <FormMessage>{errors?.firstName?.message}</FormMessage>
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
                  <Input
                    {...register("lastName")}
                    id="lastName"
                    placeholder="Enter last name"
                    {...field}
                  />
                </FormControl>
                <FormMessage>{errors?.lastName?.message}</FormMessage>
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email">Username</FormLabel>
              <FormControl>
                <Input
                  {...register("email")}
                  id="email"
                  placeholder="Enter email address"
                  {...field}
                />
              </FormControl>
              <FormMessage>{errors?.email?.message}</FormMessage>
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
                    {...register("channelName")}
                    id="channelName"
                    placeholder="Enter channel name"
                    {...field}
                  />
                </FormControl>
                <FormMessage>{errors?.channelName?.message}</FormMessage>
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="password">Password</FormLabel>
              <FormControl>
                <Input {...register("password")} id="password" placeholder="Enter password" {...field} />
              </FormControl>
              {mode === "register" && (
                <PasswordStrength password={field.value} />
              )}
              <FormMessage>{errors?.password?.message}</FormMessage>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
          {mode === "login" ? "Login" : "Register"}
        </Button>
      </form>
    </Form>
  );
};

export default AuthForm;
