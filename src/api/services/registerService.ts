import { saveToken } from "@/utils/auth";

interface RegisterResponse {
  auth_token?: string;
}

const handleRegister = (data: RegisterResponse | null | undefined) => {
  try {
    if (!data) {
      console.warn("No registration data received");
      return;
    }

    console.log("REGISTER RESPONSE:", data);

    const token = data.auth_token;

    if (token) {
      saveToken(token);
      console.log("Auth token saved");
    } else {
      console.warn(
        "No auth_token found (most likely OTP verification required)",
      );
    }
  } catch (error) {
    console.error("Error while handling registration response:", error);
  }
};

export { handleRegister };
