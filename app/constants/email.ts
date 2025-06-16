// Email Templates and Constants

// Resume type to skill area mapping
export const RESUME_TYPE_SKILL_MAPPING = {
  "full-stack-developer": "Full Stack Development",
  "frontend-developer": "Frontend Development",
  "backend-developer": "Backend Development",
} as const;

// Function to get skill area from resume type
export const getSkillAreaFromResumeType = (resumeType: string): string => {
  return (
    RESUME_TYPE_SKILL_MAPPING[
      resumeType as keyof typeof RESUME_TYPE_SKILL_MAPPING
    ] || "Software Development"
  );
};

export const EMAIL_TEMPLATES = {
  APPLICATION: {
    SUBJECT: (position: string) =>
      `Application for ${position} || Shubham Ambastha || 5+ Years of Experience`,

    BODY: (data: {
      hrName?: string;
      positionAppliedFor: string;
      companyName: string;
      resumeType: string;
    }) => `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        <div class="container">
            <p>Hi ${
              data.hrName && data.hrName !== "" ? data.hrName : "there"
            },</p>

            <p>I came across your LinkedIn post about the hiring of a <strong>${
              data.positionAppliedFor
            }</strong> at <strong>${
      data.companyName
    }</strong>. I am very interested in this opportunity and believe my background makes me a strong candidate. With over 5+ years of experience in ${getSkillAreaFromResumeType(
      data.resumeType
    )}, including team lead expertise, I have honed my skills in building scalable, high-performance web applications.</p>

            <p>I have attached my resume for your review. I would love to discuss how my experience and skills align with the needs of your team.</p>

            <p>Looking forward to the possibility of working together.</p>

            <div class="footer">
                <p>Best regards,</p>
                <p>
                    Shubham Ambastha
                    <br>
                    +91-8602167858
                </p>
            </div>
        </div>
    </body>
    </html>
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
