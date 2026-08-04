import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  let res = NextResponse.next({ request: { headers: req.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) { return req.cookies.get(name)?.value; },
        set(name, value, options) {
          req.cookies.set({ name, value, ...options });
          res = NextResponse.next({ request: { headers: req.headers } });
          res.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          req.cookies.set({ name, value: '', ...options });
          res = NextResponse.next({ request: { headers: req.headers } });
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  const path = req.nextUrl.pathname;

  // Protected route definitions
  const isOrganizerRoute = path.startsWith('/organizer');
  const isStaffRoute = path.startsWith('/staff');
  const isAdminRoute = path.startsWith('/admin');

  if (isOrganizerRoute || isStaffRoute || isAdminRoute) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Fetch user role from public.users table
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('uid', session.user.id)
      .single();

    const role = userProfile?.role;

    // Role Enforcement
    if (isOrganizerRoute && role !== 'organizer') return NextResponse.redirect(new URL('/unauthorized', req.url));
    if (isStaffRoute && role !== 'staff') return NextResponse.redirect(new URL('/unauthorized', req.url));
    if (isAdminRoute && role !== 'admin') return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/organizer/:path*', '/staff/:path*', '/admin/:path*'],
};