import { ThreeElements } from '@react-three/fiber';
interface CloudflareEnv {
    TURSO_URL: string;
    TURSO_AUTH_TOKEN: string;
    RESEND_API_KEY: string;
    RESEND_API_URL: string;
    GOOGLE_CLIENT_SECRET: string;
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: string;
    BETTER_AUTH_URL: string;
    BETTER_AUTH_SECRET: string;
    GITHUB_CLIENT_ID: string;
    GITHUB_CLIENT_SECRET: string;
    TEST_EMAIL: string;
    NODE_ENV: string;
    STRIPE_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
    BETTER_AUTH_EMAIL: string;
}



declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {}
    }
  }
}