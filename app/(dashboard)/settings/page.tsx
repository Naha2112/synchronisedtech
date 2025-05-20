import { getUserData } from "@/app/actions/auth"
import { SettingsClient } from "./SettingsClient"

export default async function SettingsPage() {
  // Get user data
  let user;
  try {
    const userResponse = await getUserData();
    user = userResponse.user;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }

  return <SettingsClient userData={user} />
} 