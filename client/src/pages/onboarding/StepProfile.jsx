import React, { useRef, useState, useEffect } from "react";
import { Camera, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const RESERVED = ["admin", "test", "collabide", "root", "api", "support"];

export const StepProfile = () => {
  const { displayName, username, bio, avatarDataUrl, setProfile } =
    useOnboardingStore();
  const fileRef = useRef(null);
  const [usernameState, setUsernameState] = useState("idle");
  const [dragOver, setDragOver] = useState(false);

  // Debounced username check
  useEffect(() => {
    if (!username) return;
    const id = setTimeout(() => {
      setUsernameState(
        RESERVED.includes(username.toLowerCase()) ? "taken" : "available",
      );
    }, 600);
    return () => clearTimeout(id);
  }, [username]);

  const handleFile = (file) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setProfile({ avatarDataUrl: e.target?.result });
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Let&apos;s set up your profile
        </h2>
        <p className="mt-1 text-sm text-foreground-muted">
          How should your teammates see you?
        </p>
      </div>

      {/* Avatar uploader */}
      <div className="flex flex-col items-center gap-3">
        <div
          className={cn(
            "relative h-24 w-24 rounded-full cursor-pointer group border-2 border-dashed transition-colors",
            dragOver
              ? "border-accent bg-accent/10"
              : "border-border hover:border-border-strong",
          )}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {avatarDataUrl ? (
            <img
              src={avatarDataUrl}
              alt="avatar"
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-accent to-secondary text-white text-xl font-semibold">
              {initials || "?"}
            </div>
          )}
          {/* Overlay */}
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera size={20} className="text-white" />
          </div>
        </div>
        <span className="text-xs text-foreground-subtle">
          Click or drag to upload · PNG, JPG, GIF · max 2MB
        </span>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) handleFile(e.target.files[0]);
          }}
        />
      </div>

      {/* Display name */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground-muted">
          Display name
        </label>
        <Input
          value={displayName}
          onChange={(e) => setProfile({ displayName: e.target.value })}
          placeholder="Rohit Chugh"
        />
      </div>

      {/* Username */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground-muted">
          Username
        </label>
        <div className="relative">
          <Input
            value={username}
            onChange={(e) => {
              const val = e.target.value
                .toLowerCase()
                .replace(/[^a-z0-9_-]/g, "");
              setUsernameState(val ? "checking" : "idle");
              setProfile({ username: val });
            }}
            placeholder="rohit_chugh"
            className={cn(
              "pr-9",
              usernameState === "taken" &&
                "border-danger focus-visible:ring-danger",
              usernameState === "available" &&
                "border-success focus-visible:ring-success",
            )}
          />

          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {usernameState === "checking" && (
              <Loader2
                size={14}
                className="animate-spin text-foreground-subtle"
              />
            )}
            {usernameState === "available" && (
              <CheckCircle2 size={14} className="text-success" />
            )}
            {usernameState === "taken" && (
              <XCircle size={14} className="text-danger" />
            )}
          </span>
        </div>
        {username && (
          <p
            className={cn(
              "text-xs",
              usernameState === "taken"
                ? "text-danger"
                : "text-foreground-subtle",
            )}
          >
            {usernameState === "taken"
              ? "That username is taken. Try another."
              : `collabide.dev/@${username}`}
          </p>
        )}
      </div>

      {/* Bio */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-foreground-muted">
            Short bio <span className="text-foreground-subtle">(optional)</span>
          </label>
          <span
            className={cn(
              "text-xs",
              bio.length > 140
                ? "text-warning"
                : bio.length > 155
                  ? "text-danger"
                  : "text-foreground-subtle",
            )}
          >
            {bio.length}/160
          </span>
        </div>
        <textarea
          value={bio}
          onChange={(e) =>
            setProfile({ bio: e.target.value.substring(0, 160) })
          }
          placeholder="I build things with TypeScript and coffee ☕"
          rows={3}
          className="flex w-full rounded-lg border border-border bg-background-elevated px-3 py-2 text-sm text-foreground placeholder:text-foreground-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent resize-none transition-colors"
        />
      </div>
    </div>
  );
};
