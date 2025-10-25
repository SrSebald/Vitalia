/**
 * Workouts API Route - Example with RLS
 * 
 * This demonstrates how to use Row Level Security in your API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { withUserContext, getProfileIdByAuthUserId } from '@/lib/db/rls-helper';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Helper function to get authenticated user from Supabase
 */
async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * GET /api/workouts
 * Returns all workouts for the authenticated user
 * RLS automatically filters results to only show user's workouts
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Get authenticated user
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Query with RLS context - automatically filtered by user
    const workouts = await withUserContext(sql, user.id, async () => {
      return await sql`
        SELECT 
          w.*,
          COUNT(s.id)::int as total_sets
        FROM workouts w
        LEFT JOIN sets s ON s.workout_id = w.id
        GROUP BY w.id
        ORDER BY w.workout_date DESC
        LIMIT 50
      `;
    });

    return NextResponse.json({ 
      workouts,
      count: workouts.length 
    });

  } catch (error) {
    console.error('Error fetching workouts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/workouts
 * Creates a new workout for the authenticated user
 * RLS automatically validates user owns the profile_id
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Get authenticated user
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Parse request body
    const body = await request.json();
    const { name, workoutDate, durationMin, notes } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // 3. Get user's profile ID
    const profileId = await getProfileIdByAuthUserId(sql, user.id);
    
    if (!profileId) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // 4. Insert with RLS context
    const result = await withUserContext(sql, user.id, async () => {
      return await sql`
        INSERT INTO workouts (
          user_id,
          name,
          workout_date,
          duration_min,
          notes
        )
        VALUES (
          ${profileId},
          ${name},
          ${workoutDate || new Date().toISOString().split('T')[0]},
          ${durationMin || null},
          ${notes || null}
        )
        RETURNING *
      `;
    });

    return NextResponse.json(
      { 
        workout: result[0],
        message: 'Workout created successfully' 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating workout:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/workouts?id=xxx
 * Deletes a workout (RLS ensures user owns it)
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const workoutId = searchParams.get('id');

    if (!workoutId) {
      return NextResponse.json(
        { error: 'Workout ID is required' },
        { status: 400 }
      );
    }

    // RLS will prevent deletion if user doesn't own this workout
    const result = await withUserContext(sql, user.id, async () => {
      return await sql`
        DELETE FROM workouts
        WHERE id = ${workoutId}
        RETURNING id
      `;
    });

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Workout not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Workout deleted successfully',
      id: result[0].id
    });

  } catch (error) {
    console.error('Error deleting workout:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

