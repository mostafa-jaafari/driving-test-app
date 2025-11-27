import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    let response = NextResponse.next({
        request: {
        headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
        cookies: {
            getAll() {
            return request.cookies.getAll()
            },
            setAll(cookiesToSet) {
            // 1. Set the cookie on the request (so Server Components see it immediately)
            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
            
            // 2. Create a new response instance
            response = NextResponse.next({
                request,
            })
            
            // 3. Set the cookie on the response (so the browser sees it)
            cookiesToSet.forEach(({ name, value, options }) =>
                response.cookies.set(name, value, options)
            )
            },
        },
        }
    )

    // This function refreshes the session if the access token is expired
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // ==================================================================
    // OPTIONAL: PROTECTED ROUTES
    // If you want to force redirect from Server side (faster than Client)
    // ==================================================================
    
    // Example: Protect '/history' and specific premium quizzes
    // if (!user && request.nextUrl.pathname.startsWith('/history')) {
    //   return NextResponse.redirect(new URL('/auth/login', request.url))
    // }

    return response
}

export const config = {
    matcher: [
        /*
        * Match all request paths except for the ones starting with:
        * - _next/static (static files)
        * - _next/image (image optimization files)
        * - favicon.ico (favicon file)
        * - images (public folders for your assets)
        */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}