import React, { useState, useEffect } from "react";
import toast from "react-hot-toast"; // Import react-hot-toast
import { dashboardApi, Prediction, UpdatePredictionRequest } from "@/services/dashboardApi";
import CustomModal from "../reusable/CustomModal";
import CustomDropdown from "../reusable/CustomDropdown";

interface EditPredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  prediction: Prediction | null;
  onSuccess: () => void;
}

const EditPredictionModal: React.FC<EditPredictionModalProps> = ({
  isOpen,
  onClose,
  prediction,
  onSuccess,
}) => {
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Valid statuses from API - formatted for CustomDropdown
  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "cansel", label: "Cancel" },
    { value: "win", label: "Win" },
    { value: "lose", label: "Lose" },
  ];

  // Reset form when prediction changes
  useEffect(() => {
    if (prediction) {
      setDescription(prediction.description || "");
      setStatus(prediction.status || "");
      setImagePreview(prediction.image || "");
      setImageFile(null);
      setError(null);
    }
  }, [prediction]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB", {
          duration: 4000,
          position: "top-center",
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
          position: "top-center",
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
      
      // Show success toast for image upload
      toast.success("Image uploaded successfully", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#1A1F2E",
          color: "#fff",
          border: "1px solid #00F474",
        },
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prediction) {
      toast.error("No prediction selected", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#1A1F2E",
          color: "#fff",
          border: "1px solid #E93544",
        },
      });
      return;
    }
    
    // Validation
    if (!description.trim()) {
      toast.error("Description is required", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#1A1F2E",
          color: "#fff",
          border: "1px solid #E93544",
        },
      });
      return;
    }
    
    if (!status) {
      toast.error("Status is required", {
        duration: 4000,
        position: "top-center",
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
    
    // Show loading toast
    const loadingToastId = toast.loading("Updating prediction...", {
      position: "top-center",
      style: {
        background: "#1A1F2E",
        color: "#fff",
      },
    });
    
    try {
      const updateData: UpdatePredictionRequest = {
        description: description.trim(),
        status: status,
      };
      
      // Only include image if a new one was selected
      if (imageFile) {
        updateData.image = imageFile;
      } else if (!imagePreview && prediction.category === "Casino") {
        // For Casino category, if no image preview exists, we might want to clear the image
        updateData.image = ""; // This depends on your API - might need to be null or undefined
      }
      
      const response = await dashboardApi.updatePrediction(prediction.id, updateData);
      
      if (response.success) {
        // Dismiss loading toast and show success
        toast.dismiss(loadingToastId);
        toast.success("Prediction updated successfully!", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#1A1F2E",
            color: "#fff",
            border: "1px solid #00F474",
          },
          icon: "✅",
        });
        
        onSuccess();
        onClose();
      } else {
        // Dismiss loading toast and show error
        toast.dismiss(loadingToastId);
        toast.error(response.message || "Failed to update prediction", {
          duration: 5000,
          position: "top-center",
          style: {
            background: "#1A1F2E",
            color: "#fff",
            border: "1px solid #E93544",
          },
        });
        setError(response.message || "Failed to update prediction");
      }
    } catch (err: any) {
      console.error("Error updating prediction:", err);
      
      // Dismiss loading toast and show error
      toast.dismiss(loadingToastId);
      toast.error(err.message || "Failed to update prediction. Please try again.", {
        duration: 5000,
        position: "top-center",
        style: {
          background: "#1A1F2E",
          color: "#fff",
          border: "1px solid #E93544",
        },
      });
      setError(err.message || "Failed to update prediction");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    toast.success("Image removed", {
      duration: 3000,
      position: "top-center",
      style: {
        background: "#1A1F2E",
        color: "#fff",
        border: "1px solid #00F474",
      },
    });
  };

  const handleCancel = () => {
    if (description !== prediction?.description || 
        status !== prediction?.status || 
        imageFile !== null) {
      // Show confirmation toast if there are unsaved changes
      toast((t) => (
        <div className="flex flex-col gap-3">
          <p className="text-white font-medium">Unsaved Changes</p>
          <p className="text-gray-300 text-sm">You have unsaved changes. Are you sure you want to cancel?</p>
          <div className="flex gap-2 justify-end mt-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                onClose();
              }}
              className="px-3 py-1.5 text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded transition-colors"
            >
              Discard
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 text-sm bg-[#00F474]/20 text-[#00F474] hover:bg-[#00F474]/30 rounded transition-colors"
            >
              Continue Editing
            </button>
          </div>
        </div>
      ), {
        duration: 10000,
        position: "top-right",
        style: {
          background: "#1A1F2E",
          color: "#fff",
          border: "1px solid #323B49",
          minWidth: "300px",
        },
      });
    } else {
      onClose();
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Edit Prediction"
      subTitle="Update prediction details"
      showCloseButton={true}
    >
      <form onSubmit={handleSubmit} className="py-4">
        {/* Error message from state (kept for form-level errors) */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        {/* Description */}
        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (error) setError(null);
            }}
            className="w-full px-3 py-2 bg-[#1A1F2E] border border-[#323B49] rounded-lg text-white text-sm focus:outline-none focus:border-[#00F474] focus:ring-1 focus:ring-[#00F474]/50 transition-colors"
            rows={4}
            placeholder="Enter prediction description..."
          />
          {description.length > 0 && (
            <p className="mt-1 text-xs text-gray-500">
              {description.length}/500 characters
            </p>
          )}
        </div>
        
        {/* Status - Using CustomDropdown */}
        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2">
            Status <span className="text-red-500">*</span>
          </label>
          <CustomDropdown
            options={statusOptions}
            value={status}
            onChange={(value) => {
              setStatus(value);
              if (error) setError(null);
            }}
            placeholder="Select status"
            className="w-full"
          />
        </div>
        
        {/* Image Upload (only for Casino category) */}
        {prediction?.category === "Casino" && (
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">
              Image
            </label>
            
            {/* Current Image Preview */}
            {imagePreview && (
              <div className="mb-3">
                <p className="text-gray-400 text-sm mb-2">Current Image:</p>
                <div className="relative inline-block">
                  <div className="w-32 h-32 border border-[#323B49] rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Prediction preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors text-xs font-bold"
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
            
            {/* File Upload Area */}
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#323B49] rounded-lg cursor-pointer bg-[#1A1F2E] hover:bg-[#252a3a] transition-colors group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg 
                    className="w-8 h-8 mb-4 text-gray-500 group-hover:text-gray-400 transition-colors" 
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
                  <p className="mb-2 text-sm text-gray-500 group-hover:text-gray-400 transition-colors">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                    PNG, JPG or GIF (MAX. 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/png, image/jpeg, image/jpg, image/gif"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            
            {/* Upload hint */}
            <p className="mt-2 text-xs text-gray-500">
              {imagePreview ? "Upload a new image to replace the current one" : "Upload an image for this prediction"}
            </p>
          </div>
        )}
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-[#323B49]">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2.5 border border-[#323B49] text-white rounded-lg hover:bg-[#1A1F2E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2.5 bg-[#00F474] text-[#1D1F2C] font-semibold rounded-lg hover:bg-[#00F474]/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[#1D1F2C] border-t-transparent rounded-full animate-spin"></div>
                <span>Updating...</span>
              </div>
            ) : (
              "Update Prediction"
            )}
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

export default EditPredictionModal;