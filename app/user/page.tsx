import { Metadata } from 'next'
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { UserProfileClient } from '@/components/user/UserProfileClient'

export const metadata: Metadata = {
  title: 'User Dashboard — Mashini Fine Motors',
  description: 'Manage your profile, vehicle listings, auto insurance policies, and buyer inquiries.',
}

export default async function UserPage() {
  const user = await currentUser()

  if (!user) {
    redirect("/login")
  }

  return <UserProfileClient userId={user.id} />
}
