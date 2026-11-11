import React from "react"

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex w-full flex-col items-center px-6 py-12 md:py-16">
      {children}
    </main>
  )
}

export default AuthLayout
