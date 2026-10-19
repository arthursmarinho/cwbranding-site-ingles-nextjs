import { NextResponse, type NextRequest } from "next/server";

// Painel admin mascarado:
// - /<ADMIN_PATH> (secreto, só no env — o repositório é público) → reescreve para /admin
// - /admin direto → 404, para a rota interna não ser descoberta
// A autenticação de verdade acontece na página/ações (lib/admin-session.ts).
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminPath = process.env.ADMIN_PATH;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return NextResponse.rewrite(new URL("/_not-found", request.url), { status: 404 });
  }

  if (adminPath && pathname === `/${adminPath}`) {
    const response = NextResponse.rewrite(new URL("/admin", request.url));
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  // Ignora arquivos estáticos e internos do Next.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico|txt|xml|html)$).*)"],
};
