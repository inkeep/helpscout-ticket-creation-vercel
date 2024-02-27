import tokenDataMap from "@/static/data";
import { NextRequest, NextResponse } from "next/server";

const url = "https://api.helpscout.net/v2/oauth2/token";
const client_id = process.env.REACT_APP_CLIENT_ID;
const client_secret = process.env.REACT_APP_SECRET_ID;

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");
    const data = {
      code,
      client_id,
      client_secret,
      grant_type: "authorization_code",
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    tokenDataMap.set("accessToken", responseData.access_token);
    tokenDataMap.set("refreshToken", responseData.refresh_token);

    return new NextResponse(null, {
      status: response.status,
      statusText: "success",
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(null, {
      status: 500,
      statusText: "Internal error",
    });
  }
}
