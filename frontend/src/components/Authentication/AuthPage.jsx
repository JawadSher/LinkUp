import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AuthForm from "./AuthForm"; // Import the correct AuthForm component

const AuthPage = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side: Authentication Card */}
      <div className="bg-gray-100 min-w-[50%] flex items-center justify-center">
        <Card className="w-full max-w-md border-2 pt-2">
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="login" className="w-[50%]">Login</TabsTrigger>
                <TabsTrigger value="register" className="w-[50%]">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <AuthForm mode="login" />
              </TabsContent>
              <TabsContent value="register">
                <AuthForm mode="register" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Right Side: Welcome Section */}
      <div className="bg-gray-600 min-w-[50%] flex items-center justify-center p-12">
        <div className="max-w-md text-white">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to Our Platform
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Join thousands of users who trust our platform for managing their
            daily tasks and projects. Experience seamless collaboration and
            boost your productivity.
          </p>
          <div className="mt-8 space-y-4">
            {[
              "Secure and reliable platform",
              "Easy to get started",
              "Lightning fast performance",
            ].map((text, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        index === 0
                          ? "M5 13l4 4L19 7"
                          : index === 1
                          ? "M12 6v6m0 0v6m0-6h6m-6 0H6"
                          : "M13 10V3L4 14h7v7l9-11h-7z"
                      }
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-300">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
