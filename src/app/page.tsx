import MainFlow from "@/components/main-flow"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden">
      {/* Festive Background Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/40 via-background to-background pointer-events-none" />
      
      {/* Decorative Clouds/Patterns - simplified with CSS radial gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle,_rgba(251,192,45,0.1)_0%,_transparent_70%)] blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle,_rgba(251,192,45,0.1)_0%,_transparent_70%)] blur-3xl pointer-events-none" />

      {/* Floating Gold Particles Effect (Optional - can be done with CSS later, keeping it clean for now) */}
      
      <div className="relative z-10 w-full">
        <MainFlow />
      </div>
    </main>
  )
}
