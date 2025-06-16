import nodemailer from "nodemailer";
import { FormData } from "@/app/types/index"; // Import from the new types file
import { supabase } from "@/app/lib/supabase";

// Function to convert Google Drive view URL to direct download URL
function convertGoogleDriveUrl(url: string): string {
  // Check if it's a Google Drive URL
  const driveRegex = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);

  if (match) {
    const fileId = match[1];
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }

  // Return original URL if it's not a Google Drive URL
  return url;
}

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
    return {
      success: false,
      error: `Resume type '${body.resumeType}' not found`,
    };
  }

  const resumeUrl = resumeData?.link;
  let resumeAttachment: { filename: string; content: Buffer } | undefined;

  if (resumeUrl) {
    try {
      // Convert Google Drive URL to direct download URL
      const downloadUrl = convertGoogleDriveUrl(resumeUrl);
      console.log(`Fetching resume from: ${downloadUrl}`);

      const response = await fetch(downloadUrl, {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch resume from URL: ${response.status} ${response.statusText}`
        );
      }

      // Check if the response is actually a PDF
      const contentType = response.headers.get("content-type");
      if (
        contentType &&
        !contentType.includes("application/pdf") &&
        !contentType.includes("application/octet-stream")
      ) {
        console.warn(
          `Unexpected content type: ${contentType}. This might not be a direct download link.`
        );
      }

      const filename = `${body.companyName.replace(
        /[^a-zA-Z0-9]/g,
        "_"
      )}-${body.positionAppliedFor.replace(/[^a-zA-Z0-9]/g, "_")}-${
        body.resumeType
      }-Resume.pdf`;
      const arrayBuffer = await response.arrayBuffer();

      if (arrayBuffer.byteLength === 0) {
        throw new Error("Downloaded file is empty");
      }

      resumeAttachment = {
        filename: filename,
        content: Buffer.from(arrayBuffer),
      };
      console.log(
        `Resume attachment created successfully. Size: ${arrayBuffer.byteLength} bytes`
      );
    } catch (fetchError) {
      console.error(
        `Error fetching resume for ${body.resumeType} from ${resumeUrl}:`,
        fetchError
      );
      // Return error instead of continuing without attachment
      return {
        success: false,
        error: `Failed to download resume: ${
          fetchError instanceof Error ? fetchError.message : "Unknown error"
        }`,
      };
    }
  } else {
    console.warn(
      `No resume URL found for resume type: ${body.resumeType}. Email will be sent without an attachment.`
    );
    return {
      success: false,
      error: `No resume URL found for resume type: ${body.resumeType}`,
    };
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
