import nodemailer from "nodemailer";
import { FormData } from "@/app/types/index"; // Import from the new types file
import { supabase } from "@/app/lib/supabase";
import {
  EMAIL_TEMPLATES,
  EMAIL_CONFIG,
  REGEX_PATTERNS,
  URL_TEMPLATES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  WARNING_MESSAGES,
  FILE_CONSTANTS,
} from "@/app/constants";

// Function to convert Google Drive view URL to direct download URL
function convertGoogleDriveUrl(url: string): string {
  // Check if it's a Google Drive URL
  const match = url.match(REGEX_PATTERNS.GOOGLE_DRIVE_URL);

  if (match) {
    const fileId = match[1];
    return URL_TEMPLATES.GOOGLE_DRIVE_DOWNLOAD(fileId);
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
      ERROR_MESSAGES.RESUME_FETCH_FAILED(body.resumeType, "database"),
      resumeError
    );
    return {
      success: false,
      error: ERROR_MESSAGES.RESUME_NOT_FOUND(body.resumeType),
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
          "User-Agent": EMAIL_CONFIG.HEADERS.USER_AGENT,
        },
      });

      if (!response.ok) {
        throw new Error(
          ERROR_MESSAGES.RESUME_FETCH_HTTP_ERROR(
            response.status,
            response.statusText
          )
        );
      }

      // Check if the response is actually a PDF
      const contentType = response.headers.get("content-type");
      if (
        contentType &&
        !contentType.includes(EMAIL_CONFIG.CONTENT_TYPES.PDF) &&
        !contentType.includes(EMAIL_CONFIG.CONTENT_TYPES.OCTET_STREAM)
      ) {
        console.warn(WARNING_MESSAGES.UNEXPECTED_CONTENT_TYPE(contentType));
      }

      const filename = FILE_CONSTANTS.RESUME_FILENAME(body.positionAppliedFor);
      const arrayBuffer = await response.arrayBuffer();

      if (arrayBuffer.byteLength === 0) {
        throw new Error(ERROR_MESSAGES.RESUME_EMPTY_FILE);
      }

      resumeAttachment = {
        filename: filename,
        content: Buffer.from(arrayBuffer),
      };
      console.log(
        SUCCESS_MESSAGES.RESUME_ATTACHMENT_CREATED(arrayBuffer.byteLength)
      );
    } catch (fetchError) {
      console.error(
        ERROR_MESSAGES.RESUME_FETCH_FAILED(body.resumeType, resumeUrl),
        fetchError
      );
      // Return error instead of continuing without attachment
      return {
        success: false,
        error: `${ERROR_MESSAGES.RESUME_DOWNLOAD_FAILED}: ${
          fetchError instanceof Error ? fetchError.message : "Unknown error"
        }`,
      };
    }
  } else {
    console.warn(WARNING_MESSAGES.NO_ATTACHMENT(body.resumeType));
    return {
      success: false,
      error: ERROR_MESSAGES.RESUME_URL_NOT_FOUND(body.resumeType),
    };
  }

  // Construct email content with form variables
  const emailSubject = EMAIL_TEMPLATES.APPLICATION.SUBJECT(
    body.positionAppliedFor
  );
  const emailText = EMAIL_TEMPLATES.APPLICATION.BODY({
    hrName: body.hrName,
    positionAppliedFor: body.positionAppliedFor,
    companyName: body.companyName,
    resumeType: body.resumeType,
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: body.hrEmail,
      subject: emailSubject,
      html: emailText,
      attachments: resumeAttachment ? [resumeAttachment] : [],
    });
    console.log(SUCCESS_MESSAGES.EMAIL_SENT);
    return { success: true };
  } catch (mailError) {
    console.error(ERROR_MESSAGES.EMAIL_SEND_FAILED, mailError);
    return { success: false, error: mailError };
  }
}
