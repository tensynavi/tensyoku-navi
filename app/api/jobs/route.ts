import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const prefecture = searchParams.get('prefecture')
  const jobType = searchParams.get('jobType')
  const keyword = searchParams.get('keyword')

  let query = supabase
    .from('jobs')
    .select(`*, companies (name, logo_emoji, status)`)
    .eq('status', 'published')

  if (prefecture) query = query.eq('prefecture', prefecture)
  if (jobType) query = query.eq('job_type', jobType)
  if (keyword) query = query.or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%`)

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ jobs: data })
}
