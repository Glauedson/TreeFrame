import { NextResponse, type NextRequest } from 'next/server';
import { parseRepoRef } from '@/lib/repoRef';
import { invalidRepoResponse, toErrorResponse } from '@/server/http/responses';
import { renderRepoMap } from '@/server/services/mapService';

interface PreviewBody {
  repo?: string;
  config?: unknown;
}

/** Live editor preview: renders with the editor's config instead of the repo's file. */
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as PreviewBody;
  const ref = parseRepoRef(body.repo);
  if (!ref) return invalidRepoResponse();

  try {
    const result = await renderRepoMap({ ref, overrides: body.config, useRepoConfig: false });
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}
