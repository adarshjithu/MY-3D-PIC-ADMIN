import React, { useState } from "react";
import Switch from "../ui/switch/Switch";
import { X } from "lucide-react";
import { useCreateBaseProduct } from "../../hooks/useBaseProducts";


export default function AddBaseModal({ setIsOpen,editBaseData }: { setIsOpen: any,editBaseData:any }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [actualPrice, setActualPrice] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [images, setImages] = useState<string[]>([]); // for preview
  const [quantity, setQuantity] = useState("");
  const [sku, setSku] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState("5");
  const [allowBackorder, setAllowBackorder] = useState(false);
  const [isTrackable, setIsTrackable] = useState(true);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Drag state for thumbnail and images
  const [dragActiveThumb, setDragActiveThumb] = useState(false);
  const [dragActiveImages, setDragActiveImages] = useState(false);
  const { mutate: createBaseProduct,isPending:isCreatingBaseProduct } = useCreateBaseProduct();

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
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith("image/"));
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setImages(prev => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };
  const handleImagesInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file => file.type.startsWith("image/"));
    setImageFiles(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setImages(prev => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const inputClass =
    "w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500";

  const handleAddBase = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("basePrice", basePrice);
    formData.append("actualPrice", actualPrice);
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }
    imageFiles.forEach(file => formData.append("images", file));
    formData.append("quantity", quantity);
    formData.append("sku", sku);
    formData.append("lowStockThreshold", lowStockThreshold);
    formData.append("allowBackorder", allowBackorder.toString());
    formData.append("isTrackable", isTrackable.toString());
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);
    formData.append("metaKeywords", metaKeywords);
    formData.append("isActive", isActive.toString());

    const res = await createBaseProduct(formData)
 
  };
      return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-5xl h-[90vh] bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-0 overflow-y-auto animate-fade-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Base</h1>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl font-bold">
            <X size={28} />
          </button>
        </div>
        <form className="space-y-8 px-8 py-6" onSubmit={handleAddBase}>
          {/* Basic Info */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Basic Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="Base name" />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className={inputClass}
                  placeholder="Base description"
                />
              </div>
            </div>
          </div>
          <hr className="border-gray-200 dark:border-gray-700" />

          {/* Price */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 font-medium">Base Price</label>
                <input
                  type="number"
                  value={basePrice}
                  onChange={e => setBasePrice(e.target.value)}
                  className={inputClass}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Actual Price</label>
                <input
                  type="number"
                  value={actualPrice}
                  onChange={e => setActualPrice(e.target.value)}
                  className={inputClass}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
          <hr className="border-gray-200 dark:border-gray-700" />

          {/* Thumbnail */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Thumbnail</h2>
            <div
              className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition ${dragActiveThumb ? "border-blue-500 bg-blue-50" : "border-gray-300 dark:border-gray-700"}`}
              onDragOver={e => { e.preventDefault(); setDragActiveThumb(true); }}
              onDragLeave={e => { e.preventDefault(); setDragActiveThumb(false); }}
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
              <p className="text-gray-500 dark:text-gray-400">Drag & drop thumbnail here, or click to select</p>
              {thumbnail && (
                <div className="relative mt-2 inline-block">
                  <img src={thumbnail} alt="Thumbnail" className="w-32 h-32 object-cover rounded border" />
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); setThumbnail(null); }}
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
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Images</h2>
            <div
              className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition ${dragActiveImages ? "border-blue-500 bg-blue-50" : "border-gray-300 dark:border-gray-700"}`}
              onDragOver={e => { e.preventDefault(); setDragActiveImages(true); }}
              onDragLeave={e => { e.preventDefault(); setDragActiveImages(false); }}
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
              <p className="text-gray-500 dark:text-gray-400">Drag & drop images here, or click to select</p>
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {images.map((img, idx) => (
                  <div key={idx} className="relative inline-block">
                    <img src={img} alt={`img-${idx}`} className="w-20 h-20 object-cover rounded border" />
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); setImages(prev => prev.filter((_, i) => i !== idx)); }}
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
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Inventory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 font-medium">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  className={inputClass}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">SKU</label>
                <input value={sku} onChange={e => setSku(e.target.value)} className={inputClass} placeholder="SKU" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Low Stock Threshold</label>
                <input
                  type="number"
                  value={lowStockThreshold}
                  onChange={e => setLowStockThreshold(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <label className="font-medium">Allow Backorder</label>
                  <Switch checked={allowBackorder} onChange={setAllowBackorder} size="md" color="success" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="font-medium">Track Inventory</label>
                  <Switch checked={isTrackable} onChange={setIsTrackable} size="md" color="success" />
                </div>
              </div>
            </div>
          </div>
          <hr className="border-gray-200 dark:border-gray-700" />

          {/* SEO */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">SEO</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 font-medium">Meta Title</label>
                <input
                  value={metaTitle}
                  onChange={e => setMetaTitle(e.target.value)}
                  className={inputClass}
                  placeholder="Meta title"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Meta Description</label>
                <input
                  value={metaDescription}
                  onChange={e => setMetaDescription(e.target.value)}
                  className={inputClass}
                  placeholder="Meta description"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 font-medium">Meta Keywords</label>
                <input
                  value={metaKeywords}
                  onChange={e => setMetaKeywords(e.target.value)}
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
            <Switch checked={isActive} onChange={setIsActive} size="md" color="success" />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <button onClick={() => setIsOpen(false)} type="button" className="px-6 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition">Cancel</button>
                <button disabled={isCreatingBaseProduct}  type="submit" className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
              {isCreatingBaseProduct ? "Adding..." : "Add Base"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
