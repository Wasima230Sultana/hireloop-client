import Image from "next/image"
import Link from "next/link"

import ctaBg from "@/app/images/cta-bg.png"
import logo from "@/app/images/logo.png"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "cn"

type FooterLink = {
  label: string
  href: string
}

type FooterColumn = {
  title: string
  links: FooterLink[]
}

const footerColumns: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Job discovery", href: "#jobs" },
      { label: "Worker AI", href: "#worker-ai" },
      { label: "Companies", href: "#companies" },
      { label: "Salary data", href: "#salary-data" },
    ],
  },
  {
    title: "Navigations",
    links: [
      { label: "Help center", href: "#help" },
      { label: "Career library", href: "#career-library" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Brand Guideline", href: "#brand-guideline" },
      { label: "Newsroom", href: "#newsroom" },
    ],
  },
]

const socialLinks: FooterLink[] = [
  { label: "Facebook", href: "https://facebook.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
]

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8.01h4.56V24H.22V8.01zM8.34 8.01h4.37v2.18h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.47 3.04 5.47 6.99V24h-4.56v-7.28c0-1.74-.03-3.98-2.42-3.98-2.43 0-2.8 1.89-2.8 3.85V24H8.34V8.01z" />
    </svg>
  )
}

const socialIcons: Record<
  string,
  (props: React.SVGProps<SVGSVGElement>) => React.ReactElement
> = {
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  LinkedIn: LinkedinIcon,
}

function SiteFooter() {
  return (
    <footer className="relative border-t border-border/60">
      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[560px] overflow-hidden"
        >
          <div className="absolute left-1/2 top-0 h-[440px] w-[min(900px,100%)] -translate-x-1/2">
            <div
              className="absolute inset-0 rounded-b-[50%] bg-[radial-gradient(closest-side,rgba(99,102,241,0.45),rgba(99,102,241,0.12)_65%,transparent)] blur-2xl"
            />
            <Image
              fill
              src={ctaBg}
              alt=""
              sizes="(max-width: 900px) 100vw, 900px"
              className="object-cover object-top opacity-80 mix-blend-screen"
            />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-6 pt-24 pb-16 text-center md:pt-32 md:pb-20">
          <h2 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Your next role is
            <br />
            already looking for you
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Build a profile in three minutes. The matches start arriving
            tomorrow morning.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/sign-up"
              className={cn(
                buttonVariants(),
                "h-11 rounded-xl bg-foreground px-6 text-background hover:bg-foreground/90"
              )}
            >
              Create a free account
            </Link>
            <Link
              href="#pricing"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-11 rounded-xl border-border bg-background/60 px-6 backdrop-blur"
              )}
            >
              View pricing
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 pb-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Image
              src={logo}
              alt="HireLoop"
              className="h-9 w-auto"
              priority
            />
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              The AI-native career platform. Built for people who take their
              work seriously.
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-primary">
                {column.title}
              </h3>
              <ul className="mt-5 space-y-3.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="mt-14 bg-border/60" />

        <div className="mt-7 flex flex-col-reverse items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2.5">
            {socialLinks.map((social) => {
              const Icon = socialIcons[social.label]

              return (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "icon" }),
                    "size-9 rounded-lg border-border bg-background/60 text-muted-foreground backdrop-blur hover:bg-primary hover:text-primary-foreground"
                  )}
                >
                  <Icon className="size-4" />
                </Link>
              )
            })}
          </div>

          <p className="text-sm text-muted-foreground">
            Copyright 2024 — Programming Hero
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="#terms" className="transition-colors hover:text-foreground">
              Terms &amp; Policy
            </Link>
            <span aria-hidden className="text-border">
              —
            </span>
            <Link
              href="#privacy"
              className="transition-colors hover:text-foreground"
            >
              Privacy Guideline
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { SiteFooter }
