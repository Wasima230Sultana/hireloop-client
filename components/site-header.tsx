import Image from "next/image"
import Link from "next/link"
import { ChevronDownIcon, MenuIcon } from "lucide-react"

import logo from "@/app/images/logo.png"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "cn"

type NavLink = {
  label: string
  href: string
}

type NavItem = NavLink & {
  children?: NavLink[]
}

const navItems: NavItem[] = [
  { label: "About Us", href: "#about" },
  {
    label: "Job Seeker",
    href: "#job-seeker",
    children: [
      { label: "Browse Jobs", href: "#jobs" },
      { label: "My Applications", href: "#applications" },
      { label: "Saved Jobs", href: "#saved-jobs" },
      { label: "Career Resources", href: "#resources" },
    ],
  },
  {
    label: "Employers",
    href: "#employers",
    children: [
      { label: "Post a Job", href: "#post-job" },
      { label: "Browse Candidates", href: "#candidates" },
      { label: "Pricing", href: "#pricing" },
      { label: "Employer Dashboard", href: "#dashboard" },
    ],
  },
  {
    label: "Company",
    href: "#company",
    children: [
      { label: "About Us", href: "#about" },
      { label: "Our Team", href: "#team" },
      { label: "Blog", href: "#blog" },
      { label: "Contact Us", href: "#contact" },
    ],
  },
]

const navLinkClassName =
  "group inline-flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-medium text-foreground/90 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 data-popup-open:bg-muted data-popup-open:text-foreground data-open:bg-muted data-open:text-foreground"

const mobileNavLinkClassName =
  "flex h-11 items-center rounded-lg px-3 text-sm font-medium text-foreground/90 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-6 md:h-20">
        <Link href="/" aria-label="HireLoop home" className="shrink-0">
          <Image src={logo} alt="HireLoop" className="h-8 w-auto md:h-10" />
        </Link>

        <div className="flex items-center gap-1 md:gap-2">
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {navItems.map((item) =>
              item.children ? (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger className={navLinkClassName}>
                    {item.label}
                    <ChevronDownIcon className="size-3.5 text-foreground/60 transition-transform duration-200 group-data-popup-open:rotate-180 group-data-open:rotate-180" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-auto min-w-52"
                  >
                    {item.children.map((child) => (
                      <DropdownMenuItem
                        key={child.label}
                        className="cursor-pointer"
                        render={<Link href={child.href} />}
                      >
                        {child.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={navLinkClassName}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/sign-up"
              className={cn(
                buttonVariants(),
                "hidden rounded-xl px-4 md:inline-flex md:h-10 md:px-5"
              )}
            >
              Get Started
            </Link>

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
              <SheetContent side="right" className="gap-0">
                <SheetHeader className="border-b border-border">
                  <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                  <Link href="/" aria-label="HireLoop home">
                    <Image src={logo} alt="HireLoop" className="h-8 w-auto" />
                  </Link>
                </SheetHeader>
                <nav
                  className="flex flex-col gap-1 px-4 pt-2"
                  aria-label="Mobile"
                >
                  {navItems.map((item) => (
                    <SheetClose
                      key={item.label}
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
                <div className="mt-auto px-4 pb-6">
                  <Link
                    href="/sign-up"
                    className={cn(buttonVariants(), "h-10 w-full rounded-xl")}
                  >
                    Get Started
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

export { SiteHeader }
