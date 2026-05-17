"use server"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"

export async function signInWithGoogle() {
  const supabase = await createClient()
  const origin = (await headers()).get("origin")

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback` },
  })

  if (data.url) redirect(data.url)
}

export async function signInWithFacebook() {
  const supabase = await createClient()
  const origin = (await headers()).get("origin")

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "facebook",
    options: { redirectTo: `${origin}/auth/callback` },
  })

  if (data.url) redirect(data.url)
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }

  // Ensure Prisma record exists for email users too
  if (data.user) {
    await prisma.user.upsert({
      where: { authId: data.user.id },
      update: {},
      create: {
        authId: data.user.id,
        email: data.user.email!,
        firstName: "",
        lastName: "",
        provider: "email",
      },
    })
  }

  return { success: true }
}

export async function signUpWithEmail(email: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) return { error: error.message }

  return { success: true }
}