"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Plus, Save, Eye, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAlert } from "@/contexts/AlertContext";
import { Category, WorkflowBody } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCategories } from "@/feature/categorSlice";
import { uploadToCloudinary } from "@/api/upload";

interface WorkflowCreateProps {
  onSubmit: (formData: WorkflowBody, imagePreview: string[]) => void;
  categories?: Category[];
  loading?: boolean;
}

export function WorkflowCreate({ onSubmit, categories, loading }: WorkflowCreateProps) {
  const { showSuccess, showError } = useAlert();
  const categoryState = useAppSelector(selectCategories);
  const allCategories: Category[] =
    categoryState?.categories?.length > 0
      ? categoryState.categories
      : categories || [];

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WorkflowBody>({
    title: "",
    description: "",
    price: 0,
    features: [],
    time_to_setup: 0,
    video_demo: "",
    flow: {},
    category_ids: [],
  });

  const [newFeature, setNewFeature] = useState("");
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  // ✳️ Input handler
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ✳️ Add/remove feature
  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feature),
    }));
  };

  // ✳️ Upload workflow JSON
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === "application/json" || file.name.endsWith(".json"))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          setFormData((prev) => ({ ...prev, flow: json }));
          showSuccess("Success", "JSON uploaded successfully!");
        } catch {
          showError("Error", "Invalid JSON file format.");
        }
      };
      reader.readAsText(file);
    } else {
      showError("Error", "Please select a valid JSON (.json)");
    }
  };

  // ✳️ Upload image
  const handleImageUpload = async (file: File) => {
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const upload = await uploadToCloudinary(file, "image");
      if (upload) {
        setImagePreview((prev) => [...prev, upload.url]);
        showSuccess("Image uploaded", "Image asset uploaded successfully");
      }
    } catch (e: any) {
      showError("Upload failed", e.message || "Image upload failed");
    } 
    setIsUploadingImage(false);
  };

  // ✳️ Upload video
  const handleVideoUpload = async (file: File) => {
    if (!file) return;
    setIsUploadingVideo(true);
    try {
      const upload = await uploadToCloudinary(file, "video");
      if (upload) {
        setFormData((prev) => ({ ...prev, video_demo: upload.url }));
        showSuccess("Video uploaded", "Video uploaded successfully");
      }
    } catch (e: any) {
      showError("Upload failed", e.message || "Video upload failed");
    } finally {
      setIsUploadingVideo(false);
    }
  };

  // ✳️ Submit
  const handleSubmit = () => {
    const body: WorkflowBody = {
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      features: formData.features,
      time_to_setup: Number(formData.time_to_setup),
      video_demo: formData.video_demo,
      flow: formData.flow,
      category_ids: formData.category_ids,
    };
    onSubmit(body, imagePreview);
  };

  // ✳️ Steps
  const steps = [
    { id: 1, title: "Upload JSON", description: "Upload your workflow JSON file" },
    { id: 2, title: "Details", description: "Add title, description, and feature" },
    { id: 3, title: "Pricing & Categories", description: "Set price and categories" },
    { id: 4, title: "Preview", description: "Review before publishing" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-all duration-200",
                currentStep >= step.id
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-500"
              )}
            >
              {step.id}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{step.title}</p>
              <p className="text-xs text-gray-500">{step.description}</p>
            </div>
            {index < steps.length - 1 && <div className="w-12 h-0.5 mx-4 bg-gray-200" />}
          </div>
        ))}
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <CardTitle>Upload New Workflow</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={currentStep.toString()} onValueChange={(v) => setCurrentStep(Number(v))}>
            {/* Step 1: Upload JSON */}
            <TabsContent value="1" className="space-y-4">
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50">
                <Upload className="h-10 w-10 text-blue-600 mx-auto mb-4" />
                <p className="text-gray-700 mb-4">Upload your workflow JSON file</p>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="json-upload"
                />
                <Button asChild>
                  <label htmlFor="json-upload" className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" /> Choose File
                  </label>
                </Button>
                {formData.flow && Object.keys(formData.flow).length > 0 && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                    <CheckCircle className="h-5 w-5 text-green-600 inline mr-2" />
                    JSON file loaded successfully!
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Step 2: Details */}
            <TabsContent value="2" className="space-y-4">
              <Input
                placeholder="Workflow title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
              <textarea
                placeholder="Workflow description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="w-full border rounded-md p-2"
              />
              <div>
                <label className="font-medium text-sm text-gray-700">Features</label>
                <div className="flex gap-2 mt-1">
                  <Input
                    placeholder="Add feature"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                  />
                  <Button onClick={addFeature}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.features.map((f, i) => (
                    <Badge key={i} className="bg-blue-50 text-blue-800">
                      {f}
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer"
                        onClick={() => removeFeature(f)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Step 3: Pricing & Categories */}
            <TabsContent value="3" className="space-y-4">
              <Input
                type="number"
                placeholder="Price ($)"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
              />
              <Input
                type="number"
                placeholder="Setup time (minutes)"
                value={formData.time_to_setup}
                onChange={(e) => handleInputChange("time_to_setup", e.target.value)}
              />
              <div>
                <label className="font-medium text-sm text-gray-700 mb-1 block">Categories</label>
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((c) => {
                    const selected = formData.category_ids.includes(c.id);
                    return (
                      <Button
                        key={c.id}
                        variant={selected ? "default" : "outline"}
                        className={`text-sm px-3 py-1 rounded-full ${
                          selected ? "bg-pink-500 text-white" : "border-pink-300 text-gray-700"
                        }`}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            category_ids: selected
                              ? prev.category_ids.filter((id) => id !== c.id)
                              : [...prev.category_ids, c.id],
                          }));
                        }}
                      >
                        {c.name}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Upload image/video */}
              <div className="flex flex-col gap-3 mt-3">
                <label className="font-medium text-sm text-gray-700">Upload Media</label>
                <div className="flex gap-3">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files?.[0]!)}
                    disabled={isUploadingImage}
                  />
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleVideoUpload(e.target.files?.[0]!)}
                    disabled={isUploadingVideo}
                  />
                </div>
                {isUploadingImage && <p className="text-xs text-blue-600">Uploading image...</p>}
                {isUploadingVideo && <p className="text-xs text-purple-600">Uploading video...</p>}
              </div>

              {imagePreview.length > 0 ? (
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {imagePreview
                          .slice(0, 4)
                          .map((image: string, idx: number) => (
                            <div key={idx} className="relative group">
                              <img
                                src={image}
                                alt="Workflow asset"
                                className="rounded-lg border shadow w-full h-20 object-cover"
                              />
                              <button
                                type="button"
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                                onClick={() => {
                                  setImagePreview(imagePreview.filter((img) => img !== image));
                                }}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm ml-2 mt-2">
                        No image preview
                      </span>
                    )}
            </TabsContent>

            {/* Step 4: Preview */}
            <TabsContent value="4" className="space-y-4">
              <div className="space-y-4">
                <div className="grid gap-6">
                  {/* Title & Description */}
                  <div>
                    <h3 className="font-semibold text-xl text-gray-900 mb-1 leading-tight">
                      {formData.title || "Untitled Workflow"}
                    </h3>
                    <p className="text-gray-600 text-base">
                      {formData.description}
                    </p>
                  </div>

                  {/* Summary Row */}
                  <div className="flex flex-wrap items-center gap-5 px-4 py-3 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
                    {/* Categories prettier as badges */}
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700 min-w-[70px]">
                        Category:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {formData.category_ids?.map(
                          (cid: string, idx: number) => {
                            const name =
                              allCategories.find((c) => c.id === cid)?.name ||
                              cid;
                            return (
                              <Badge
                                key={idx}
                                className="px-3 py-1 rounded-full border bg-white text-gray-700 font-medium shadow transition hover:bg-pink-100 hover:text-pink-700"
                              >
                                {name}
                              </Badge>
                            );
                          }
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-1 ml-5">
                      <span className="font-medium text-gray-700">Price:</span>
                      <span className="text-xl font-bold text-indigo-600">
                        ${formData.price}
                      </span>
                    </div>

                    {/* Setup Time */}
                    <div className="flex items-center gap-1 ">
                      <span className="font-medium text-gray-700">
                        Setup Time:
                      </span>
                      <span className="text-base font-semibold text-gray-900">
                        {formData.time_to_setup}
                      </span>
                      <span className="text-gray-500 text-sm">minutes</span>
                    </div>
                  </div>

                  {/* Assets Preview */}
                  {formData?.video_demo && (
                    <div className="flex flex-col items-start">
                      <span className="px-2 py-1 rounded bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold mb-2">
                        Video preview:
                      </span>
                      <video
                        className="rounded-lg border shadow max-h-32 object-contain"
                        controls
                        src={formData.video_demo}
                      />
                    </div>
                  )}

                  {imagePreview && (
                    <div className="flex flex-col items-start">
                      <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold mb-2">
                        Image preview:
                      </span>
                      {imagePreview.length > 0 ? (
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {imagePreview
                            .slice(0, 4)
                            .map((image: string, idx: number) => (
                              <div key={idx} className="relative group">
                                <img
                                  src={image}
                                  alt="Workflow asset"
                                  className="rounded-lg border shadow w-full h-20 object-cover"
                                />
                              </div>
                            ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm ml-2 mt-2">
                          No image preview
                        </span>
                      )}
                    </div>
                  )}

                  {/* JSON Preview */}
                  {formData.flow && Object.keys(formData.flow).length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-3 text-gray-800">
                        JSON Preview
                      </h4>
                      <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-64 border border-gray-700">
                        <pre className="text-green-400 text-xs font-mono whitespace-pre">
                          {JSON.stringify(formData.flow, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t mt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            {currentStep < 4 ? (
              <Button onClick={() => setCurrentStep(currentStep + 1)}>Next</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                <Save className="h-4 w-4 mr-2" /> {loading ? "Publishing..." : "Publish Workflow"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}