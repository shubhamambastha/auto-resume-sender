import nodemailer from "nodemailer";
import { FormData } from "@/app/types/index"; // Import from the new types file
import { supabase } from "@/app/lib/supabase";

// Nodemailer transporter setup (using environment variables)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendApplicationEmail(body: FormData) {
  // Fetch resume URL from resumes table
  const { data: resumeData, error: resumeError } = await supabase
    .from("resumes")
    .select("link")
    .eq("name", body.resumeType)
    .eq("is_active", true)
    .single();

  if (resumeError) {
    console.error(
      `Error fetching resume URL for ${body.resumeType}:`,
      resumeError
    );
  }

  const resumeUrl = resumeData?.link;
  let resumeAttachment: { filename: string; content: Buffer } | undefined;

  if (resumeUrl) {
    try {
      const response = await fetch(resumeUrl);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch resume from URL: ${response.status} ${response.statusText}`
        );
      }
      const filename = `${body.companyName}-${body.positionAppliedFor}-${body.resumeType}-Resume.pdf`;
      const arrayBuffer = await response.arrayBuffer();
      resumeAttachment = {
        filename: filename,
        content: Buffer.from(arrayBuffer),
      };
    } catch (fetchError) {
      console.error(
        `Error fetching resume for ${body.resumeType} from ${resumeUrl}:`,
        fetchError
      );
      // Decide if this error should prevent the email from being sent or just send without attachment
    }
  } else {
    console.warn(
      `No resume URL found for resume type: ${body.resumeType}. Email will be sent without an attachment.`
    );
  }

  // Construct email content with form variables
  const emailSubject = `Application for ${body.positionAppliedFor} at ${body.companyName}`;
  const emailText = `
    Dear ${body.hrName && body.hrName !== "" ? body.hrName : "Hiring Manager"},
  
    I hope this email finds you well.
  
    I am writing to express my keen interest in the ${
      body.positionAppliedFor
    } position at ${
    body.companyName
  }, as advertised. My skills and experience align well with the requirements outlined for this role.
  
    I have attached my resume, a "${
      body.resumeType
    }" type, for your review, which details my qualifications and accomplishments. I am confident that my background in [mention a relevant skill or area, e.g., software development, product management] would be a valuable asset to your team.
  
    Thank you for your time and consideration. I look forward to hearing from you soon regarding my application.
  
    Sincerely,
    [Your Name/Your Full Name]
    [Your Phone Number, Optional]
    [Your LinkedIn Profile, Optional]
    [Your Portfolio/Website, Optional]
    `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: body.hrEmail,
      subject: emailSubject,
      text: emailText,
      attachments: resumeAttachment ? [resumeAttachment] : [],
    });
    console.log("Application email sent successfully!");
    return { success: true };
  } catch (mailError) {
    console.error("Error sending application email:", mailError);
    return { success: false, error: mailError };
  }
}
