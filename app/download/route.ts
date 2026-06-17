import { getDownloadResponse } from '../../lib/download';

export function GET(request: Request) {
  return getDownloadResponse(request);
}
