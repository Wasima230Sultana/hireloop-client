import Image from "next/image"
import {
  BriefcaseIcon,
  Building2Icon,
  FlameIcon,
  TargetIcon,
  UsersIcon,
} from "lucide-react"

import globeImage from "@/app/images/globe.png"
import { Badge } from "@/components/ui/badge"
import { HeroSearch } from "@/components/hero-search"

const stats = [
  { icon: BriefcaseIcon, value: "50K", label: "Active Jobs" },
  { icon: Building2Icon, value: "12K", label: "Employers" },
  { icon: UsersIcon, value: "2M", label: "Job Seekers" },
  { icon: TargetIcon, value: "97%", label: "Success Rate" },
] as const

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-6 pt-12 text-center md:pt-16">
        <Badge
          variant="outline"
          className="h-auto gap-1.5 rounded-full border-border bg-muted/40 px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-foreground backdrop-blur md:text-xs"
        >
          <FlameIcon className="text-orange-400" />
          50,000+ JOBS OPEN THIS WEEK
        </Badge>

        <h1 className="mx-auto mt-7 max-w-5xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-7xl">
          Find Your Dream Job Today
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          HireLoop connects talented professionals with top employers worldwide.
          Thousands of new opportunities await you.
        </p>

        <div className="mt-10">
          <HeroSearch />
        </div>
      </div>

      <div className="relative mt-4 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/4 left-1/2 h-[380px] w-[min(1020px,92%)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,58,237,0.22),transparent_70%)] blur-3xl"
        />
        <div className="relative mx-auto h-[560px] w-full max-w-[760px] overflow-hidden md:h-[720px]">
          <Image
            fill
            src={globeImage}
            alt=""
            sizes="(max-width: 760px) 100vw, 760px"
            className="object-cover object-bottom select-none dark:mix-blend-screen"
          />
          <p className="absolute inset-x-0 top-[48%] mx-auto max-w-md -translate-y-1/2 px-6 text-center text-xl leading-snug font-medium text-foreground md:text-2xl">
            Assisting over 15,000 job seekers find their dream positions.
          </p>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto -mt-[18px] grid w-full max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-6 pb-16 md:grid-cols-4 md:pb-20">
          {stats.map((stat) => {
            const Icon = stat.icon

            return (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-3 text-center"
              >
                <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-background shadow-sm">
                  <Icon aria-hidden className="size-4 text-foreground" />
                </div>
                <div>
                  <p className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1.5 text-sm text-muted-foreground md:text-base">
                    {stat.label}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export { Hero }
