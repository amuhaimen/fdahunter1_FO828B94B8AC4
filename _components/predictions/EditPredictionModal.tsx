 
import React, { useState, useEffect } from "react";
 
import { dashboardApi, Prediction, UpdatePredictionRequest } from "@/services/dashboardApi";
import CustomModal from "../reusable/CustomModal";

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
  
  // Valid statuses from API
  const statusOptions = [
    { value: "", label: "Select Status" },
    { value: "pending", label: "Pending" },
    { value: "cancel", label: "Cancel" },
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
      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prediction) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const updateData: UpdatePredictionRequest = {
        description: description.trim() || undefined,
        status: status || undefined,
      };
      
      // Only include image if a new one was selected
      if (imageFile) {
        updateData.image = imageFile;
      } else if (imagePreview) {
        // Keep existing image URL
        updateData.image = imagePreview;
      }
      
      const response = await dashboardApi.updatePrediction(prediction.id, updateData);
      
      if (response.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      console.error("Error updating prediction:", err);
      setError(err.message || "Failed to update prediction");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Prediction"
      subTitle="Update prediction details"
      showCloseButton={true}
    >
      <form onSubmit={handleSubmit} className="py-4">
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        {/* Description */}
        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-[#1A1F2E] border border-[#323B49] rounded-lg text-white text-sm focus:outline-none focus:border-[#00F474]"
            rows={4}
            placeholder="Enter prediction description..."
            required
          />
        </div>
        
        {/* Status */}
        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 bg-[#1A1F2E] border border-[#323B49] rounded-lg text-white text-sm focus:outline-none focus:border-[#00F474]"
            required
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
                <div className="relative w-32 h-32">
                  <img
                    src={imagePreview}
                    alt="Prediction preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
            
            {/* File Upload */}
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#323B49] rounded-lg cursor-pointer bg-[#1A1F2E] hover:bg-[#252a3a]">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 5MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>
        )}
        
        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#323B49] text-white rounded-lg hover:bg-[#1A1F2E] transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#00F474] text-[#1D1F2C] font-semibold rounded-lg hover:bg-[#00F474]/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#1D1F2C] border-t-transparent rounded-full animate-spin"></div>
                Updating...
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