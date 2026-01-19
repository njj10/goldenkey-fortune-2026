import MainFlow from "@/components/main-flow"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-zinc-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-900/20 via-zinc-950 to-black pointer-events-none" />
      <div className="relative z-10 w-full">
        <MainFlow />
      </div>
    </main>
  )
}
