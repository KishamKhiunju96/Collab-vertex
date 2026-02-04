import { RegisterResponse } from "@/types/aauth";

/**
 * Handle registration response from the backend.
 * Since the backend sets HttpOnly cookies, no need to manually save auth token.
 */
const handleRegister = (data: RegisterResponse | null | undefined) => {
  if (!data) {
    console.warn("No registration data received");
    return;
  }

  console.log("REGISTER RESPONSE:", data);

  if (data.success) {
    console.log("Registration successful. Proceed to OTP verification if required.");
  } else {
    console.warn("Registration response indicates failure:", data.message);
  }
};

export { handleRegister };
