import { createFileRoute } from '@tanstack/react-router'
import { useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useState } from "react";
import { Input } from "~/lib/components/ui/input";
import { Button } from "~/lib/components/ui/button";
import { Card, CardContent } from "~/lib/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute('/user/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [form, setForm] = useState({ name: "", email: "", authId: "", password: "" });

  const createUser = useAction(api.user.createUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(form);
      setForm({ name: "", email: "", authId: "", password: "" });
      toast.success("User created successfully");
    } catch (error: any) {
      try {
        const parsed = JSON.parse(error.message);
        toast.error(parsed.message || "Something went wrong");
      } catch {
        toast.error(error.message || "Something went wrong");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Card className="max-w-md mx-auto mt-10 p-4">
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">Create User</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input name="authId" placeholder="Auth ID" onChange={handleChange} value={form.authId} required />
          <Input name="email" placeholder="Email" onChange={handleChange} value={form.email} required />
          <Input name="name" placeholder="Name" onChange={handleChange} value={form.name} required />
          <Input name="password" type="password" placeholder="Password" onChange={handleChange} value={form.password} required />
          <Button type="submit" >Create User</Button>
        </form>
      </CardContent>
    </Card>
  );
}