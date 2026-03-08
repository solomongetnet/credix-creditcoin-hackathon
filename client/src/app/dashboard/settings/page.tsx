"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bell, Eye, Lock, Globe, Smartphone, Mail, Check } from "lucide-react";

interface Setting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  icon: any;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([
    {
      id: "email-notifications",
      label: "Email Notifications",
      description: "Receive updates about your loans and credit score",
      enabled: true,
      icon: Mail,
    },
    {
      id: "push-notifications",
      label: "Push Notifications",
      description: "Get alerts on your mobile device",
      enabled: true,
      icon: Smartphone,
    },
    {
      id: "payment-reminders",
      label: "Payment Reminders",
      description: "Reminder emails before payment due dates",
      enabled: true,
      icon: Bell,
    },
    {
      id: "security-alerts",
      label: "Security Alerts",
      description: "Alerts for suspicious account activity",
      enabled: true,
      icon: Lock,
    },
    {
      id: "marketing-emails",
      label: "Marketing Emails",
      description: "News, updates, and promotional offers",
      enabled: false,
      icon: Eye,
    },
    {
      id: "language-preference",
      label: "Language Preference",
      description: "Set your preferred language",
      enabled: true,
      icon: Globe,
    },
  ]);

  const [saveMessage, setSaveMessage] = useState("");

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting,
      ),
    );
  };

  const handleSaveAll = () => {
    // Mock save
    setSaveMessage("Settings saved successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">Settings</h1>
        <p className="text-foreground/70 mt-2">
          Manage your account preferences and notifications
        </p>
      </div>

      {/* Success Message */}
      {saveMessage && (
        <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 flex items-center gap-3 text-muted-foreground">
          <Check className="w-5 h-5" />
          {saveMessage}
        </div>
      )}

      {/* Notification Settings */}
      <Card className="bg-card border border-border p-8">
        <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Notifications
        </h3>

        <div className="space-y-4">
          {settings.map((setting) => {
            const Icon = setting.icon;
            return (
              <div
                key={setting.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Icon className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">
                      {setting.label}
                    </p>
                    <p className="text-sm text-foreground/60">
                      {setting.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSetting(setting.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    setting.enabled ? "bg-accent" : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      setting.enabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex gap-3">
          <Button
            onClick={handleSaveAll}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Save Settings
          </Button>
          <Button variant="outline">Reset to Default</Button>
        </div>
      </Card>

      {/* Privacy Settings */}
      <Card className="bg-card border border-border p-8">
        <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5 text-muted-foreground" />
          Privacy & Security
        </h3>

        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-border bg-muted/20">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-foreground">
                Data Sharing with Partners
              </p>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1 transition-transform" />
              </button>
            </div>
            <p className="text-sm text-foreground/60">
              Allow our partners to use your data for better recommendations
            </p>
          </div>

          <div className="p-4 rounded-lg border border-border bg-muted/20">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-foreground">Marketing Research</p>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1 transition-transform" />
              </button>
            </div>
            <p className="text-sm text-foreground/60">
              Participate in surveys and studies to help us improve
            </p>
          </div>

          <div className="p-4 rounded-lg border border-border bg-muted/20">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-foreground">Session Timeout</p>
              <select className="bg-background border border-border rounded px-3 py-1 text-foreground text-sm">
                <option>5 minutes</option>
                <option>10 minutes</option>
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>Never</option>
              </select>
            </div>
            <p className="text-sm text-foreground/60">
              How long before your session automatically logs out
            </p>
          </div>
        </div>
      </Card>

      {/* Connected Devices */}
      <Card className="bg-card border border-border p-8">
        <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-primary" />
          Connected Devices
        </h3>

        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-border flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Chrome on macOS</p>
              <p className="text-sm text-foreground/60">
                Last active: Today at 2:30 PM
              </p>
            </div>
            <span className="text-xs bg-accent/20 text-muted-foreground px-3 py-1 rounded-full">
              Current
            </span>
          </div>

          <div className="p-4 rounded-lg border border-border flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Safari on iPhone</p>
              <p className="text-sm text-foreground/60">
                Last active: Yesterday at 9:15 AM
              </p>
            </div>
            <button className="text-foreground/60 hover:text-foreground text-sm">
              Remove
            </button>
          </div>

          <div className="p-4 rounded-lg border border-border flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Firefox on Windows</p>
              <p className="text-sm text-foreground/60">
                Last active: 3 days ago
              </p>
            </div>
            <button className="text-foreground/60 hover:text-foreground text-sm">
              Remove
            </button>
          </div>
        </div>

        <p className="text-xs text-foreground/60 mt-4 p-3 bg-muted rounded">
          Unrecognized devices? Remove them for security. You'll need to log in
          again if you remove current device.
        </p>
      </Card>

      {/* API Keys & Integrations */}
      <Card className="bg-card border border-border p-8">
        <h3 className="text-xl font-semibold text-foreground mb-6">
          API & Integrations
        </h3>

        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-foreground">API Keys</p>
              <Button variant="outline" size="sm">
                Manage Keys
              </Button>
            </div>
            <p className="text-sm text-foreground/60">
              Generate and manage API keys for integrations
            </p>
          </div>

          <div className="p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-foreground">Webhooks</p>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            <p className="text-sm text-foreground/60">
              Set up webhooks for real-time notifications
            </p>
          </div>
        </div>
      </Card>

      {/* Export & Data */}
      <Card className="bg-card border border-border p-8">
        <h3 className="text-xl font-semibold text-foreground mb-6">
          Export & Data
        </h3>

        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-foreground">Export Your Data</p>
              <Button variant="outline" size="sm">
                Download
              </Button>
            </div>
            <p className="text-sm text-foreground/60">
              Download a copy of your personal data in JSON format
            </p>
          </div>

          <div className="p-4 rounded-lg border border-destructive/20 bg-destructive/5">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-foreground">Delete All Data</p>
              <Button
                variant="outline"
                size="sm"
                className="border-destructive text-destructive"
              >
                Delete
              </Button>
            </div>
            <p className="text-sm text-foreground/60">
              Permanently delete all your data. This action cannot be undone.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
