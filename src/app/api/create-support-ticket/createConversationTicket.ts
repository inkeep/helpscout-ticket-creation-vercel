import {
    CreateConversationRequestBody,
    Message
} from "./create-conversation.types";

// Create a conversation with the Help Scout API
export async function createConversationTicket(
  body: CreateConversationRequestBody,
  accessToken: string
) {
  const { form_details, chat_session, client } = body;

  if (!process.env.HELPSCOUT_MAILBOX_ID) throw new Error("HELPSCOUT_MAILBOX_ID is undefined");
  const mailboxId = parseInt(process.env.HELPSCOUT_MAILBOX_ID, 10);

  const initThreadMessage = chat_session.messages[0].content; // subject of the conversation

  const data = {
    subject: initThreadMessage,
    customer: {
      email: form_details.email,
      firstName: form_details.first_name,
    },
    mailboxId,
    type: 'email', 
    status: 'active', 
    threads: [
      { // shows as initial message of conversation
        type: "customer",
        customer: {
          email: form_details.email,
        },
        text: `
          ${formatAdditionalDetails(form_details.additional_details)}
          ${formatChatHistory(chat_session.messages)}
        `
      },
      { // internal facing details
        type: "note",
        text: `
          <h4> Inkeep AI Chat Session ID </h4>
          <p> ${chat_session.chat_session_id} </p>
          </br>
          <h4> Client (Interaction Point)</h4>
          <p> ${client.current_url} </p>
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
    throw new Error(`Failed to create conversation: ${res.statusText}`);
  }

  return res
}

function formatChatHistory(messages: Message[]): string {
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

function formatAdditionalDetails(additionalDetails: string | undefined): string | undefined {
  const formattedDetails = `
    <h4><u> Additional Details </u></h4>
    <p> ${additionalDetails} </p>
    <br>
  `
  return additionalDetails ? formattedDetails : undefined;
}