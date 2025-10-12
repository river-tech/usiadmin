"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Plus, Save, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkflowFormProps {
  isEdit?: boolean;
  initialData?: any;
}

export function WorkflowForm({ isEdit = false, initialData }: WorkflowFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    price: initialData?.price || "",
    tags: initialData?.tags || [],
    jsonData: initialData?.jsonData || "",
    previewImage: null as File | null
  });
  const [newTag, setNewTag] = useState("");

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, previewImage: file }));
    }
  };

  const handleSubmit = () => {
    console.log("Submitting workflow:", formData);
    // In a real app, you'd make an API call here
  };

  const steps = [
    { id: 1, title: "Upload JSON", description: "Upload your workflow JSON file" },
    { id: 2, title: "Details", description: "Add title, description, and category" },
    { id: 3, title: "Pricing & Tags", description: "Set price and add tags" },
    { id: 4, title: "Preview", description: "Review and publish" }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
              currentStep >= step.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}>
              {step.id}
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium">{step.title}</p>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <div className="w-16 h-px bg-border mx-4" />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isEdit ? "Edit Workflow" : "Upload New Workflow"}
          </CardTitle>
          <CardDescription>
            {steps[currentStep - 1].description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={currentStep.toString()} onValueChange={(value) => setCurrentStep(parseInt(value))}>
            <TabsList className="grid w-full grid-cols-4">
              {steps.map((step) => (
                <TabsTrigger key={step.id} value={step.id.toString()}>
                  {step.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Step 1: Upload JSON */}
            <TabsContent value="1" className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Upload Workflow JSON</h3>
                <p className="text-muted-foreground mb-4">
                  Drag and drop your workflow JSON file here, or click to browse
                </p>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="json-upload"
                />
                <Button asChild>
                  <label htmlFor="json-upload" className="cursor-pointer">
                    Choose File
                  </label>
                </Button>
                {formData.jsonData && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      JSON file loaded successfully
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Step 2: Details */}
            <TabsContent value="2" className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Workflow Title
                  </label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter workflow title"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe your workflow..."
                    className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Category
                  </label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    placeholder="e.g., E-commerce, Marketing, Analytics"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Step 3: Pricing & Tags */}
            <TabsContent value="3" className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label htmlFor="price" className="text-sm font-medium">
                    Price ($)
                  </label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Step 4: Preview */}
            <TabsContent value="4" className="space-y-4">
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <h3 className="font-medium">{formData.title || "Untitled Workflow"}</h3>
                    <p className="text-sm text-muted-foreground">{formData.description}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-medium">Category:</span>
                    <Badge variant="outline">{formData.category}</Badge>
                    <span className="font-medium">Price:</span>
                    <span>${formData.price}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              {currentStep === 4 ? (
                <Button onClick={handleSubmit}>
                  <Save className="h-4 w-4 mr-2" />
                  {isEdit ? "Save Changes" : "Publish Workflow"}
                </Button>
              ) : (
                <Button onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}>
                  Next
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
