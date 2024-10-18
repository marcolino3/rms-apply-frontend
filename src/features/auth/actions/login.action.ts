"use server";

import { redirect } from "next/navigation";
import { API_URL } from "@/constants/api";
import { loginFormType } from "../components/login-form";
import { getAuthCookie } from "@/app/auth/login/auth-cookies";
import { cookies } from "next/headers";

export const loginAction = async (values: loginFormType) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    return handleLoginError(res.status);
  }

  const cookie = getAuthCookie(res);
  if (cookie?.accessToken) {
    cookies().set(cookie.accessToken);
  }
  if (cookie?.refreshToken) {
    cookies().set(cookie.refreshToken);
  }
  redirect("/dashboard");
};

const handleLoginError = (errorStatus: number) => {
  if (errorStatus === 401) {
    return { error: "Login inkorrekt!" };
  } else {
    return {
      error:
        "Ein unbekannter Fehler ist aufgetreten. Bitte mit dem Admin in Verbindung setzten.",
    };
  }
};
