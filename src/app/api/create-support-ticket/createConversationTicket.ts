import tokenDataMap from "@/static/data";
import {
    ConversationRequestData,
    ConversationStatus,
    ConversationType,
    CreateConversationRequestBody
} from "@/types/create-conversation.types";
import serializeTicketContent from "./serializeConversationContent";

// Send POST request to Help Scout API
export async function createConversationTicket(
  body: CreateConversationRequestBody
) {
  // Auth token from environment variable
  const authToken = tokenDataMap.get("accessToken");

  if (!authToken) {
    throw new Error("Missing access token!");
  }

  const { ai_annotations, form_details, chat_session } = body;

  // API endpoint for creating conversations
  const urlCreateConversations = "https://api.helpscout.net/v2/conversations";

  // Mailbox ID from environment variable
  const mailboxId = +process.env.HELPSCOUT_MAILBOX_ID!;

  // Prepare data for creating a conversation
  const data: ConversationRequestData = {
    subject: ai_annotations.question_summary,
    customer: {
      email: form_details.email,
      firstName: form_details.name,
    },
    mailboxId,
    type: ConversationType.Email, // Conversation type: Email
    status: ConversationStatus.Active, // Conversation status: Active
    threads: [
      {
        type: "customer",
        customer: {
          email: form_details.email,
        },
        text: serializeTicketContent(
          // Serialize conversation content
          ai_annotations,
          form_details,
          chat_session
        ),
      },
    ],
  };

  return fetch(urlCreateConversations, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`, // Include Basic Auth header
    },
    body: JSON.stringify(data),
  });
}
