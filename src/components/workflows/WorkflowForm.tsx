"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { Upload, X, Plus, Save, Eye, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAlert } from "@/contexts/AlertContext";

interface WorkflowFormProps {
  isEdit?: boolean;
  initialData?: any;
}

export function WorkflowForm({ isEdit = false, initialData }: WorkflowFormProps) {
  const { showSuccess, showError } = useAlert();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    price: initialData?.price || "",
    features: initialData?.features || [],
    jsonData: initialData?.jsonData || "",
    previewImage: null as File | null,
    timeToSetup: initialData?.timeToSetup || "",
    videoDemo: initialData?.videoDemo || ""
  });
  const [newFeature, setNewFeature] = useState("");

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((feature: string) => feature !== featureToRemove)
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if it's a JSON file
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const jsonContent = e.target?.result as string;
            const parsedJson = JSON.parse(jsonContent);
            setFormData(prev => ({ 
              ...prev, 
              jsonData: jsonContent,
              previewImage: file 
            }));
            showSuccess("Success", "JSON file uploaded and parsed successfully!");
          } catch (error) {
            showError("Error", "Invalid JSON file. Please check the file format.");
          }
        };
        reader.readAsText(file);
      } else {
        showError("Error", "Please select a valid JSON file (.json)");
      }
    }
  };

  const handleSubmit = () => {
    try {
      console.log("Submitting workflow:", formData);
      // In a real app, you'd make an API call here
      showSuccess("Success", isEdit ? "Workflow updated successfully!" : "Workflow created successfully!");
    } catch (error) {
      showError("Error", isEdit ? "Failed to update workflow. Please try again." : "Failed to create workflow. Please try again.");
    }
  };

  const steps = [
    { id: 1, title: "Upload JSON", description: "Upload your workflow JSON file" },
    { id: 2, title: "Details", description: "Add title, description, and category" },
    { id: 3, title: "Pricing & Features", description: "Set price and add features" },
    { id: 4, title: "Preview", description: "Review and publish" }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-all duration-200",
              currentStep >= step.id
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-500"
            )}>
              {step.id}
            </div>
            <div className="ml-3">
              <p className={cn(
                "text-sm font-medium transition-colors",
                currentStep >= step.id ? "text-gray-900" : "text-gray-500"
              )}>
                {step.title}
              </p>
              <p className="text-xs text-gray-500">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "w-12 h-0.5 mx-4 transition-colors",
                currentStep > step.id ? "bg-gradient-to-r from-blue-500 to-indigo-600" : "bg-gray-200"
              )} />
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
            <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg">
              {steps.map((step) => (
                <TabsTrigger 
                  key={step.id} 
                  value={step.id.toString()}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800 transition-all duration-200"
                >
                  {step.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Step 1: Upload JSON */}
            <TabsContent value="1" className="space-y-4">
              <div className="border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-100 hover:to-indigo-100 transition-all duration-200">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Upload Workflow JSON</h3>
                <p className="text-gray-600 mb-6">
                  Drag and drop your workflow JSON file here, or click to browse
                </p>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="json-upload"
                />
                <Button asChild className="btn-gradient">
                  <label htmlFor="json-upload" className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </label>
                </Button>
                {formData.jsonData && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-center">
                      <div className="bg-green-100 rounded-full p-2 mr-3">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-sm text-green-800 font-medium">
                        JSON file loaded successfully
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Step 2: Details */}
            <TabsContent value="2" className="space-y-4">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-semibold text-gray-700">
                    Workflow Title
                  </label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter workflow title"
                    className="border-blue-200 focus:border-blue-400 focus:ring-blue-100"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-semibold text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe your workflow..."
                    className="w-full min-h-[100px] px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-semibold text-gray-700">
                    Category
                  </label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    placeholder="e.g., E-commerce, Marketing, Analytics"
                    className="border-blue-200 focus:border-blue-400 focus:ring-blue-100"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Step 3: Pricing & Tags */}
            <TabsContent value="3" className="space-y-4">
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="price" className="text-sm font-semibold text-gray-700">
                      Price ($)
                    </label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      className="border-green-200 focus:border-green-400 focus:ring-green-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="timeToSetup" className="text-sm font-semibold text-gray-700">
                      Time to Setup (minutes)
                    </label>
                    <Input
                      id="timeToSetup"
                      type="number"
                      value={formData.timeToSetup}
                      onChange={(e) => handleInputChange("timeToSetup", e.target.value)}
                      placeholder="30"
                      min="1"
                      className="border-purple-200 focus:border-purple-400 focus:ring-purple-100"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="videoDemo" className="text-sm font-semibold text-gray-700">
                    Video Demo URL
                  </label>
                  <Input
                    id="videoDemo"
                    type="url"
                    value={formData.videoDemo}
                    onChange={(e) => handleInputChange("videoDemo", e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="border-orange-200 focus:border-orange-400 focus:ring-orange-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Features</label>
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a feature"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      className="border-pink-200 focus:border-pink-400 focus:ring-pink-100"
                    />
                    <Button type="button" onClick={addFeature} size="icon" className="bg-pink-500 hover:bg-pink-600 text-white">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.features.map((feature: string) => (
                      <Badge key={feature} className="flex items-center gap-1 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-800 border border-pink-200 hover:from-pink-200 hover:to-purple-200">
                        {feature}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-red-500"
                          onClick={() => removeFeature(feature)}
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
                    <CategoryBadge category={formData.category} />
                    <span className="font-medium">Price:</span>
                    <span>${formData.price}</span>
                    <span className="font-medium">Setup Time:</span>
                    <span>{formData.timeToSetup} minutes</span>
                  </div>
                  {formData.videoDemo && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Video Demo:</span>
                      <a href={formData.videoDemo} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-600 hover:underline">
                        Watch Demo
                      </a>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature: string) => (
                      <Badge key={feature} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  {formData.jsonData && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-3 text-gray-800">JSON Preview</h4>
                      <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-64">
                        <pre className="text-green-400 text-sm font-mono">
                          {JSON.stringify(JSON.parse(formData.jsonData), null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
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
              className="px-6"
            >
              Previous
            </Button>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(4)}
                className="px-6"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              {currentStep === 4 ? (
                <Button onClick={handleSubmit} className="btn-gradient px-6">
                  <Save className="h-4 w-4 mr-2" />
                  {isEdit ? "Save Changes" : "Publish Workflow"}
                </Button>
              ) : (
                <Button 
                  onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                  className="btn-gradient px-6"
                >
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
