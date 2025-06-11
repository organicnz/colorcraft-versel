"use client";

import React, { useState, useCallback, useRef } from "react";
import { Upload, X, ImageIcon, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface ImageUploadProps {
  portfolioId: string;
  onImagesChange: (images: string[]) => void;
  initialImages?: string[];
  maxImages?: number;
  category: "before" | "after";
}

interface UploadingFile {
  file: File;
  progress: number;
  status: "uploading" | "complete" | "error";
  url?: string;
  error?: string;
}

export default function ImageUpload({
  portfolioId,
  onImagesChange,
  initialImages = [],
  maxImages = 10,
  category,
}: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith("image/")) {
      return "File must be an image";
    }

    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return "File size must be less than 50MB";
    }

    // Check if we've reached max images
    if (images.length + uploadingFiles.length >= maxImages) {
      return `Maximum ${maxImages} images allowed`;
    }

    return null;
  };

  const ensureDirectoryExists = async (): Promise<void> => {
    try {
      // Check if directory already exists by trying to list files in it
      const { data: existingFiles, error: listError } = await supabase.storage
        .from("portfolio")
        .list(portfolioId, { limit: 1 });

      // If we can list files, directory exists
      if (!listError) {
        return;
      }

      // If directory doesn't exist, create it with a placeholder file
      const placeholder = new TextEncoder().encode(
        "# Portfolio directory\nThis file ensures the directory exists in Supabase Storage."
      );

      const { error: createError } = await supabase.storage
        .from("portfolio")
        .upload(`${portfolioId}/.gitkeep`, placeholder, {
          contentType: "text/plain",
          upsert: true,
        });

      if (createError && !createError.message.includes("already exists")) {
        console.warn("Failed to create directory placeholder:", createError.message);
      }
    } catch (error) {
      console.warn("Error ensuring directory exists:", error);
      // Don't throw - let the upload attempt proceed
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    // Ensure directory exists before upload
    await ensureDirectoryExists();

    const fileExt = file.name.split(".").pop();
    const fileName = `${category}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `${portfolioId}/${fileName}`;

    const { data, error } = await supabase.storage.from("portfolio").upload(filePath, file);

    if (error) {
      // Provide more helpful error messages
      if (error.message.includes("row-level security policy")) {
        throw new Error(
          `Upload failed: You don&apos;t have permission to upload images. Please make sure you're logged in as an admin.`
        );
      } else if (error.message.includes("duplicate")) {
        throw new Error(`Upload failed: A file with this name already exists. Please try again.`);
      } else {
        throw new Error(`Upload failed: ${error.message}`);
      }
    }

    const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleFiles = useCallback(
    async (files: FileList) => {
      const fileArray = Array.from(files);

      // Validate all files first
      const validationErrors: string[] = [];
      fileArray.forEach((file, index) => {
        const error = validateFile(file);
        if (error) {
          validationErrors.push(`File ${index + 1}: ${error}`);
        }
      });

      if (validationErrors.length > 0) {
        toast.error(`Upload failed:\n${validationErrors.join("\n")}`);
        return;
      }

      // Initialize uploading state for all files
      const newUploadingFiles: UploadingFile[] = fileArray.map((file) => ({
        file,
        progress: 0,
        status: "uploading" as const,
      }));

      setUploadingFiles((prev) => [...prev, ...newUploadingFiles]);

      // Upload files one by one
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];

        try {
          // Update progress
          setUploadingFiles((prev) =>
            prev.map((uf) => (uf.file === file ? { ...uf, progress: 25 } : uf))
          );

          const url = await uploadFile(file);

          // Update progress
          setUploadingFiles((prev) =>
            prev.map((uf) =>
              uf.file === file ? { ...uf, progress: 100, status: "complete" as const, url } : uf
            )
          );

          // Add to images array
          const newImages = [...images, url];
          setImages(newImages);
          onImagesChange(newImages);

          toast.success(`${file.name} uploaded successfully`);
        } catch (error: any) {
          setUploadingFiles((prev) =>
            prev.map((uf) =>
              uf.file === file ? { ...uf, status: "error" as const, error: error.message } : uf
            )
          );

          toast.error(`Failed to upload ${file.name}: ${error.message}`);
        }
      }

      // Clean up completed/errored uploads after a delay
      setTimeout(() => {
        setUploadingFiles((prev) => prev.filter((uf) => uf.status === "uploading"));
      }, 3000);
    },
    [images, portfolioId, category, onImagesChange, maxImages]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = async (imageUrl: string) => {
    try {
      // Extract file path from URL for deletion
      const urlParts = imageUrl.split("/");
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${portfolioId}/${fileName}`;

      // Delete from Supabase storage
      const { error } = await supabase.storage.from("portfolio").remove([filePath]);

      if (error) {
        console.error("Error deleting file:", error);
        toast.error("Failed to delete image from storage");
        return;
      }

      // Remove from local state
      const newImages = images.filter((img) => img !== imageUrl);
      setImages(newImages);
      onImagesChange(newImages);

      toast.success("Image removed successfully");
    } catch (error: any) {
      console.error("Error removing image:", error);
      toast.error("Failed to remove image");
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card
        className={`
          relative border-2 border-dashed transition-colors cursor-pointer
          ${dragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-slate-400"}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Upload className="h-10 w-10 text-slate-400 mb-4" />
          <p className="text-lg font-medium text-slate-900 mb-2">Upload {category} images</p>
          <p className="text-sm text-slate-500 text-center mb-4">
            Drag and drop files here, or click to select files
          </p>
          <p className="text-xs text-slate-400 text-center">
            Supports: JPG, PNG, GIF, WebP | Max size: 50MB | Max files: {maxImages}
          </p>

          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploading...</h4>
          {uploadingFiles.map((uploadingFile, index) => (
            <Card key={index} className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium truncate flex-1 mr-2">
                  {uploadingFile.file.name}
                </span>
                {uploadingFile.status === "complete" && (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
                {uploadingFile.status === "error" && (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
              {uploadingFile.status === "uploading" && (
                <Progress value={uploadingFile.progress} className="h-2" />
              )}
              {uploadingFile.status === "error" && (
                <p className="text-xs text-red-500 mt-1">{uploadingFile.error}</p>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Uploaded Images */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Uploaded Images</h4>
            <Badge variant="secondary">
              {images.length} / {maxImages}
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((imageUrl, index) => (
              <Card key={index} className="relative group overflow-hidden">
                <div className="aspect-square relative">
                  <Image
                    src={imageUrl}
                    alt={`${category} image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center">
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(imageUrl);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
        <p className="flex items-center gap-2 mb-1">
          <ImageIcon className="h-3 w-3" />
          Images will be stored in: portfolio/{portfolioId}/{category}-*
        </p>
        <p>• Files are automatically organized by portfolio UUID</p>
        <p>• Supported formats: JPG, PNG, GIF, WebP</p>
        <p>• Maximum file size: 50MB per image</p>
      </div>
    </div>
  );
}
