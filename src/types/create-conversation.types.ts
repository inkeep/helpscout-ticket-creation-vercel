export type FormDetails = {
  name?: string | null;
  email?: string | null;
  additional_details?: string;
};

export type AIAnnotations = {
  question_type: string;
  question_summary: string;
  gap_summary: string;
  classifiers: {
    is_content_found: boolean;
    is_feature_supported: boolean;
    should_escalate_to_support: boolean;
  };
};

type UserMessage = {
  role: "user";
  content: string;
};

type AssistantMessage = {
  role: "assistant";
  content: string;
};

type Message = UserMessage | AssistantMessage;

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
  ai_annotations: AIAnnotations;
  client: Client; // Added this line
};

type Attachments = {
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
};

type ChatThread = {
  type: string; // Required ("customer")
  text: string; // Required - The chat text
  customer: Customer; // Required - Customer associated with the chat.
  imported?: boolean; // The imported field enables thread to be created for historical purposes
  createdAt?: string; // Optional creation date to be used when importing conversations and threads.
  attachments?: Attachments[]; // 	Optional list of attachments to be attached to this thread
};

export default ChatThread;

type Field = {
  id: number;
  value: string;
};

// Enum for photo type
enum PhotoType {
  Unknown = "unknown",
  Gravatar = "gravatar",
  Twitter = "twitter",
  Facebook = "facebook",
  GoogleProfile = "googleprofile",
  GooglePlus = "googleplus",
  LinkedIn = "linkedin",
  Instagram = "instagram",
}

// Enum for conversation type
export enum ConversationType {
  Chat = "chat",
  Email = "email",
  Phone = "phone",
}

// Enum for conversation status
export enum ConversationStatus {
  Active = "active",
  Closed = "closed",
  Pending = "pending",
}

type Customer = {
  id?: number; // Customer ID
  email?: string | null; // Customer’s email
  firstName?: string | null; // First name of the customer.
  lastName?: string; // Last name of the customer.
  phone?: string; // Last name of the customer.
  photoUrl?: string; // URL of the customer’s photo. Max length 200 characters.
  jobTitle?: string; // URL of the customer’s photo. Max length 200 characters.
  photoType?: PhotoType; // Type of photo.
  background?: string; // This is the Notes field from the user interface. Max length 200 characters.
  location?: string; // Location of the customer. Max length 60 characters.
  organization?: string; // 	Organization. Max length 60 characters.
  gender?: "male" | "female" | "unknown"; // Gender of this customer.
  age?: string; // Customer’s age
};

export type ConversationRequestData = {
  subject: string; // Required - Conversation’s subject
  autoReply?: boolean; // The autoReply request parameter enables auto replies to be sent when a conversation is created via the API. When autoReply is set to true, an auto reply will be sent as long as there is at least one customer thread in the conversation.
  imported?: boolean; // The imported field enables conversation to be created for historical purposes. When imported is set to true, no outgoing emails or notifications will be generated.
  type: ConversationType; // Required - Conversation type, one of: chat, email, phone
  assignTo?: number; // The Help Scout user assigned to the conversation.
  mailboxId: number; // Required - ID of a mailbox where the conversation is being created
  status: ConversationStatus; // Required - Conversation status, one of active, closed, pending
  createdAt?: string; // When this conversation was created - ISO 8601 date time
  customer: Customer; // Required - Customer associated with the conversation. If a customer is matched either via id or email field, the rest of the optional fields is ignored.
  threads: ChatThread[]; // Required - Темы разговоров . В разговоре должна быть хотя бы одна тема
  tags?: string[]; // List of tags to be be added to the conversation
  fields?: Field[]; // List of custom fields and values to be set for the conversation
  user?: number; // ID of the user who is adding the conversation and threads.
  closedAt?: string; // When the conversation was closed, only applicable for imported conversations - ISO 8601 date time
};
