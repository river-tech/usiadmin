import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StorageSettings } from "@/components/settings/StorageSettings";
import { StripeSettings } from "@/components/settings/StripeSettings";
import { MaintenanceSettings } from "@/components/settings/MaintenanceSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { Settings, Database, CreditCard, Wrench, Bell } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure system settings and integrations"
      />

      <Tabs defaultValue="storage" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="storage" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Storage
          </TabsTrigger>
          <TabsTrigger value="stripe" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Stripe
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Maintenance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="storage">
          <StorageSettings />
        </TabsContent>

        <TabsContent value="stripe">
          <StripeSettings />
        </TabsContent>

        <TabsContent value="maintenance">
          <MaintenanceSettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
