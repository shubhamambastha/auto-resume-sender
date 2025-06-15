import { NextRequest, NextResponse } from "next/server";

interface FormData {
  companyName: string;
  hrName?: string;
  hrEmail: string;
  positionAppliedFor: string;
  resumeType: string;
}

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
          error:
            "company name, HR/company email, position applied for, and resume type are required fields",
        },
        { status: 400 }
      );
    }

    // Email validation (basic) for HR/Company email
    const hrEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!hrEmailRegex.test(body.hrEmail)) {
      return NextResponse.json(
        { error: "Please provide a valid HR or company email address" },
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
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json(
      {
        message: `Thank you! Your message has been received and we'll get back to you soon.`,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing form submission:", error);

    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
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
