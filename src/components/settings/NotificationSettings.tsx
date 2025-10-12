import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { mockSettings } from "@/lib/mock-data";

export function NotificationSettings() {
  const settings = mockSettings.notifications;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Configure email notification settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="emailNotifications"
              defaultChecked={settings.emailNotifications}
            />
            <Label htmlFor="emailNotifications">Enable Email Notifications</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminEmails">Admin Email Addresses</Label>
            <div className="space-y-2">
              {settings.adminEmails.map((email, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    defaultValue={email}
                    placeholder="admin@example.com"
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon">
                    ×
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm">
                + Add Email
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Webhook Integrations</CardTitle>
          <CardDescription>
            Configure webhook notifications for external services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="slackWebhook">Slack Webhook URL</Label>
            <Input
              id="slackWebhook"
              type="url"
              defaultValue={settings.slackWebhook}
              placeholder="https://hooks.slack.com/services/..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discordWebhook">Discord Webhook URL</Label>
            <Input
              id="discordWebhook"
              type="url"
              defaultValue={settings.discordWebhook}
              placeholder="https://discord.com/api/webhooks/..."
            />
          </div>

          <div className="flex justify-end">
            <Button>Save Notification Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
