import { NextRequest, NextResponse } from "next/server";

interface FormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body
    const body: FormData = await request.json();

    // Basic validation
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: "Name, email, and message are required fields" },
        { status: 400 }
      );
    }

    // Email validation (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
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
      name: body.name,
      email: body.email,
      phone: body.phone || "Not provided",
      message: body.message,
      timestamp: new Date().toISOString(),
    });

    // Simulate some processing time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json(
      {
        message: `Thank you ${body.name}! Your message has been received and we'll get back to you soon.`,
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
