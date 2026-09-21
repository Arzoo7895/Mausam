import { cn } from '@/lib/utils'

export function AppContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>{children}</div>
}

export function AppPage({ children, className }: { children: React.ReactNode; className?: string }) {
  return <main className={cn('min-h-screen overflow-x-hidden bg-background text-foreground', className)}>{children}</main>
}
