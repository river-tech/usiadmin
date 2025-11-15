"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategories, createCategory, removeCategory, selectCategories } from "@/feature/categorSlice";
import { useAlert } from "@/contexts/AlertContext";
import { CategoryBody } from "@/lib/types";
import { uploadToCloudinary } from "@/api/upload";
import Image from "next/image";
import { getErrorMessage } from "@/lib/utils";

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useAlert();
  const { categories, isLoading } = useAppSelector(selectCategories);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) {
      showError("Validation error", "Please enter a category name");
      return;
    }
    
    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      showError("Validation error", "Category already exists");
      return;
    }

    try {
      const payload: CategoryBody = {
        name,
        image_url: newCategoryImage || "",
      };
      
      const result = await dispatch(createCategory(payload));
      if (result) {
        showSuccess("Category created", "New category has been added successfully");
        setNewCategoryName("");
        setNewCategoryImage("");
      }
    } catch (error) {
      showError("Create failed", getErrorMessage(error, "Could not create category"));
    }
  };

  const handleUploadImageFile = async (file?: File | null) => {
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const result = await uploadToCloudinary(file, "image");
      if (result?.url) {
        setNewCategoryImage(result.url);
        setImagePreview(result.url);
        showSuccess("Uploaded", "Image uploaded successfully");
      } else {
        showError("Upload failed", "No URL returned from upload");
      }
    } catch (error) {
      showError("Upload failed", getErrorMessage(error, "Could not upload image"));
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    try {
      const result = await dispatch(removeCategory(categoryId)).unwrap();
      if (result) {
        showSuccess("Category deleted", `"${categoryName}" has been deleted`);
      }
    } catch (error) {
      showError("Delete failed", getErrorMessage(error, "Could not delete category"));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Categories" description="Manage workflow categories" />

      <Card>
        <CardHeader>
          <CardTitle className="text-gray-800">Add Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 items-start">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
              disabled={isLoading}
              className="focus:ring-pink-200 focus:border-pink-400"
            />
            <div className="flex flex-col gap-2">
              <Input
                value={newCategoryImage}
                onChange={(e) => {
                  setNewCategoryImage(e.target.value);
                  setImagePreview(e.target.value);
                }}
                placeholder="Image URL (optional)"
                onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
                disabled={isLoading || isUploadingImage}
                className="focus:ring-pink-200 focus:border-pink-400"
              />
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUploadImageFile(e.target.files?.[0] || null)}
                  disabled={isLoading || isUploadingImage}
                  className="border-pink-200 focus:border-pink-400 focus:ring-pink-100"
                />
                {isUploadingImage && (
                  <span className="text-xs text-pink-600">Uploading...</span>
                )}
                {imagePreview && !isUploadingImage && (
                  <Image
                    src={imagePreview}
                    alt="preview"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover border border-pink-200"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                    unoptimized
                  />
                )}
              </div>
            </div>
            <Button 
              onClick={handleAddCategory} 
              className="border border-pink-300 text-pink-700 hover:bg-pink-100" 
              disabled={isLoading || isUploadingImage}
              aria-label="Add category"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isLoading ? "Adding..." : isUploadingImage ? "Uploading..." : "Add"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-gray-800">Existing Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">Loading categories...</p>
          ) : categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">No categories yet</p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex flex-row items-center gap-4 border border-gray-100 rounded-lg p-4 bg-gradient-to-br from-blue-50/60 via-white to-pink-50/30 hover:border-blue-300 transition min-w-[260px] shadow-sm group"
                >
                  {category.image_url && (
                    <Image
                      src={category.image_url}
                      alt={category.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded-full border border-blue-200 group-hover:border-blue-400 shadow-md"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                      unoptimized
                    />
                  )}
                  <div className="flex flex-col flex-1 gap-2">
                    <span className="text-[15px] font-bold text-blue-700 tracking-tight px-3 py-1 rounded-md bg-blue-50 border border-blue-100 group-hover:bg-blue-100 shadow-sm">
                      {category.name}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteCategory(category.id, category.name)}
                    className="h-8 w-8 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-400 transition focus:ring-blue-200"
                    disabled={isLoading}
                    aria-label={`Delete ${category.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

