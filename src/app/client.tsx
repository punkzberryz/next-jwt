"use client";

import { Button } from "@/components/ui/button";

const Client = () => {
  const getMe = async () => {
    const resp = await fetch("/api/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!resp.ok) {
      console.log("Error", resp.status);
    }
    const data = await resp.json();
    console.log(data);
  };
  const renewToken = async () => {
    const resp = await fetch("/api/auth/token", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (resp.ok) {
      console.log("Token renewed");
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <Button onClick={renewToken}>Renew accesstoken</Button>
      <Button onClick={getMe}>Get me</Button>
    </div>
  );
};

export default Client;
