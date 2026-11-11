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

<section className="relative overflow-hidden border-t border-border">
  {/* Background glow */}
  <div
    aria-hidden
    className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[min(1100px,95%)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,58,237,0.2),transparent)] blur-3xl"
  />

  {/* Top heading */}
  <div className="relative z-10 mx-auto max-w-3xl px-6 pt-20 text-center">
    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-violet-500">
      Our Impact
    </p>

    <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
      Together, We Make a Difference
    </h2>

    <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
      Connecting people, creating opportunities, and building a
      better future through meaningful contributions.
    </p>
  </div>

  {/* Globe and statistics */}
  <div className="relative mx-auto h-[650px] w-full max-w-[1100px] md:h-[700px]">

    {/* Globe background */}
    <div className="absolute inset-0 mx-auto h-full w-full max-w-[760px]">
      <Image
        fill
        src={globeImage}
        alt=""
        sizes="(max-width: 760px) 100vw, 760px"
        className="object-cover object-bottom select-none dark:mix-blend-screen"
      />
    </div>

    {/* Center message */}
    <div className="absolute inset-x-0 top-[40%] md:top-[50%] z-10 mx-auto max-w-md -translate-y-1/2 px-6 text-center">
      <p className="text-xl leading-snug font-semibold text-white drop-shadow-lg md:text-3xl">
        Assisting over 15,000 job seekers find their dream positions.
      </p>
    </div>

    {/* Statistics cards */}
    <div className="absolute inset-x-0 bottom-0 z-10 grid grid-cols-2 gap-3 px-5 md:bottom-12 md:grid-cols-4 md:gap-5 md:px-8">
      {stats.map((stat) => {
        const Icon = stat.icon

        return (
          <div
            key={stat.label}
            className="flex min-h-[155px] flex-col items-center justify-center gap-3 rounded-2xl border border-white/20 bg-background/75 px-3 py-5 text-center shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-violet-400/50 hover:shadow-violet-500/10 md:min-h-[180px] md:px-5"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500 md:size-12">
              <Icon aria-hidden className="size-5" />
            </div>

            <div>
              <p className="text-2xl font-bold tracking-tight text-foreground md:text-4xl">
                {stat.value}
              </p>

              <p className="mt-1.5 text-xs font-medium text-muted-foreground md:text-sm">
                {stat.label}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  </div>
</section>


    </section>
  )
}

export { Hero }
