import {
    CreateConversationRequestBody,
    Message,
    InvalidRequest
} from "./requestSchemaValidation";

function formatItem(label: string, content: string | undefined | null): string {
  return content ? `
    <h4> ${label} </h4>
    <p> ${content} </p>
    <br/>
  ` : "";
}

function formatChatHistory(messages: Message[] | undefined | null): string {
  if(!messages) return "";

  let formattedHistory = "<h4 style='margin-bottom: .4rem;'><u> Chat History </u></h4>";

  messages.forEach((message) => {
    // Determine if the message is from User or AI Assistant
    if (message.role === "user") {
      formattedHistory += "<h6 style='font-size: .9rem;'> Question </h6>";
    } else {
      formattedHistory += "<h6 style='font-size: .9rem;'> Answer </h6>";
    }

    // Add message content
    formattedHistory += `<p> ${message.content} </p><br/>`;
  });

  return formattedHistory;
}

// Create a conversation with the Help Scout API
export async function createConversationTicket(
  body: CreateConversationRequestBody,
  accessToken: string
) {
  const { formDetails, chatSession, client } = body;

  if (!process.env.HELPSCOUT_MAILBOX_ID) throw new Error("HELPSCOUT_MAILBOX_ID is undefined");
  const mailboxId = parseInt(process.env.HELPSCOUT_MAILBOX_ID, 10);

  const hasInitialMessage = chatSession && chatSession.messages.length > 0;
  const subject = hasInitialMessage ? chatSession?.messages[0].content : formDetails.additionalDetails  // subject of the conversation

  if(!subject) throw new InvalidRequest("Please provide at least one user message or additional details");

  const data = {
    subject,
    customer: {
      email: formDetails.email,
      firstName: formDetails.firstName,
    },
    mailboxId,
    type: 'email', 
    status: 'active', 
    threads: [
      { // shows as initial message of conversation
        type: "customer",
        customer: {
          email: formDetails.email,
        },
        text: `
          ${formatItem("Additional details", formDetails.additionalDetails)}
          ${formatChatHistory(chatSession?.messages)}
        `
      },
      { // internal facing details
        type: "note",
        text: `
          ${formatItem("Inkeep AI Chat Session ID", chatSession?.chatSessionId)}
          ${formatItem("Client (Interaction Point)", client.currentUrl)}
        `,
      }
    ],
  };

  const res = await fetch("https://api.helpscout.net/v2/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`, // Include Basic Auth header
    },
    body: JSON.stringify(data),
  });

  const conversationId = res.headers.get("Resource-ID");

  if (!res.ok || !conversationId) {
    throw res
  }

  return res
}