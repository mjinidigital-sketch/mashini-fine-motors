import { Metadata } from 'next'
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

interface UserPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: UserPageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: `User Profile — Mashini Fine Motors`,
    description: `Manage user profile, vehicle listings, auto insurance policies, and buyer inquiries.`,
  }
}

export default async function UserProfilePage({ params }: UserPageProps) {
  const { id } = await params
  const user = await currentUser()

  // If the user is viewing their own profile, redirect to dashboard
  if (user && (user.id === id)) {
    redirect("/user/me")
  }

  // Otherwise, redirect to dashboard for now (can be expanded later for public profile view)
  redirect("/user/me")
}
