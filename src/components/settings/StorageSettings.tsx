import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { mockSettings } from "@/lib/mock-data";

export function StorageSettings() {
  const settings = mockSettings.storage;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Storage Configuration</CardTitle>
          <CardDescription>
            Configure file storage settings for workflow uploads
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                defaultValue={settings.maxFileSize}
                placeholder="10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storageProvider">Storage Provider</Label>
              <select
                id="storageProvider"
                defaultValue={settings.storageProvider}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="local">Local Storage</option>
                <option value="aws">AWS S3</option>
                <option value="gcp">Google Cloud Storage</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Allowed File Types</Label>
            <div className="flex flex-wrap gap-2">
              {settings.allowedTypes.map((type) => (
                <span
                  key={type}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  .{type}
                </span>
              ))}
            </div>
          </div>

          {settings.storageProvider === 'aws' && settings.awsConfig && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <h4 className="font-medium">AWS Configuration</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="awsBucket">S3 Bucket</Label>
                  <Input
                    id="awsBucket"
                    defaultValue={settings.awsConfig.bucket}
                    placeholder="my-bucket"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="awsRegion">Region</Label>
                  <Input
                    id="awsRegion"
                    defaultValue={settings.awsConfig.region}
                    placeholder="us-east-1"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="awsAccessKey">Access Key</Label>
                  <Input
                    id="awsAccessKey"
                    type="password"
                    defaultValue={settings.awsConfig.accessKey}
                    placeholder="AKIAIOSFODNN7EXAMPLE"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button>Save Storage Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
