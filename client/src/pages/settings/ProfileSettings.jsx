import React, { useState } from "react";
import { SettingsLayout } from "@/components/layout/SettingsLayout";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera, Globe, MapPin, User, AtSign, Clock } from "lucide-react";

export const ProfileSettings = () => {
  const { profile, updateProfile } = useSettingsStore();
  const [localProfile, setLocalProfile] = useState(profile);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null); // 'available' | 'taken' | null

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalProfile((prev) => ({ ...prev, [name]: value }));
    
    // Auto-save debounced would be ideal, but for mock purposes we save directly on change
    if (name !== 'username') {
      updateProfile({ [name]: value });
    }
  };

  const handleUsernameChange = (e) => {
    const val = e.target.value;
    setLocalProfile((prev) => ({ ...prev, username: val }));
    
    // Mock availability check
    if (val !== profile.username && val.length > 2) {
      setIsCheckingUsername(true);
      setTimeout(() => {
        setIsCheckingUsername(false);
        const taken = ["admin", "root", "collabide"].includes(val.toLowerCase());
        setUsernameStatus(taken ? 'taken' : 'available');
        if (!taken) {
          updateProfile({ username: val });
        }
      }, 500);
    } else {
      setUsernameStatus(null);
      if (val === profile.username) {
        updateProfile({ username: val });
      }
    }
  };

  return (
    <SettingsLayout 
      title="Public Profile" 
      description="Manage your personal information and how you appear to others on CollabIDE."
    >
      <div className="space-y-8">
        
        {/* Avatar Upload */}
        <div className="flex items-center gap-6">
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full overflow-hidden border border-border bg-background-elevated relative z-0">
              {localProfile.avatar ? (
                <img src={localProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-foreground-subtle" />
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground mb-1">Profile picture</h3>
            <p className="text-xs text-foreground-subtle mb-3">
              JPEG, PNG or GIF. Max 5MB.
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" className="h-8 text-xs">
                Upload new image
              </Button>
              {localProfile.avatar && (
                <Button size="sm" variant="outline" className="h-8 text-xs text-red-400 hover:text-red-500 hover:bg-red-500/10 border-border">
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-border" />

        <div className="grid gap-6">
          {/* Display Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Display Name</label>
            <Input 
              name="displayName"
              value={localProfile.displayName} 
              onChange={handleChange}
              className="max-w-md bg-background-elevated"
            />
          </div>

          {/* Username */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center justify-between max-w-md">
              Username
              {isCheckingUsername && <span className="text-[10px] text-foreground-subtle animate-pulse">Checking availability...</span>}
              {!isCheckingUsername && usernameStatus === 'available' && <span className="text-[10px] text-emerald-400">Available</span>}
              {!isCheckingUsername && usernameStatus === 'taken' && <span className="text-[10px] text-red-400">Username taken</span>}
            </label>
            <div className="relative max-w-md">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <AtSign className="h-4 w-4 text-foreground-subtle" />
              </div>
              <Input 
                name="username"
                value={localProfile.username} 
                onChange={handleUsernameChange}
                className={`pl-9 bg-background-elevated ${usernameStatus === 'taken' ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}`}
              />
            </div>
            <p className="text-[11px] text-foreground-subtle">
              Your profile URL: collabide.dev/{localProfile.username || 'username'}
            </p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center justify-between max-w-md">
              Bio
              <span className={`text-xs ${localProfile.bio.length > 160 ? 'text-red-400' : 'text-foreground-subtle'}`}>
                {localProfile.bio.length}/160
              </span>
            </label>
            <textarea
              name="bio"
              value={localProfile.bio}
              onChange={handleChange}
              rows={3}
              className="w-full max-w-md rounded-md border border-border bg-background-elevated px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent placeholder:text-foreground-muted resize-none"
              placeholder="Tell us a little bit about yourself"
            />
          </div>

          {/* Details row */}
          <div className="grid sm:grid-cols-2 gap-6 max-w-md">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Location</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <MapPin className="h-4 w-4 text-foreground-subtle" />
                </div>
                <Input 
                  name="location"
                  value={localProfile.location} 
                  onChange={handleChange}
                  className="pl-9 bg-background-elevated"
                  placeholder="e.g. San Francisco, CA"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Website</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Globe className="h-4 w-4 text-foreground-subtle" />
                </div>
                <Input 
                  name="website"
                  value={localProfile.website} 
                  onChange={handleChange}
                  className="pl-9 bg-background-elevated"
                  placeholder="https://"
                />
              </div>
            </div>
          </div>

          {/* Timezone */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Timezone</label>
            <div className="relative max-w-md">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                <Clock className="h-4 w-4 text-foreground-subtle" />
              </div>
              <select
                name="timezone"
                value={localProfile.timezone}
                onChange={handleChange}
                className="w-full h-9 pl-9 pr-3 rounded-md border border-border bg-background-elevated text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent appearance-none"
              >
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Central European Time (CET)</option>
                <option value="Asia/Kolkata">India Standard Time (IST)</option>
                <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
              </select>
            </div>
            <p className="text-[11px] text-foreground-subtle">
              Used to display local time on your profile and coordinate collaboration.
            </p>
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
};
