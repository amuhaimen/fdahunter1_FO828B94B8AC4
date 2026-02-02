"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CrossIcon from "../icons/predictions/CrossIcon";
import CustomDropdown from "../reusable/CustomDropdown";
import { dashboardApi } from "@/services/dashboardApi";
import { X } from "lucide-react"; // Import X icon

interface AddPredictionSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

const AddPredictionSidebar: React.FC<AddPredictionSidebarProps> = ({
  isOpen = false,
  onClose,
  onSuccess,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [categories, setSelectedCategories] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use uppercase category values as per API requirements
  const categoriesOption = [
    { value: "Sports", label: "Sports" },
    { value: "Stocks", label: "Stocks" },
    { value: "Casino", label: "Casino" },
    { value: "Crypto", label: "Crypto" },
  ];

  useEffect(() => {
    if (isOpen && !isVisible) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else if (!isOpen && isVisible) {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen, isVisible]);

  // Reset form when closing
  const resetForm = () => {
    setSelectedCategories("");
    setDescription("");
    setImageFile(null);
    setImagePreview("");
    setLoading(false);
    setError(null);
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      resetForm();
      onClose?.();
    }, 300);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB", {
          duration: 4000,
          position: "top-right",
          style: {
            background: "#1A1F2E",
            color: "#fff",
            border: "1px solid #E93544",
          },
        });
        return;
      }

      // Validate file type
      const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid image (PNG, JPG, JPEG, GIF)", {
          duration: 4000,
          position: "top-right",
          style: {
            background: "#1A1F2E",
            color: "#fff",
            border: "1px solid #E93544",
          },
        });
        return;
      }

      setImageFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleCreatePrediction = async () => {
    // Validation
    if (!categories) {
      toast.error("Category is required", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#1A1F2E",
          color: "#fff",
          border: "1px solid #E93544",
        },
      });
      return;
    }

    if (!description.trim()) {
      toast.error("Description is required", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#1A1F2E",
          color: "#fff",
          border: "1px solid #E93544",
        },
      });
      return;
    }

    // For Casino category, image is required
    if (categories === "Casino" && !imageFile) {
      toast.error("Image is required for Casino category", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#1A1F2E",
          color: "#fff",
          border: "1px solid #E93544",
        },
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const createData: any = {
        category: categories,
        description: description.trim(),
      };

      // Only add image if category is Casino and imageFile exists
      if (categories === "Casino" && imageFile) {
        createData.image = imageFile;
      }

      const response = await dashboardApi.createPrediction(createData);

      if (response.success) {
        toast.success("Prediction created successfully!", {
          duration: 4000,
          position: "top-right",
          style: {
            background: "#1A1F2E",
            color: "#fff",
            border: "1px solid #00F474",
          },
          icon: "✅",
        });

        // Call onSuccess callback if provided
        onSuccess?.();

        // Immediately close sidebar on success
        handleClose();
      } else {
        toast.error(response.message || "Failed to create prediction", {
          duration: 5000,
          position: "top-right",
          style: {
            background: "#1A1F2E",
            color: "#fff",
            border: "1px solid #E93544",
          },
        });
        setError(response.message || "Failed to create prediction");
        // On error, sidebar remains open
      }
    } catch (err: any) {
      console.error("Error creating prediction:", err);

      let errorMessage = err.message || "Failed to create prediction. Please try again.";

      // Check for specific error types
      if (err.isInvalidCategoryError && err.validCategories) {
        errorMessage = `Invalid category. Valid categories are: ${err.validCategories.join(', ')}`;
      }

      toast.error(errorMessage, {
        duration: 5000,
        position: "top-right",
        style: {
          background: "#1A1F2E",
          color: "#fff",
          border: "1px solid #E93544",
        },
      });
      setError(errorMessage);
      // On error, sidebar remains open
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-20 transition-opacity duration-300 ease-in-out ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleBackdropClick}
      />

      {/* Sidebar */}
      <div
        className={`fixed right-3 top-5 bottom-5 h-[calc(100%-2.5rem)] w-full max-w-[80%] md:max-w-[30%] bg-[#0E121B] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out rounded-lg overflow-hidden flex flex-col ${
          isAnimating ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center py-3 px-6 bg-[#181B25]">
          <h2 className="text-lg text-white font-sans font-medium">
            Add New Prediction
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-black rounded-lg transition-colors duration-200 cursor-pointer"
            disabled={loading}
          >
            <CrossIcon />
          </button>
        </div>

        {/* Content area - This will grow to fill space */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between">
          <div className="space-y-5">
            {/* Category Selection */}
            <div>
              <label htmlFor="" className="text-white text-sm font-medium">
                Category <span className="text-[#E93544]">*</span>
              </label>
              <CustomDropdown
                options={categoriesOption}
                value={categories}
                onChange={setSelectedCategories}
                placeholder="Select category"
                className="flex-1 w-full mt-2"
                // disabled={loading}
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="note" className="text-white text-sm font-medium">
                Description <span className="text-[#E93544]">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full mt-2 border border-[#2B303B] h-32 focus:ring-1 focus:border-[#00f474] focus:outline-none rounded-lg p-2 placeholder:text-sm placeholder:text-[#717784] bg-[#0E121B] text-white resize-none"
                placeholder="Provide a detailed analysis and summary for this prediction..."
                rows={5}
                disabled={loading}
              />
              {description.length > 0 && (
                <p className="mt-1 text-xs text-gray-500">
                  {description.length}/500 characters
                </p>
              )}
            </div>

            {/* Image Upload (only for Casino category) */}
            {categories === "Casino" && (
              <div className="mb-6">
                <label className="block text-white text-sm font-medium mb-2">
                  Image <span className="text-[#E93544]">*</span>
                </label>

                {/* File Upload Area - Shows preview or upload button in the same place */}
                <div className="flex items-center justify-center w-full">
                  {imagePreview ? (
                    // Preview Mode
                    <div className="relative w-full h-64 border-2 border-dashed border-[#323B49] rounded-lg overflow-hidden bg-[#1A1F2E] group">
                      {/* Image Preview */}
                      <img
                        src={imagePreview}
                        alt="Prediction preview"
                        className="w-full h-full object-contain"
                      />
                      
                      {/* Cross button to remove image */}
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                        aria-label="Remove image"
                        disabled={loading}
                      >
                        <X className="w-4 h-4" />
                      </button>
                      
                      {/* Overlay with upload again option */}
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer">
                          <div className="flex flex-col items-center justify-center p-4">
                            <svg
                              className="w-8 h-8 mb-2 text-white"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 16"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                              />
                            </svg>
                            <p className="text-white text-sm font-medium">
                              Click to change image
                            </p>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/png, image/jpeg, image/jpg, image/gif"
                              onChange={handleImageChange}
                              disabled={loading}
                            />
                          </div>
                        </label>
                      </div>
                    </div>
                  ) : (
                    // Upload Mode
                    <label className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-[#323B49] rounded-lg cursor-pointer bg-[#1A1F2E] transition-colors group ${
                      loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#252a3a]'
                    }`}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-12 h-12 mb-4 text-gray-500 group-hover:text-gray-400 transition-colors"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-lg text-gray-500 group-hover:text-gray-400 transition-colors">
                          <span className="font-semibold">Click to upload</span>
                        </p>
                        <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors mt-2">
                          PNG, JPG or GIF (MAX. 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/png, image/jpeg, image/jpg, image/gif"
                        onChange={handleImageChange}
                        disabled={loading}
                      />
                    </label>
                  )}
                </div>

                {/* Upload hint */}
                <p className="mt-2 text-xs text-gray-500">
                  {imagePreview ? "Click on the image to change or use the cross button to remove" : "Upload an image for this prediction (required for Casino category)"}
                </p>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col lg:flex-row items-center gap-4 mt-6">
            <button
              onClick={handleCancel}
              className="py-3 bg-[#181B25] hover:bg-[#181B25]/90 active:scale-95 rounded-lg text-base text-[#99A0AE] font-semibold w-full cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleCreatePrediction}
              className="py-3 bg-[#00F474] rounded-lg text-base text-[#1D1F2C] hover:bg-[#00F474]/90 font-semibold w-full cursor-pointer active:scale-95 transition-all ease-in duration-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#1D1F2C] border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                "Create Prediction"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPredictionSidebar;