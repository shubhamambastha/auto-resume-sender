// User-facing Messages and Text Constants

export const ERROR_MESSAGES = {
  RESUME_NOT_FOUND: (resumeType: string) =>
    `Resume type '${resumeType}' not found`,
  RESUME_FETCH_FAILED: (resumeType: string, url: string) =>
    `Error fetching resume for ${resumeType} from ${url}`,
  RESUME_DOWNLOAD_FAILED: "Failed to download resume",
  RESUME_URL_NOT_FOUND: (resumeType: string) =>
    `No resume URL found for resume type: ${resumeType}`,
  RESUME_EMPTY_FILE: "Downloaded file is empty",
  RESUME_FETCH_HTTP_ERROR: (status: number, statusText: string) =>
    `Failed to fetch resume from URL: ${status} ${statusText}`,
  EMAIL_SEND_FAILED: "Error sending application email",
  FORM_VALIDATION: {
    REQUIRED_FIELDS:
      "company name, HR/company email, position applied for, and resume type are required fields",
    INVALID_EMAIL: "Please provide a valid HR or company email address",
  },
  DATABASE: {
    SAVE_FAILED: "Failed to save submission. Please try again later.",
    INTERNAL_ERROR: "Internal server error. Please try again later.",
  },
  EMAIL_PARTIAL_SUCCESS: (email: string, error: string) =>
    `Failed to send application email: ${error}. Your submission has been saved, but please contact support.`,
} as const;

export const SUCCESS_MESSAGES = {
  APPLICATION_SUBMITTED: (email: string) =>
    `Thank you! Your application has been submitted successfully and sent to ${email}.`,
  EMAIL_SENT: "Application email sent successfully!",
  RESUME_ATTACHMENT_CREATED: (size: number) =>
    `Resume attachment created successfully. Size: ${size} bytes`,
} as const;

export const WARNING_MESSAGES = {
  UNEXPECTED_CONTENT_TYPE: (contentType: string) =>
    `Unexpected content type: ${contentType}. This might not be a direct download link.`,
  NO_ATTACHMENT: (resumeType: string) =>
    `No resume URL found for resume type: ${resumeType}. Email will be sent without an attachment.`,
} as const;

export const FILE_CONSTANTS = {
  RESUME_FILENAME: (
    companyName: string,
    position: string,
    resumeType: string
  ) =>
    `${companyName.replace(/[^a-zA-Z0-9]/g, "_")}-${position.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    )}-${resumeType}-Resume.pdf`,
} as const;
