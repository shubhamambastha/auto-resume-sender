import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

// GET - Fetch all active resume types
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("is_active", true)
      .order("display_name", { ascending: true });

    if (error) {
      console.error("Error fetching resume types:", error);
      return NextResponse.json(
        { error: "Failed to fetch resume types" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error fetching resume types:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new resume type
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.display_name || !body.link) {
      return NextResponse.json(
        { error: "name, display_name, and link are required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("resumes")
      .insert([
        {
          name: body.name,
          display_name: body.display_name,
          link: body.link,
          description: body.description || null,
          is_active: body.is_active !== undefined ? body.is_active : true,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating resume type:", error);

      // Handle unique constraint violation
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "A resume type with this name already exists" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Failed to create resume type" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("Unexpected error creating resume type:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
