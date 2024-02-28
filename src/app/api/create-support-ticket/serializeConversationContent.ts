import {
    AIAnnotations,
    ChatSession,
    FormDetails,
  } from "../../../types/create-conversation.types";
  
  /**
   * Serialize ticket content based on AI annotations, form details, and chat session.
   *
   * @param {AIAnnotations} aiAnnotations - Annotations from AI analysis.
   * @param {FormDetails} formDetails - Details submitted in the form.
   * @param {ChatSession} chatSession - Chat session history.
   */
  function serializeTicketContent(
    aiAnnotations: AIAnnotations,
    formDetails: FormDetails,
    chatSession: ChatSession
  ) {
    const { question_summary, classifiers, gap_summary } = aiAnnotations;
    const { name, email } = formDetails;
    const { messages } = chatSession;
  
    let content = "\n";
  
    // Add Question Summary
    content += `<h4> Question Summary </h4>\n`;
    content += `<p>${question_summary}<p>\n\n`;
  
    // Add Gap Summary
    content += `<h4> Gap Summary </h4>\n`;
    content += `<p>${gap_summary}</p>\n\n`;
  
    // Add User Info
    content += `<h4> User info </h4>\n`;
    content += `<p> - Name: ${name ?? "N/A"}<br>
                    - Email: ${email ?? "N/A"}\n\n
                </p>`;
  
    // Add AI Flags
    content += "<h4> AI flags </h4>\n";
    content += `<p> 
                - Is Content Found: ${
                  classifiers?.is_content_found ? "Yes" : "No"
                } <br>
                - Is Feature Supported: ${
                  classifiers?.is_feature_supported ? "Yes" : "No"
                }
                </p>\n\n`;
  
    // Add Chat History
    content += "<h4>AI chat history\n\n</h4>";
  
    messages.forEach((message) => {
      // Determine if the message is from User or AI Assistant
      if (message.role === "user") {
        content += "<h5> User </h5>\n";
      } else {
        content += "<h5> AI Assistant </h5>\n";
      }
  
      // Add message content
      content += `<p> ${message.content} </p>\n\n`;
    });
  
    return content;
  }
  
  export default serializeTicketContent;