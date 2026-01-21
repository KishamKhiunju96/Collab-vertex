import { saveToken } from "@/utils/3.";

const handleRegister = (data: any) => {
  try {
    console.log("REGISTER RESPONSE:", data);

    const token = data?.auth_token;

    if (token) {
      saveToken(token);
      console.log("Auth token saved");
    } else {
      console.warn("No auth_token found (OTP verification required)");
    }
  } catch (error) {
    console.error("Registration handling error:", error);
  }
};

export { handleRegister };
