import React, { useState } from "react";
import { SettingsLayout } from "@/components/layout/SettingsLayout";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Key, Laptop, Smartphone, Globe, Copy, RefreshCw, Check } from "lucide-react";
import { toast } from "@/lib/toast";

export const SecuritySettings = () => {
  const { security, updateSecurity } = useSettingsStore();

  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [copiedCode, setCopiedCode] = useState(null);

  const RECOVERY_CODES = [
    "A7B2-9F81-C3D4", "E5F6-G7H8-I9J0", "K1L2-M3N4-O5P6",
    "Q7R8-S9T0-U1V2", "W3X4-Y5Z6-A7B8", "C9D0-E1F2-G3H4",
    "I5J6-K7L8-M9N0", "O1P2-Q3R4-S5T6"
  ];

  const LOGIN_HISTORY = [
    { id: 1, device: "MacBook Pro 14\"", browser: "Chrome 120", location: "San Francisco, CA", ip: "192.168.1.1", time: "Active now", current: true },
    { id: 2, device: "iPhone 13 Pro", browser: "Safari Mobile", location: "San Francisco, CA", ip: "10.0.0.45", time: "2 hours ago", current: false },
    { id: 3, device: "Windows PC", browser: "Firefox 118", location: "Seattle, WA", ip: "172.16.0.2", time: "Yesterday", current: false },
  ];

  const handleEnable2FA = () => {
    if (authCode.length === 6) {
      updateSecurity({ twoFactorEnabled: true });
      setIs2FAModalOpen(false);
      setAuthCode("");
      toast.success("Two-factor authentication enabled");
    } else {
      toast.error("Invalid authentication code");
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <SettingsLayout 
      title="Security" 
      description="Protect your account with extra security layers."
    >
      <div className="space-y-10">
        
        {/* Change Password (Shortcut) */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
            Password
          </h3>
          <div className="flex items-center justify-between p-4 rounded-lg bg-background-elevated border border-border">
            <div>
              <p className="text-sm font-medium text-foreground">Change Password</p>
              <p className="text-xs text-foreground-subtle mt-1">
                You can change your password from the Account settings page.
              </p>
            </div>
            <Button variant="outline" className="h-8 text-xs bg-background hover:bg-background-hover">
              Go to Account
            </Button>
          </div>
        </div>

        {/* 2FA */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
            Two-Factor Authentication (2FA)
          </h3>
          <div className="p-4 rounded-lg bg-background-elevated border border-border flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded ${security.twoFactorEnabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-foreground-muted/10 text-foreground-muted'}`}>
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground flex items-center gap-2">
                  Authenticator App
                  {security.twoFactorEnabled ? (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-semibold">Enabled</span>
                  ) : (
                    <span className="text-[10px] bg-foreground-muted/20 text-foreground-muted px-1.5 py-0.5 rounded uppercase font-semibold">Disabled</span>
                  )}
                </p>
                <p className="text-xs text-foreground-subtle mt-1 max-w-md">
                  Add an additional layer of security to your account by requiring a code from a mobile app like Google Authenticator or Authy.
                </p>
              </div>
            </div>
            {security.twoFactorEnabled ? (
              <Button 
                variant="outline" 
                onClick={() => {
                  updateSecurity({ twoFactorEnabled: false });
                  toast.success("Two-factor authentication disabled");
                }}
                className="shrink-0 h-9 border-red-500/30 text-red-400 hover:text-red-500 hover:bg-red-500/10"
              >
                Disable 2FA
              </Button>
            ) : (
              <Button 
                onClick={() => setIs2FAModalOpen(true)}
                className="shrink-0 h-9 bg-accent hover:bg-accent-hover text-white"
              >
                Enable 2FA
              </Button>
            )}
          </div>
        </div>

        {/* Recovery Codes */}
        {security.twoFactorEnabled && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="text-sm font-semibold text-foreground">
                Recovery Codes
              </h3>
              <Button variant="ghost" className="h-6 text-xs text-accent hover:text-accent-hover px-2 -mr-2">
                <RefreshCw className="h-3 w-3 mr-1.5" />
                Regenerate Codes
              </Button>
            </div>
            <p className="text-xs text-foreground-subtle max-w-2xl">
              Recovery codes can be used to access your account in the event you lose access to your device and cannot receive two-factor authentication codes.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              {RECOVERY_CODES.map((code) => (
                <div key={code} className="flex items-center justify-between p-2.5 rounded bg-background-elevated border border-border font-mono text-sm text-foreground">
                  <span>{code}</span>
                  <button 
                    onClick={() => copyCode(code)}
                    className="p-1.5 text-foreground-muted hover:text-foreground rounded hover:bg-background transition-colors"
                  >
                    {copiedCode === code ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Login History */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
            Login History
          </h3>
          <div className="border border-border rounded-lg overflow-hidden bg-background-elevated">
            <div className="divide-y divide-border">
              {LOGIN_HISTORY.map((session) => (
                <div key={session.id} className="p-4 flex items-start gap-4">
                  <div className="p-2 rounded bg-background shrink-0 border border-border">
                    {session.device.includes("iPhone") ? (
                      <Smartphone className="h-5 w-5 text-foreground-muted" />
                    ) : (
                      <Laptop className="h-5 w-5 text-foreground-muted" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-foreground flex items-center gap-2">
                          {session.device}
                          {session.current && (
                            <span className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded uppercase font-semibold">Current Session</span>
                          )}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-foreground-subtle mt-1.5">
                          <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> {session.browser}</span>
                          <span>•</span>
                          <span>{session.location}</span>
                          <span>•</span>
                          <span>{session.ip}</span>
                        </div>
                      </div>
                      <span className="text-xs text-foreground-muted shrink-0 mt-0.5">{session.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 2FA Setup Modal */}
      <Dialog open={is2FAModalOpen} onOpenChange={setIs2FAModalOpen}>
        <DialogContent className="sm:max-w-md bg-background-elevated border-border text-foreground">
          <DialogHeader>
            <DialogTitle>Set up Two-Factor Authentication</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            
            <div className="text-sm text-foreground-subtle space-y-2">
              <p>1. Install an authenticator app on your mobile device (e.g., Google Authenticator, Authy).</p>
              <p>2. Scan the QR code below with the app.</p>
            </div>
            
            <div className="flex justify-center p-4 bg-white rounded-lg mx-auto w-48 h-48 border border-neutral-200">
              {/* Mock QR Code */}
              <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=otpauth://totp/CollabIDE:manish%40collabide.dev?secret=JBSWY3DPEHPK3PXP&issuer=CollabIDE')] bg-cover bg-center opacity-90" />
            </div>
            
            <div className="space-y-2 text-center">
              <p className="text-xs text-foreground-subtle">Or enter this code manually:</p>
              <code className="bg-background px-2 py-1 rounded text-sm font-mono tracking-widest border border-border inline-block">JBSW Y3DP EHPK 3PXP</code>
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              <label className="text-sm font-medium text-foreground">
                3. Enter the 6-digit code from your app
              </label>
              <Input 
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000" 
                className="bg-background font-mono tracking-[0.5em] text-center text-lg h-12"
                maxLength={6}
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIs2FAModalOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleEnable2FA} 
                disabled={authCode.length !== 6}
                className="bg-accent text-white hover:bg-accent-hover disabled:opacity-50"
              >
                Verify & Enable
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SettingsLayout>
  );
};
