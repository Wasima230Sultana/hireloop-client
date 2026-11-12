"use client"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MenuIcon } from "lucide-react"

import logo from "@/app/images/logo.png"
import { Button, buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "cn"
import { signOut, useSession } from "@/lib/auth-client"

type NavLink = {
  label: string
  href: string
}

const navItems: NavLink[] = [
  { label: "Browse Jobs", href: "#jobs" },
  { label: "Company", href: "#company" },
  { label: "Pricing", href: "#pricing" },
]

const navLinkClassName =
  "group inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium text-foreground/90 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"

const mobileNavLinkClassName =
  "flex h-11 items-center rounded-lg px-3 text-sm font-medium text-foreground/90 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
function SiteHeader() {
  const router = useRouter()
  const { data: session } = useSession()

  const handleSignOut = async () => {
    await signOut()
    router.refresh()
  }
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-6 md:h-20">
        <Link href="/" aria-label="HireLoop home" className="shrink-0">
          <Image src={logo} alt="HireLoop" className="h-8 w-auto md:h-10" />
        </Link>

        <div className="flex items-center gap-1 md:gap-2">
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={navLinkClassName}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Separator
            orientation="vertical"
            className="mx-2 hidden h-5 md:block"
          />

          {/* Desktop Authentication */}
          {session?.user ? (
            <>
              <span className="hidden max-w-40 truncate text-sm font-medium text-foreground/90 md:inline-flex">
                {session.user.name}
              </span>
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="hidden md:inline-flex"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className={cn(navLinkClassName, "hidden md:inline-flex")}
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className={cn(
                  buttonVariants(),
                  "hidden px-5 md:inline-flex md:h-10"
                )}
              >
                Get Started
              </Link>
            </>
          )}

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open navigation menu"
                  className="md:hidden"
                />
              }
            >
              <MenuIcon />
            </SheetTrigger>

            <SheetContent side="right" className="flex flex-col gap-0">
              <SheetHeader className="border-b border-border">
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>

                <Link href="/" aria-label="HireLoop home">
                  <Image src={logo} alt="HireLoop" className="h-8 w-auto" />
                </Link>
              </SheetHeader>

              {/* Navigation Links */}
              <nav
                className="flex flex-col gap-1 px-4 pt-4"
                aria-label="Mobile"
              >
                {navItems.map((item) => (
                  <SheetClose
                    key={item.label}
                    nativeButton={false}
                    render={
                      <Link
                        href={item.href}
                        className={mobileNavLinkClassName}
                      />
                    }
                  >
                    {item.label}
                  </SheetClose>
                ))}
              </nav>

              {/* Authentication Buttons */}
              <div className="mt-auto flex flex-col gap-2 px-4 pb-6">
                {session?.user ? (
                  <SheetClose
                    render={
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className={cn(
                          mobileNavLinkClassName,
                          "justify-center border border-border"
                        )}
                      />
                    }
                  >
                    Sign Out
                  </SheetClose>
                ) : (
                  <>
                    <SheetClose
                    nativeButton={false}
                      render={
                        <Link
                          href="/sign-in"
                          className={cn(
                            mobileNavLinkClassName,
                            "justify-center border border-border"
                          )}
                        />
                      }
                    >
                      Sign In
                    </SheetClose>

                    <SheetClose
                    nativeButton={false}
                      render={
                        <Link
                          href="/sign-up"
                          className={cn(
                            buttonVariants(),
                            "h-10 w-full rounded-xl"
                          )}
                        />
                      }
                    >
                      Get Started
                    </SheetClose>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export { SiteHeader }
