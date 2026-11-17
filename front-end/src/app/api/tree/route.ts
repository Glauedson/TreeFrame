import { NextResponse, type NextRequest } from 'next/server';
import { parseRepoRef } from '@/lib/repoRef';
import { invalidRepoResponse, toErrorResponse } from '@/server/http/responses';
import { loadRepoOutline } from '@/server/services/mapService';

export async function GET(request: NextRequest) {
  const ref = parseRepoRef(request.nextUrl.searchParams.get('repo'));
  if (!ref) return invalidRepoResponse();

  try {
    return NextResponse.json(await loadRepoOutline(ref));
  } catch (error) {
    return toErrorResponse(error);
  }
}
