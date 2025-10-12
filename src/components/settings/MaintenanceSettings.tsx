import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { mockSettings } from "@/lib/mock-data";

export function MaintenanceSettings() {
  const settings = mockSettings.maintenance;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Mode</CardTitle>
          <CardDescription>
            Control system maintenance and access restrictions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="maintenanceMode"
              defaultChecked={settings.maintenanceMode}
            />
            <Label htmlFor="maintenanceMode">Enable Maintenance Mode</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
            <Textarea
              id="maintenanceMessage"
              defaultValue={settings.maintenanceMessage}
              placeholder="Enter maintenance message..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="allowedIPs">Allowed IP Addresses</Label>
            <div className="space-y-2">
              {settings.allowedIPs.map((ip, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    defaultValue={ip}
                    placeholder="192.168.1.1"
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon">
                    ×
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm">
                + Add IP Address
              </Button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button>Save Maintenance Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
