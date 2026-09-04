import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background-elevated group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-foreground-muted",
          actionButton: "group-[.toast]:bg-accent group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-background-overlay group-[.toast]:text-foreground-muted",
        },
      }}
      {...props}
    />
  )
}
export { Toaster }