export const data = {
  form_details: {
    name: "J. Smith",
    email: "jsmith@domain.com",
    additional_details: "Something details",
  },
  ai_annotations: {
    question_type: "ACCOUNT_MANAGEMENT",
    question_summary: "How do I access my locked account?",
    gap_summary: "Gap Summary",
    classifiers: {
      is_content_found: false,
      is_feature_supported: false,
      should_escalate_to_support: true,
    },
  },
  chat_session: {
    chat_session_id: "1",
    messages: [
      {
        content: "Hi! What is inkeep?",
        role: "user",
      },
      {
        content: "Inkeep is ...",
        role: "assistant",
      },
      {
        content: "Thanks",
        role: "user",
      },
      {
        content: "Goodbye!",
        role: "assistant",
      },
    ],
  },
};
