import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/shared/Skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Search, Loader2 } from "lucide-react";

export default function Showcase() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-bold text-foreground">Component Showcase</h1>
        <p className="text-foreground-muted mt-2">A visual regression page for design system elements.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="default" disabled>Disabled</Button>
          <Button variant="default"><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Inputs</h2>
        <div className="max-w-md space-y-4">
          <Input placeholder="Default Input" />
          <Input disabled placeholder="Disabled Input" />
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-foreground-muted" />
            <Input className="pl-9" placeholder="Search..." />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Empty States</h2>
        <div className="border border-border rounded-lg bg-background-elevated p-8">
          <EmptyState 
            title="No projects found" 
            description="Create a new project to get started." 
            action={{ label: "Create Project", onClick: () => {} }} 
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Modal Demo</h2>
        <div className="flex items-center gap-4">
          <Button variant="primary" onClick={() => setModalOpen(true)}>Open Modal</Button>
          <span className="text-sm text-foreground-muted">State: {modalOpen ? "open" : "closed"}</span>
        </div>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-background-elevated border border-border rounded-2xl p-8 max-w-sm w-full shadow-2xl space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Demo Modal</h3>
              <p className="text-sm text-foreground-muted">This modal is wired up for the component showcase.</p>
              <Button variant="outline" onClick={() => setModalOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Skeletons</h2>
        <div className="space-y-4 max-w-md">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
