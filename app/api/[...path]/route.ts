  import { NextResponse, type NextRequest } from "next/server";

  // Same-origin "/api/*" calls are proxied here to the backend. Using a route
  // handler (instead of a next.config.ts rewrite) lets us control exactly which
  // request/response headers cross the boundary rather than forwarding them all.
  const BACKEND_URL = process.env.BACKEND_API_URL?.replace(/\/$/, "");

  // Hop-by-hop / origin-specific headers that must not be forwarded verbatim.
  const STRIPPED_REQUEST_HEADERS = ["host", "connection", "content-length"];
  const STRIPPED_RESPONSE_HEADERS = ["content-encoding", "content-length"];

  async function proxy(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> },
  ): Promise<NextResponse> {
    if (!BACKEND_URL) {
      return NextResponse.json(
        { message: "BACKEND_API_URL is not configured" },
        { status: 500 },
      );
    }

    const { path } = await params;
    const targetUrl = `${BACKEND_URL}/${path.join("/")}${request.nextUrl.search}`;

    const requestHeaders = new Headers(request.headers);
    for (const header of STRIPPED_REQUEST_HEADERS) {
      requestHeaders.delete(header);
    }

    const hasBody = request.method !== "GET" && request.method !== "HEAD";

    let backendResponse: Response;
    try {
      backendResponse = await fetch(targetUrl, {
        method: request.method,
        headers: requestHeaders,
        body: hasBody ? await request.arrayBuffer() : undefined,
        redirect: "manual",
      });
    } catch {
      return NextResponse.json(
        { message: "Upstream service is unavailable" },
        { status: 502 },
      );
    }

    const responseHeaders = new Headers(backendResponse.headers);
    for (const header of STRIPPED_RESPONSE_HEADERS) {
      responseHeaders.delete(header);
    }

    return new NextResponse(backendResponse.body, {
      status: backendResponse.status,
      headers: responseHeaders,
    });
  }

  export {
    proxy as GET,
    proxy as POST,
    proxy as PUT,
    proxy as PATCH,
    proxy as DELETE,
  };
