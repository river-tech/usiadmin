"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<string[]>([
    "automation",
    "ecommerce",
    "marketing",
    "analytics",
  ]);
  const [newCategory, setNewCategory] = useState("");

  const addCategory = () => {
    const value = newCategory.trim();
    if (!value) return;
    if (categories.includes(value)) return;
    setCategories((prev) => [...prev, value]);
    setNewCategory("");
  };

  const deleteCategory = (name: string) => {
    setCategories((prev) => prev.filter((c) => c !== name));
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Categories" description="Simple category management" />

      <Card>
        <CardHeader>
          <CardTitle>Add Category</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
          />
          <Button onClick={addCategory} className="btn-gradient" aria-label="Add category">
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Categories</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">No categories yet</p>
          ) : (
            categories.map((c) => (
              <div key={c} className="flex items-center gap-2 border rounded-full px-3 py-1">
                <Badge variant="secondary">{c}</Badge>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteCategory(c)}
                  className="h-7 w-7"
                  aria-label={`Delete ${c}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}


