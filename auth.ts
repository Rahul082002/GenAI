import db from "@/lib/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "abc@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      // TODO: User credentials type from next-aut
      async authorize(credentials: any) {
        // Do zod validation, OTP validation here
        const hashedPassword = await bcrypt.hash(credentials.password, 10);
        const existingUser = await db.user.findFirst({
          where: {
            email: credentials.email,
          },
        });

        if (existingUser) {
          console.log(`Password from DB is: ${existingUser.password}`);
          console.log(`Raw Password from User is: ${credentials.password}`);
          console.log(`Hashed Password from User is: ${hashedPassword}`);
          const passwordValidation = await bcrypt.compare(
            credentials.password,
            existingUser.password
          );
          if (passwordValidation) {
            return {
              id: existingUser.id.toString(),
              email: existingUser.email,
            };
          }
          return null;
        }

        try {
          console.log("Creating New User");
          const user = await db.user.create({
            data: {
              email: credentials.email,
              password: hashedPassword,
            },
          });

          return {
            id: user.id.toString(),
            email: user.email,
          };
        } catch (e) {
          console.error({
            message: "Error creating new user",
            error: e,
          });
        }

        return null;
      },
    }),
  ],
  secret: process.env.JWT_SECRET || "secret",
  callbacks: {
    // TODO: can u fix the type here? Using any is bad
    async session({ token, session }: any) {
      session.user.id = token.sub;

      return session;
    },
  },
};
