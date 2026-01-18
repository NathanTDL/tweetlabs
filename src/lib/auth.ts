import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";

// Create PostgreSQL pool using Supabase DATABASE_URL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const auth = betterAuth({
    database: pool,

    // Email/password disabled - Google only
    emailAndPassword: {
        enabled: false,
    },

    // Google OAuth provider
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },

    // Session configuration
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // 5 minutes
        },
    },

    // Trusted origins
    trustedOrigins: [
        process.env.BETTER_AUTH_URL || "http://localhost:3000",
    ],

    // Plugins
    plugins: [
        nextCookies(), // Required for Next.js Server Components
    ],

    user: {
        additionalFields: {
            bio: {
                type: "string",
                required: false,
            },
            target_audience: {
                type: "string",
                required: false,
            },
            ai_context: {
                type: "string",
                required: false,
            },
        },
    },
});

// Export types for use in components
export type Session = typeof auth.$Infer.Session;
