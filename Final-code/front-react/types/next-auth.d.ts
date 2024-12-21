import NextAuth from "next-auth";

// Extiende los tipos de NextAuth
declare module "next-auth" {
  interface User {
    role: string;
  }

  interface Session {
    user: User; // Usa el tipo `User` extendido
  }

  interface JWT {
    role: string;
  }
}
