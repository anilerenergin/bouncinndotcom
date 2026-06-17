// Inline minimal handler to avoid missing-module import error for '../../lib/download'
export function GET(request: Request) {
  // If you have a proper download handler, replace this implementation
  // with an import from the correct path.
  return new Response('Download handler not found', { status: 500 });
}
