import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { mockSettings } from "@/lib/mock-data";

export function StripeSettings() {
  const settings = mockSettings.stripe;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stripe Configuration</CardTitle>
          <CardDescription>
            Configure Stripe payment processing settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="stripeEnabled"
              defaultChecked={settings.enabled}
            />
            <Label htmlFor="stripeEnabled">Enable Stripe Payments</Label>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="publishableKey">Publishable Key</Label>
              <Input
                id="publishableKey"
                type="password"
                defaultValue={settings.publishableKey}
                placeholder="pk_test_..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secretKey">Secret Key</Label>
              <Input
                id="secretKey"
                type="password"
                defaultValue={settings.secretKey}
                placeholder="sk_test_..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhookSecret">Webhook Secret</Label>
              <Input
                id="webhookSecret"
                type="password"
                defaultValue={settings.webhookSecret}
                placeholder="whsec_..."
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button>Save Stripe Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
