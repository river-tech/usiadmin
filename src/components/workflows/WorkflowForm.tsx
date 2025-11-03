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
import { Asset, Category, Workflow, WorkflowBody } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCategories } from "@/feature/categorSlice";
import { uploadToCloudinary } from "@/api/upload";
import { deleteAsset, uploadAsset } from "@/feature/workflowSlide";

interface WorkflowFormProps {
  isEdit?: boolean;
  initialData?: Workflow;
  onSubmit: (formData: WorkflowBody) => void;
  categories?: Category[]; // optional; will fallback to Redux store
}

export function WorkflowForm({
  isEdit = false,
  initialData,
  onSubmit,
  categories,
}: WorkflowFormProps) {
  const { showSuccess, showError } = useAlert();
  const dispatch = useAppDispatch();
  const categoryState = useAppSelector(selectCategories);
  const allCategories: Category[] = categoryState?.categories?.length
    ? categoryState.categories
    : categories || [];
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WorkflowBody>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    features: initialData?.features || [],
    time_to_setup: initialData?.time_to_setup || 0,
    video_demo: initialData?.video_demo || "",
    flow: initialData?.flow || {},
    // map initial categories (names) to ids if possible; otherwise leave empty
    category_ids: (initialData?.categories || []).map((cat: any) =>
      typeof cat === "object" && "id" in cat ? cat.id : cat
    ),
  });

  const [newFeature, setNewFeature] = useState("");
  const [imagePreview, setImagePreview] = useState<Asset[]>(
    initialData?.assets || []
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addCategory = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter(
        (feature: string) => feature !== featureToRemove
      ),
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if it's a JSON file
      if (file.type === "application/json" || file.name.endsWith(".json")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const jsonContent = e.target?.result as string;
            const parsedJson = JSON.parse(jsonContent);
            setFormData((prev) => ({
              ...prev,
              flow: parsedJson,
            }));
            showSuccess(
              "Success",
              "JSON file uploaded and parsed successfully!"
            );
          } catch (error) {
            showError(
              "Error",
              "Invalid JSON file. Please check the file format."
            );
          }
        };
        reader.readAsText(file);
      } else {
        showError("Error", "Please select a valid JSON file (.json)");
      }
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const upload = await uploadToCloudinary(file, "image");
      if (upload) {
        const result = await dispatch(
          uploadAsset({
            workflowId: initialData?.id || "",
            payload: { asset_url: upload.url, kind: "image" },
          })
        );
        if (uploadAsset.fulfilled.match(result)) {
          const { asset_id, asset_url } = result.payload;
          setImagePreview((prev) => [
            ...prev,
            { id: asset_id, url: asset_url },
          ]);
          showSuccess("Image uploaded", "Image asset has been uploaded");
        } else {
          showError("Upload failed", result.error as string);
        }
      }
    } catch (e: any) {
      showError("Upload failed", e?.message || "Could not upload image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleVideoUpload = async (file: File) => {
    if (!file) return;
    setIsUploadingVideo(true);
    try {
      const upload = await uploadToCloudinary(file, "video");
      if (upload) {
        await dispatch(
          uploadAsset({
            workflowId: initialData?.id || "",
            payload: { asset_url: upload.url, kind: "video" },
          })
        );
        setFormData((prev) => ({ ...prev, video_demo: upload.url }));
        showSuccess("Video uploaded", "Video asset has been uploaded");
      }
    } catch (e: any) {
      showError("Upload failed", e?.message || "Could not upload video");
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const validateForm = (): string | null => {
    // Kiểm tra title
    if (!formData.title || formData.title.trim() === "") {
      return "Title is required";
    }

    // Kiểm tra description
    if (!formData.description || formData.description.trim() === "") {
      return "Description is required";
    }

    // Kiểm tra flow/JSON
    if (!formData.flow || Object.keys(formData.flow).length === 0) {
      return "Workflow JSON file is required";
    }

    // Kiểm tra categories
    if (!formData.category_ids || formData.category_ids.length === 0) {
      return "At least one category is required";
    }

    // Kiểm tra price
    if (!formData.price || Number(formData.price) <= 0) {
      return "Price must be greater than 0";
    }

    // Kiểm tra time_to_setup
    if (!formData.time_to_setup || Number(formData.time_to_setup) <= 0) {
      return "Setup time must be greater than 0";
    }

    return null;
  };

  const handleSubmit = () => {
    // Validate form trước khi submit
    const validationError = validateForm();
    if (validationError) {
      showError("Validation Error", validationError);
      return;
    }

    const body: WorkflowBody = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: Number(formData.price) || 0,
      features: Array.isArray(formData.features) ? formData.features : [],
      time_to_setup: Number(formData.time_to_setup) || 0,
      video_demo: formData.video_demo || "",
      flow: formData.flow || {},
      category_ids: Array.isArray(formData.category_ids)
        ? formData.category_ids
        : [],
    };
    onSubmit(body);
  };

  const handleDeleteImage = async (imageId: string) => {
    const result = await dispatch(
      deleteAsset({ workflowId: initialData?.id || "", assetId: imageId })
    );
    if (result) {
      setImagePreview((prev) => prev.filter((image) => image.id !== imageId));
      showSuccess("Image deleted", "Image asset has been deleted");
    } else {
      showError("Delete failed", "Something went wrong");
    }
  };

  const steps = [
    {
      id: 1,
      title: "Upload JSON",
      description: "Upload your workflow JSON file",
    },
    {
      id: 2,
      title: "Details",
      description: "Add title, description, and feature",
    },
    {
      id: 3,
      title: "Pricing & Categories",
      description: "Set price and add categories",
    },
    { id: 4, title: "Preview", description: "Review and publish" },
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
              <p
                className={cn(
                  "text-sm font-medium transition-colors",
                  currentStep >= step.id ? "text-gray-900" : "text-gray-500"
                )}
              >
                {step.title}
              </p>
              <p className="text-xs text-gray-500">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-12 h-0.5 mx-4 transition-colors",
                  currentStep > step.id
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                    : "bg-gray-200"
                )}
              />
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
          <Tabs
            value={currentStep.toString()}
            onValueChange={(value) => setCurrentStep(parseInt(value))}
          >
            <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg">
              {steps.map((step, index) => (
                <TabsTrigger
                  key={step.id}
                  value={step.id.toString()}
                  className={`data-[state=active]:bg-gradient-to-r data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800 transition-all duration-200 ${
                    index === 0
                      ? "data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600"
                      : index === 1
                      ? "data-[state=active]:from-green-500 data-[state=active]:to-emerald-600"
                      : index === 2
                      ? "data-[state=active]:from-purple-500 data-[state=active]:to-pink-600"
                      : "data-[state=active]:from-orange-500 data-[state=active]:to-red-600"
                  }`}
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
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  Upload Workflow JSON
                </h3>
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
                {formData.flow && Object.keys(formData.flow).length > 0 && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-center mb-3">
                      <div className="bg-green-100 rounded-full p-2 mr-3">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-sm text-green-800 font-medium">
                        JSON file loaded successfully
                      </p>
                    </div>
                    <div className="bg-white rounded p-3 border border-green-100 mt-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      <pre className="text-xs text-left text-gray-800 overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(formData.flow, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Step 2: Details */}
            <TabsContent value="2" className="space-y-4">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="text-sm font-semibold text-gray-700"
                  >
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
                  <label
                    htmlFor="description"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Describe your workflow..."
                    className="w-full min-h-[100px] px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="feature"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Feature
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="feature"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a feature"
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addCategory())
                      }
                      className="border-blue-200 focus:border-blue-400 focus:ring-blue-100"
                    />
                    <Button
                      type="button"
                      onClick={addCategory}
                      size="icon"
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.features?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.features?.map((feature: any, idx: number) => {
                        let displayName;
                        if (typeof feature === "object" && feature !== null) {
                          // Try to show a human-readable field, fallback to "Unnamed"
                          displayName =
                            feature.name ||
                            feature.title ||
                            feature.id ||
                            "Unnamed";
                        } else {
                          displayName = feature;
                        }
                        return (
                          <Badge
                            key={idx}
                            className="flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200"
                          >
                            {displayName}
                            <X
                              className="h-3 w-3 cursor-pointer hover:text-red-500"
                              onClick={() =>
                                removeFeature(
                                  typeof feature === "object" &&
                                    feature !== null
                                    ? feature.id ||
                                        feature.name ||
                                        feature.title ||
                                        ""
                                    : feature.toString()
                                )
                              }
                            />
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Step 3: Pricing & Categories */}
            <TabsContent value="3" className="space-y-4">
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="price"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Price (VND)
                    </label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      placeholder="0.00"
                      step="0.01"
                      className="border-green-200 focus:border-green-400 focus:ring-green-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="timeToSetup"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Time to Setup (minutes)
                    </label>
                    <Input
                      id="timeToSetup"
                      type="number"
                      value={formData.time_to_setup}
                      onChange={(e) =>
                        handleInputChange("time_to_setup", e.target.value)
                      }
                      placeholder="30"
                      min="1"
                      className="border-purple-200 focus:border-purple-400 focus:ring-purple-100"
                    />
                  </div>
                </div>
                  <div className="space-y-2">
                  <label className="font-medium bg-gray-300 px-2 py-1 rounded-lg w-fit text-sm text-gray-700 mb-1 block">
                    Categories
                  </label>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Upload Image
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        disabled={isUploadingImage || imagePreview.length >= 4}
                        onChange={(e) =>
                          handleImageUpload(e.target.files?.[0] as File)
                        }
                        className="border-orange-200 focus:border-orange-400 focus:ring-orange-100"
                      />
                      {isUploadingImage && (
                        <span className="text-xs text-orange-600">
                          Uploading image...
                        </span>
                      )}
                    </div>
                   
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Upload Video
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="video-upload"
                        type="file"
                        accept="video/*"
                        disabled={isUploadingVideo || !!formData.video_demo}
                        onChange={(e) =>
                          handleVideoUpload(e.target.files?.[0] as File)
                        }
                        className="border-orange-200 focus:border-orange-400 focus:ring-orange-100"
                      />
                      {isUploadingVideo && (
                        <span className="text-xs text-purple-600">
                          Uploading video...
                        </span>
                      )}
                    </div>
                  </div>
                  
                </div>
                {imagePreview.length > 0 ? (
                      <div className="grid grid-cols-4 gap-2 mt-2 w-full max-w-full overflow-hidden">
                        {imagePreview
                          .slice(0, 4)
                          .map((image: Asset, idx: number) => (
                            <div key={idx} className="relative group w-full overflow-hidden">
                              <img
                                src={image.url}
                                alt="Workflow asset"
                                className="rounded-lg border shadow w-full h-20 object-cover max-w-full"
                              />
                              <button
                                type="button"
                                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                                onClick={() => {
                                  handleDeleteImage(image.id);
                                }}
                              >
                                <X className="h-2 w-2" />
                              </button>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm ml-2 mt-2">
                        No image preview
                      </span>
                    )}

                    {
                      formData?.video_demo && (
                        <div className="flex flex-col items-start w-full max-w-full overflow-hidden">
                          <span className="px-2 py-1 rounded bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold mb-2">
                            Video preview:
                          </span>
                        <video
                          className="rounded-lg border shadow max-h-32 max-w-full object-contain w-full"
                            controls
                            src={formData.video_demo}
                          />
                        </div>
                      )
                    }
              
              </div>
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
                    <div className="flex flex-col items-start w-full max-w-full overflow-hidden">
                      <span className="px-2 py-1 rounded bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold mb-2">
                        Video preview:
                      </span>
                      <video
                        className="rounded-lg border shadow max-h-32 max-w-full object-contain w-full"
                        controls
                        src={formData.video_demo}
                      />
                    </div>
                  )}

                  {imagePreview && (
                    <div className="flex flex-col items-start w-full max-w-full overflow-hidden">
                      <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold mb-2">
                        Image preview:
                      </span>
                      {imagePreview.length > 0 ? (
                        <div className="grid grid-cols-4 gap-2 mt-2 w-full max-w-full overflow-hidden">
                          {imagePreview
                            .slice(0, 4)
                            .map((image: Asset, idx: number) => (
                              <div key={idx} className="relative group w-full overflow-hidden">
                                <img
                                  src={image.url}
                                  alt="Workflow asset"
                                  className="rounded-lg border shadow w-full h-20 object-cover max-w-full"
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
                  {/* {
                    initialData?.assets.find((asset: any) => asset.kind === "video") && (
                      <div className="flex flex-col items-start">
                        <span className="px-2 py-1 rounded bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold mb-2">
                          Video preview:
                        </span>
                        <video
                          className="rounded-lg border shadow max-h-32 object-contain"
                          controls
                          src={initialData?.assets.find((asset: any) => asset.kind === "video")?.asset_url}
                        />
                      </div>
                    )
                  } */}
                  {/* {Array.isArray((formData as any).assets) &&
                    ((formData as any).assets.find((asset: any) => asset.kind === "image") ||
                      (formData as any).assets.find((asset: any) => asset.kind === "video")) && (
                      <div className="flex flex-wrap items-center gap-6 text-sm mt-2">
                        {(formData as any).assets.find(
                          (asset: any) => asset.kind === "image"
                        ) && (
                          <div className="flex flex-col items-start">
                            <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold mb-2">
                              Image preview:
                            </span>
                            <img
                              className="rounded-lg border shadow max-h-32 object-contain"
                              src={
                                (formData as any).assets.find(
                                  (asset: any) => asset.kind === "image"
                                )?.asset_url
                              }
                              alt="Workflow asset"
                            />
                          </div>
                        )}
                        {(formData as any).assets.find(
                          (asset: any) => asset.kind === "video"
                        ) && (
                          <div className="flex flex-col items-start">
                            <span className="px-2 py-1 rounded bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold mb-2">
                              Video preview:
                            </span>
                            <video
                              className="rounded-lg border shadow max-h-32 object-contain"
                              controls
                              src={
                                (formData as any).assets.find(
                                  (asset: any) => asset.kind === "video"
                                )?.asset_url
                              }
                            />
                          </div>
                        )}
                      </div>
                    )} */}

                  {/* JSON Preview */}
                  {formData.flow && Object.keys(formData.flow).length > 0 && (
                    <div className="mt-6 w-full max-w-full overflow-hidden">
                      <h4 className="font-medium mb-3 text-gray-800">
                        JSON Preview
                      </h4>
                      <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-64 border border-gray-700 w-full max-w-full">
                        <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap break-words">
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
