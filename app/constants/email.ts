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
    SUBJECT: (position: string, company: string) =>
      `Application for ${position} at ${company}`,

    BODY: (data: {
      hrName?: string;
      positionAppliedFor: string;
      companyName: string;
      resumeType: string;
    }) => `
    <div dir="ltr">
      <div>
        <div>
          <div>
            <div>
              <div>
                <div>Hi ${
                  data.hrName && data.hrName !== "" ? data.hrName : "there"
                },</div>
                <div>
                  <div dir="auto">I came across your LinkedIn post about the hiring of a&nbsp;<span style="color:rgba(0,0,0,0.9);font-family:-apple-system,system-ui,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue','Fira Sans',Ubuntu,Oxygen,'Oxygen Sans',Cantarell,'Droid Sans','Apple Color Emoji','Segoe UI Emoji','Segoe UI Emoji','Segoe UI Symbol','Lucida Grande',Helvetica,Arial,sans-serif;font-size:14px">${
                    data.positionAppliedFor
                  }</span>&nbsp;at&nbsp;<span style="color:rgba(0,0,0,0.9);font-family:-apple-system,system-ui,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue','Fira Sans',Ubuntu,Oxygen,'Oxygen Sans',Cantarell,'Droid Sans','Apple Color Emoji','Segoe UI Emoji','Segoe UI Emoji','Segoe UI Symbol','Lucida Grande',Helvetica,Arial,sans-serif;font-size:14px">${
      data.companyName
    }</span>. I am very interested in this opportunity and believe my background makes me a strong candidate. With over 5+ years of experience in ${getSkillAreaFromResumeType(
      data.resumeType
    )}, including team lead expertise, I have honed my skills in building scalable, high-performance web applications.&nbsp;</div>
                  <div dir="auto">I have attached my resume for your review. I would love to discuss how my experience and skills align with the needs of your team.&nbsp;</div>
                  <div dir="auto">Looking forward to the possibility of working together.</div>
                </div>
              </div>
            </div>
            <font color="#888888">
              <font color="#888888">
                <font color="#888888">
                  <font color="#888888"></font>
                </font>
              </font>
            </font>
          </div>
          <font color="#888888">
            <font color="#888888">
              <font color="#888888"></font>
            </font>
          </font>
        </div>
        <font color="#888888">
          <font color="#888888"></font>
        </font>
      </div>
      <font color="#888888">
        <div><br></div>
        <span class="gmail_signature_prefix">-- </span><br>
                 <div dir="ltr" class="gmail_signature" data-smartmail="gmail_signature">
           <div dir="ltr">
              <i>Shubham Ambastha<br>+91-8602167858</i>
           </div>
         </div>
      </font>
    </div>
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
