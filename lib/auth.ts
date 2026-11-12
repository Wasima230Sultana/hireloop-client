import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { z } from "zod"

const client = new MongoClient(process.env.MONGODB_URI as string)
const db = client.db("hireloopdb")

export const auth = betterAuth({
  user: {
    additionalFields: {
      type: {
        type: ["seeker", "recruiter", "admin"],
        input: true,
        required: true,
        defaultValue: "seeker",
        validator: {
          input: z.enum(["admin", "seeker", "recruiter"]),
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
})
