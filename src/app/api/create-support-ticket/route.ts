import { createConversationTicket } from "@/helper/createConversationTicket";
import tokenDataMap from "@/static/data";
import { CreateConversationRequestBody } from "@/types/create-conversation.types";
import { NextRequest, NextResponse } from "next/server";

console.log(
  `https://secure.helpscout.net/authentication/authorizeClientApplication?client_id=${process.env.REACT_APP_CLIENT_ID}&state=${process.env.REACT_APP_SECRET_ID}`
);

const urlRefreshAccessToken = "https://api.helpscout.net/v2/oauth2/token";

const refreshAccessToken = async () => {
  try {
    const refresh_token = tokenDataMap.get("refreshToken");

    if (!refresh_token) {
      throw new Error("Missing access token!");
    }

    const client_id = process.env.REACT_APP_CLIENT_ID;
    const client_secret = process.env.REACT_APP_SECRET_ID;

    const data = {
      refresh_token,
      client_id,
      client_secret,
      grant_type: "refresh_token",
    };

    const response = await fetch(urlRefreshAccessToken, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status == 401) {
      throw response;
    }

    const responseData = await response.json();

    tokenDataMap.set("accessToken", responseData.access_token);
    tokenDataMap.set("refreshToken", responseData.refresh_token);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export async function POST(req: NextRequest & CreateConversationRequestBody) {
  try {
    // Parse the request body
    const body: CreateConversationRequestBody = await req.json();

    // try creating conversation
    let response = await createConversationTicket(body);

    // handle unauthorized error
    if (response.status == 401) {
      await refreshAccessToken();
      response = await createConversationTicket(body);
    }

    // throw unsuccessful requests
    if (response.status !== 201) {
      throw response;
    }

    // Return success response
    return new NextResponse(null, {
      status: response.status,
      statusText: "Support ticket created successfully",
    });
  } catch (error) {
    // Log and return error response
    console.error(error);
    return new NextResponse(null, {
      status: 500,
      statusText: "Internal error",
    });
  }
}
