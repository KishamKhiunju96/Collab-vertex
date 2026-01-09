import { saveToken } from "@/utils/authToken";

export async function handleLogin(response: any): Promise<boolean> {
  try {
    const token = response?.access_token;

    if (!token) {
      console.error("No access_token found in login response", response);
      return false;
    }

    saveToken(token);
    console.log("Token saved successfully:", token);

    return true;
  } catch (err) {
    console.error("handleLogin error:", err);
    return false;
  }
}
