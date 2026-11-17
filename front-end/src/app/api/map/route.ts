import type { NextRequest } from 'next/server';
import { parseRepoRef } from '@/lib/repoRef';
import { invalidRepoResponse, svgResponse, toErrorResponse } from '@/server/http/responses';
import { optionsFromSearchParams } from '@/server/http/queryOptions';
import { renderRepoMap } from '@/server/services/mapService';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const ref = parseRepoRef(params.get('repo'), params.get('branch') ?? undefined);
  if (!ref) return invalidRepoResponse();

  try {
    const { svg } = await renderRepoMap({ ref, overrides: optionsFromSearchParams(params) });
    return svgResponse(svg);
  } catch (error) {
    return toErrorResponse(error);
  }
}
