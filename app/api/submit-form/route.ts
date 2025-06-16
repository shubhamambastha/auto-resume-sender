import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { sendApplicationEmail } from "@/app/services/emailService";
import { FormData } from "@/app/types/index";
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  REGEX_PATTERNS,
  TIMEOUTS,
} from "@/app/constants";

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body
    const body: FormData = await request.json();

    // Basic validation for required fields
    if (
      !body.companyName ||
      !body.hrEmail ||
      !body.positionAppliedFor ||
      !body.resumeType
    ) {
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.FORM_VALIDATION.REQUIRED_FIELDS,
        },
        { status: 400 }
      );
    }

    // Email validation (basic) for HR/Company email
    if (!REGEX_PATTERNS.EMAIL.test(body.hrEmail)) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.FORM_VALIDATION.INVALID_EMAIL },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification
    // 3. Integrate with CRM
    // 4. etc.

    // For now, we'll just log the data and return success
    console.log("Form submission received:", {
      companyName: body.companyName,
      hrName: body.hrName || "Not provided",
      hrEmail: body.hrEmail,
      positionAppliedFor: body.positionAppliedFor,
      resumeType: body.resumeType,
      timestamp: new Date().toISOString(),
    });

    // Simulate some processing time
    await new Promise((resolve) =>
      setTimeout(resolve, TIMEOUTS.FORM_SUBMISSION_DELAY)
    );

    // Insert data into Supabase
    const { data, error } = await supabase.from("submissions").insert([
      {
        company_name: body.companyName,
        hr_name: body.hrName,
        hr_email: body.hrEmail,
        position_applied_for: body.positionAppliedFor,
        resume_type: body.resumeType,
      },
    ]);

    if (error) {
      console.error("Error inserting data into Supabase:", error);
      return NextResponse.json(
        { error: ERROR_MESSAGES.DATABASE.SAVE_FAILED },
        { status: 500 }
      );
    }

    console.log("Data successfully saved to Supabase:", data);

    // --- Call the new email service function ---
    const emailResult = await sendApplicationEmail(body);

    if (!emailResult.success) {
      console.error("Email sending failed:", emailResult.error);
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.EMAIL_PARTIAL_SUCCESS(
            body.hrEmail,
            emailResult.error as string
          ),
          partialSuccess: true,
        },
        { status: 500 }
      );
    }
    // --- End Email Service Call ---

    return NextResponse.json(
      {
        message: SUCCESS_MESSAGES.APPLICATION_SUBMITTED(body.hrEmail),
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing form submission:", error);

    return NextResponse.json(
      { error: ERROR_MESSAGES.DATABASE.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

// Handle GET requests (optional - for API health check)
export async function GET() {
  return NextResponse.json(
    { message: "Form submission API is working", status: "healthy" },
    { status: 200 }
  );
}
