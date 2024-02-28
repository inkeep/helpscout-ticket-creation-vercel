export type FormDetails = {
  first_name?: string | null;
  email?: string | null;
  additional_details?: string;
};

type UserMessage = {
  role: "user";
  content: string;
};

type AssistantMessage = {
  role: "assistant";
  content: string;
};

export type Message = UserMessage | AssistantMessage;

export type ChatSession = {
  messages: Message[];
  chat_session_id: string;
};

type Client = {
  current_url: string;
  type: string;
};

export type CreateConversationRequestBody = {
  form_details: FormDetails;
  chat_session: ChatSession;
  client: Client; // Added this line
};