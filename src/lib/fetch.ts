import { API_URL } from "@/constants/api";

export const post = (route: string) => {
  const res = fetch(`${API_URL}/${route}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  console.log(res);
};
