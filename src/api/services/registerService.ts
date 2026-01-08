import { saveToken } from "@/utils/authToken";
import router from "next/router";

const handleRegister = async (data: any) => {
  try {

    console.log("REGISTER RESPONSE ", data);

    const token = data?.token;

    if (!token) {
      console.error(" Token missing in response");
      return;
    }

    saveToken(token);

    console.log(" Token saved to localStorage");

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    router.push("/login");

  } catch (error) {
    console.error(" Registration error:", error);
  }

};
export { handleRegister };