import { API_URL } from "@/constants/api";
import { cookies } from "next/headers";
import React from "react";

const DashboardPage = async () => {
  const usersRes = await fetch(`${API_URL}/users`, {
    method: "GET",
    headers: {
      Cookie: cookies().toString(),
    },
  });

  const users = await usersRes.json();
  return (
    <div>
      <h1 className="text-2xl">DashboardPage</h1>
      {users?.map((user) => (
        <p key={user.id}>{user.email}</p>
      ))}
    </div>
  );
};

export default DashboardPage;
