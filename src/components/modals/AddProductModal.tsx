import React, { useState } from "react";
import Switch from "../ui/switch/Switch";
import { X } from "lucide-react";
import { useCreateBaseProduct } from "../../hooks/useBaseProducts";
import { baseProductValidation } from "../../validation/baseProductValidation";
import SizeSelectionModal from "../product/SizeSelectionModal";

const initialFormData = {
  name: "",
  description: "",
  basePrice: "",
  actualPrice: "",
  thumbnail: "",
  imageFiles: [],
  images: [],
  quantity: "",
  sku: "",
  lowStockThreshold: "5",
  allowBackorder: false,
  isTrackable: true,
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  isActive: true,
};

export default function AddProductModal({
  setIsOpen,
  editProductData,
}: {
  setIsOpen: any;
  editProductData: any;
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState<any>({
    name: "",
    description: "",
    basePrice: "",
    actualPrice: "",
    quantity: "",
  });
  const [sizeModal, setSizeModal] = useState(false);
  const [sizes, setSizes] = useState([
    {
      height: "",
      width: "",
      length: "",
      hasBase: false,
      horizontalBase: [],
      verticalBase: [],
      price: "",
    },
  ]);

  console.log(sizes);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [images, setImages] = useState<string[]>([]); // for preview
  const [size, setSize] = useState([
    {
      height: "",
      width: "",
      length: "",
      hasBase: false,
      horizontalBase: [],
      verticalBase: [],
      price: "",
    },
  ]);
  const [dragActiveThumb, setDragActiveThumb] = useState(false);
  const [dragActiveImages, setDragActiveImages] = useState(false);
  const { mutate: createBaseProduct, isPending: isCreatingBaseProduct } =
    useCreateBaseProduct();

  // Thumbnail handlers
  const handleThumbnailDrop = (e: any) => {
    e.preventDefault();
    setDragActiveThumb(false);
    const file = e.target.files?.[0];
    setThumbnailFile(file);
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setThumbnail(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setThumbnailFile(file); // <-- store the file
      const reader = new FileReader();
      reader.onload = (ev) => setThumbnail(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Images handlers
  const handleImagesDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActiveImages(false);
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setImages((prev) => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handleImagesInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((file) =>
      file.type.startsWith("image/")
    );
    setImageFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setImages((prev) => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const inputClass =
    "w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500";

  const handleAddBase = async () => {
    const form = new FormData();
    form.append("name", formData?.name || "");
    form.append("description", formData.description);
    form.append("basePrice", formData.basePrice);
    form.append("actualPrice", formData.actualPrice);
    if (thumbnailFile) {
      form.append("thumbnail", thumbnailFile);
    }
    imageFiles.forEach((file) => form.append("images", file));
    form.append("quantity", formData.quantity);
    form.append("sku", formData.sku);
    form.append("lowStockThreshold", formData.lowStockThreshold);
    form.append("allowBackorder", formData.allowBackorder.toString());
    form.append("isTrackable", formData.isTrackable.toString());
    form.append("metaTitle", formData.metaTitle);
    form.append("metaDescription", formData.metaDescription);
    form.append("metaKeywords", formData.metaKeywords);
    form.append("isActive", formData.isActive.toString());
    // form.append("size", JSON.stringify(size)); // Removed size field

    const res = createBaseProduct(form);
  };

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      await baseProductValidation.validate(formData, { abortEarly: false });
      if (!thumbnailFile) {
        setError({ ...error, thumbnail: "Thumbnail is required" });
      }
      if (imageFiles.length === 0) {
        setError({ ...error, images: "Images are required" });
      }
      handleAddBase();
    } catch (err: any) {
      const validationErrors: Record<string, string> = {};
      if (err.inner) {
        err.inner.forEach((error: any) => {
          validationErrors[error.path] = error.message;
        });
        setError(validationErrors as any);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-5xl h-[90vh] bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-0 overflow-y-auto animate-fade-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Add new product
          </h1>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl font-bold"
          >
            <X size={28} />
          </button>
        </div>

        <form className="space-y-8 px-8 py-6" onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Basic Info
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={inputClass}
                  placeholder="Base name"
                />
                {error?.name && (
                  <span className="text-red-500">{error?.name}</span>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className={inputClass}
                  placeholder="Base description"
                />
                {error?.description && (
                  <span className="text-red-500">{error?.description}</span>
                )}
              </div>
            </div>
          </div>
          <hr className="border-gray-200 dark:border-gray-700" />

          {/* Price */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Pricing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 font-medium">Base Price</label>
                <input
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) =>
                    setFormData({ ...formData, basePrice: e.target.value })
                  }
                  className={inputClass}
                  placeholder="0.00"
                />
                {error?.basePrice && (
                  <span className="text-red-500">{error?.basePrice}</span>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">Actual Price</label>
                <input
                  type="number"
                  value={formData.actualPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, actualPrice: e.target.value })
                  }
                  className={inputClass}
                  placeholder="0.00"
                />
                {error?.actualPrice && (
                  <span className="text-red-500">{error?.actualPrice}</span>
                )}
              </div>
            </div>
          </div>
          <hr className="border-gray-200 dark:border-gray-700" />

          {/* Thumbnail */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Thumbnail
            </h2>
            <div
              className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition ${
                dragActiveThumb
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 dark:border-gray-700"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActiveThumb(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setDragActiveThumb(false);
              }}
              onDrop={handleThumbnailDrop}
              onClick={() => document.getElementById("thumbnail-input")?.click()}
            >
              <input
                id="thumbnail-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleThumbnailInput}
              />
              <p className="text-gray-500 dark:text-gray-400">
                Drag & drop thumbnail here, or click to select
              </p>
              {thumbnail && (
                <div className="relative mt-2 inline-block">
                  <img
                    src={thumbnail}
                    alt="Thumbnail"
                    className="w-32 h-32 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setThumbnail(null);
                    }}
                    className="absolute top-1 right-1 bg-white dark:bg-gray-900 rounded-full p-1 shadow text-red-500 hover:bg-red-100"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Images (multiple) */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Images
            </h2>
            <div
              className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition ${
                dragActiveImages
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 dark:border-gray-700"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActiveImages(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setDragActiveImages(false);
              }}
              onDrop={handleImagesDrop}
              onClick={() => document.getElementById("images-input")?.click()}
            >
              <input
                id="images-input"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImagesInput}
              />
              <p className="text-gray-500 dark:text-gray-400">
                Drag & drop images here, or click to select
              </p>
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {images.map((img, idx) => (
                  <div key={idx} className="relative inline-block">
                    <img
                      src={img}
                      alt={`img-${idx}`}
                      className="w-20 h-20 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImages((prev) => prev.filter((_, i) => i !== idx));
                      }}
                      className="absolute top-1 right-1 bg-white dark:bg-gray-900 rounded-full p-1 shadow text-red-500 hover:bg-red-100"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <hr className="border-gray-200 dark:border-gray-700" />

          {/* Inventory */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Inventory
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 font-medium">Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  className={inputClass}
                  placeholder="0"
                />
                {error?.quantity && (
                  <span className="text-red-500">{error?.quantity}</span>
                )}
              </div>
              <div>
                <label className="block mb-1 font-medium">SKU</label>
                <input
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                  className={inputClass}
                  placeholder="SKU"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  Low Stock Threshold
                </label>
                <input
                  type="number"
                  value={formData.lowStockThreshold}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lowStockThreshold: e.target.value,
                    })
                  }
                  className={inputClass}
                />
              </div>
              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <label className="font-medium">Allow Backorder</label>
                  <Switch
                    checked={formData.allowBackorder}
                    onChange={(e: any) =>
                      setFormData({
                        ...formData,
                        allowBackorder: e.target.checked,
                      })
                    }
                    size="md"
                    color="success"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="font-medium">Track Inventory</label>
                  <Switch
                    checked={formData.isTrackable}
                    onChange={(e: any) =>
                      setFormData({
                        ...formData,
                        isTrackable: e.target.checked,
                      })
                    }
                    size="md"
                    color="success"
                  />
                </div>
              </div>
            </div>
          </div>
          <hr className="border-gray-200 dark:border-gray-700" />

          {/* SEO */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              SEO
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 font-medium">Meta Title</label>
                <input
                  value={formData.metaTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, metaTitle: e.target.value })
                  }
                  className={inputClass}
                  placeholder="Meta title"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  Meta Description
                </label>
                <input
                  value={formData.metaDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, metaDescription: e.target.value })
                  }
                  className={inputClass}
                  placeholder="Meta description"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 font-medium">Meta Keywords</label>
                <input
                  value={formData.metaKeywords}
                  onChange={(e) =>
                    setFormData({ ...formData, metaKeywords: e.target.value })
                  }
                  className={inputClass}
                  placeholder="Comma separated keywords"
                />
              </div>
            </div>
          </div>
          <hr className="border-gray-200 dark:border-gray-700" />

          {/* Status */}
          <div className="flex items-center gap-4">
            <label className="font-medium">Active</label>
            <Switch
              checked={formData.isActive}
              onChange={(e: any) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              size="md"
              color="success"
            />
          </div>

          {/* Size Selection Modal */}
          {sizeModal && (
            <SizeSelectionModal
              onClose={() => setSizeModal(false)}
              sizes={sizes}
              setSizes={setSizes}
            />
          )}
           <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={()=>setSizeModal(true)}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
          >
            + Add Size
          </button>
        
        </div>
          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => setIsOpen(false)}
              type="button"
              className="px-6 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
            >
              Cancel
            </button>
            <button
              disabled={isCreatingBaseProduct}
              type="submit"
              className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              {isCreatingBaseProduct ? "Adding..." : "Add Base"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}