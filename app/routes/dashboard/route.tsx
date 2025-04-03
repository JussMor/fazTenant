import { Link, Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Surreal } from "surrealdb";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "~/lib/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  component: SignIn, // This is the sign-in page
  // beforeLoad: async ({ context }) => {
  //   if (!context.user) {
  //     throw redirect({ to: "/signin" });
  //   }

  //   // `context.queryClient` is also available in our loaders
  //   // https://tanstack.com/start/latest/docs/framework/react/examples/start-basic-react-query
  //   // https://tanstack.com/router/latest/docs/framework/react/guide/external-data-loading
  // },
});

// function DashboardLayout() {
//   return (
//     <div className="flex flex-col gap-4 p-4">
//       <h1 className="text-4xl font-bold">Dashboard Layout</h1>
//       <div className="flex items-center gap-2">
//         This is a protected layout:
//         <pre className="rounded-md border bg-card p-1 text-card-foreground">
//           routes/dashboard/route.tsx
//         </pre>
//       </div>

//       <Button type="button" asChild className="w-fit" size="lg">
//         <Link to="/">Back to Home</Link>
//       </Button>

//       <Outlet />
//     </div>
//   );
// }



// Create and connect the DB instance once
const db = new Surreal();

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const connect = async () => {
      try {


        await db.connect("wss://united-viper-06au59aabpp7d03fme5r7n5an0.aws-use1.surreal.cloud", {
          namespace: "mvp",
          database: "mvp-dev",
        });
  //                await db.signup({
  //     namespace: 'mvp',
  //     database: 'mvp-dev',
  //     access: 'user', 
  //     variables: {
  //       name: "Junior Developer", 
  //       email: "junior@example.com",
  //       password: "password123",
  //       org_name: "Example Org",
  //     }   
  // }) 
        console.log("Connected to SurrealDB");
      } catch (err) {
        console.error("Connection error:", err);
      }
    };

    connect();
     
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await db.signin({
        namespace: "mvp",
        database: "mvp-dev",
        access: "user",
        variables: {
          email: email,
          password: password,
        }
      });

      navigate({ to: "/dashboard" });
    } catch (err) {
      console.error("Sign-in error:", err);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <form onSubmit={handleSignIn} className="flex flex-col gap-4 w-80">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded p-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded p-2"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full">Sign In</Button>
      </form>
    </div>
  );
}

