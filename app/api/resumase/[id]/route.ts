import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

// GET - Fetch a specific resume type by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Resume type not found" },
          { status: 404 }
        );
      }

      console.error("Error fetching resume type:", error);
      return NextResponse.json(
        { error: "Failed to fetch resume type" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error fetching resume type:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update a specific resume type
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();

    // Build update object with only provided fields
    const updateData: {
      name?: string;
      display_name?: string;
      link?: string;
      description?: string | null;
      is_active?: boolean;
    } = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.display_name !== undefined)
      updateData.display_name = body.display_name;
    if (body.link !== undefined) updateData.link = body.link;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.is_active !== undefined) updateData.is_active = body.is_active;

    const { data, error } = await supabase
      .from("resumes")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Resume type not found" },
          { status: 404 }
        );
      }

      // Handle unique constraint violation
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "A resume type with this name already exists" },
          { status: 409 }
        );
      }

      console.error("Error updating resume type:", error);
      return NextResponse.json(
        { error: "Failed to update resume type" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error updating resume type:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific resume type (soft delete by setting is_active to false)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { data, error } = await supabase
      .from("resumes")
      .update({ is_active: false })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Resume type not found" },
          { status: 404 }
        );
      }

      console.error("Error deleting resume type:", error);
      return NextResponse.json(
        { error: "Failed to delete resume type" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Resume type deleted successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error deleting resume type:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
