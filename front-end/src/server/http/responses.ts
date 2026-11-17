import { NextResponse } from 'next/server';
import { AppError, invalidRepo } from '../errors';

const SVG_CACHE = 'public, s-maxage=3600, stale-while-revalidate=86400';

export const svgResponse = (svg: string) =>
  new NextResponse(svg, {
    headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': SVG_CACHE },
  });

export const invalidRepoResponse = () => toErrorResponse(invalidRepo());

export function toErrorResponse(error: unknown): NextResponse {
  if (error instanceof AppError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error(error);
  return NextResponse.json({ error: 'Something went wrong while building the map.' }, { status: 500 });
}
