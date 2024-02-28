import { createConversationTicket } from "@/app/api/create-support-ticket/createConversationTicket";
import tokenDataMap from "@/static/data";
import { CreateConversationRequestBody } from "@/types/create-conversation.types";
import { NextRequest, NextResponse } from "next/server";
import { get } from '@vercel/edge-config';

const HELP_SCOUT_TOKEN_KEY = "helpscout_access_token";

// Set access token in Vercel Edge Config using Vercel API
const setAccessTokenInEdgeConfig = async (accessToken: string) => {
  const edgeConfigId = process.env.VERCEL_EDGE_CONFIG_ID;
  const vercelApiToken = process.env.VERCEL_API_ACCESS_TOKEN;

  if (!edgeConfigId || !vercelApiToken) {
    throw new Error("Vercel Edge Config ID or Vercel API Token not found");
  }

  const response = await fetch(`https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${vercelApiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        { "operation": "update", "key": HELP_SCOUT_TOKEN_KEY, "value": accessToken }
      ]
    }),
  });

  const responseData = await response.json();

  if (response.status !== 200 || responseData.status !== "OK") {
    throw new Error(`Failed to write HelpScout access token to Vercel Edge Config: ${response.statusText} - ${JSON.stringify(responseData)}`);
  }
};

// Get access token using client credentials and store it in Vercel Edge Config
const getNewClientCredentialsToken = async () => {
  try {
    const client_id = process.env.HELPSCOUT_APP_ID;
    const client_secret = process.env.HELPSCOUT_APP_SECRET;

    if(!client_id || !client_secret) {
      throw new Error("Client ID or Client Secret not found");
    }

    const response = await fetch("https://api.helpscout.net/v2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id,
        client_secret,
      }).toString(),
    });

    const responseData = await response.json();

    if (response.status !== 200) {
      throw new Error(`Failed to obtain access token: ${response.statusText} - ${responseData}`);
    }

    setAccessTokenInEdgeConfig(responseData.access_token);

    return responseData.access_token;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getAccessToken = async () => {
  try {
    let accessToken = get(HELP_SCOUT_TOKEN_KEY); // get from Vercel Edge Config

    if (!accessToken) {
      accessToken = await getNewClientCredentialsToken();
    }

    return accessToken;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function POST(req: NextRequest & CreateConversationRequestBody) {
  try {
    // Parse the request body
    const body: CreateConversationRequestBody = await req.json();

    const accessToken = await getAccessToken();

    // try creating conversation
    let response = await createConversationTicket(body);

    // token is expired
    if (response.status == 401) {
      await getNewClientCredentialsToken();
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
