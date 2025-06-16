// Email Templates and Constants

export const EMAIL_TEMPLATES = {
  APPLICATION: {
    SUBJECT: (position: string, company: string) =>
      `Application for ${position} at ${company}`,

    BODY: (data: {
      hrName?: string;
      positionAppliedFor: string;
      companyName: string;
      resumeType: string;
    }) => `
    Dear ${data.hrName && data.hrName !== "" ? data.hrName : "Hiring Manager"},
  
    I hope this email finds you well.
  
    I am writing to express my keen interest in the ${
      data.positionAppliedFor
    } position at ${
      data.companyName
    }, as advertised. My skills and experience align well with the requirements outlined for this role.
  
    I have attached my resume, a "${
      data.resumeType
    }" type, for your review, which details my qualifications and accomplishments. I am confident that my background in [mention a relevant skill or area, e.g., software development, product management] would be a valuable asset to your team.
  
    Thank you for your time and consideration. I look forward to hearing from you soon regarding my application.
  
    Sincerely,
    [Your Name/Your Full Name]
    [Your Phone Number, Optional]
    [Your LinkedIn Profile, Optional]
    [Your Portfolio/Website, Optional]
    `,
  },
} as const;

export const EMAIL_CONFIG = {
  DEFAULT_PORT: "587",
  CONTENT_TYPES: {
    PDF: "application/pdf",
    OCTET_STREAM: "application/octet-stream",
  },
  HEADERS: {
    USER_AGENT:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  },
} as const;
