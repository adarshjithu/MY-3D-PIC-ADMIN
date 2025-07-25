
import Switch from "../ui/switch/Switch";
import { useGetBaseProducts } from "../../hooks/useBaseProducts";

export default function SizeSelectionModal({ onClose, sizes, setSizes }: any) {
  const { data } = useGetBaseProducts({});
  

  const handleChange = (idx: number, field: string, value: any) => {
    setSizes((sizes:any) =>
      sizes.map((s:any, i:any) => (i === idx ? { ...s, [field]: value } : s))
    );
  };

  const handleBaseChange = (idx: number, field: string, values: string[]) => {
    setSizes((sizes:any) =>
      sizes.map((s:any, i:any) => (i === idx ? { ...s, [field]: values } : s))
    );
  };

  const addSize = () =>
    setSizes([
      ...sizes,
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

  const removeSize = (idx: number) =>
    setSizes((sizes:any) => sizes.filter((_, i:any) => i !== idx));

  return (
    <div className=" ">
      <div className="">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Select Sizes</h2>
          
        </div>

        <div className="space-y-6">
          {sizes.map((size, idx) => (
            <div key={idx} className="border rounded-xl p-4 bg-gray-50 dark:bg-gray-800 relative">
              <button onClick={() => removeSize(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl">
                &times;
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {["height", "width", "length"].map((field) => (
                  <div key={field}>
                    <label className="block mb-1 font-medium capitalize">{field}</label>
                    <input
                      type="number"
                      value={(size as any)[field]}
                      onChange={(e) => handleChange(idx, field, e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder={field}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 mb-4">
                <label className="font-medium">Has Base</label>
                <Switch
                  checked={size.hasBase}
                  onChange={(v) => handleChange(idx, "hasBase", v)}
                  size="md"
                  color="success"
                />
              </div>

              {size.hasBase && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-1 font-medium">Horizontal Base</label>
                    <select
                      multiple
                      value={size.horizontalBase}
                      onChange={(e) =>
                        handleBaseChange(
                          idx,
                          "horizontalBase",
                          Array.from(e.target.selectedOptions, (o) => o.value)
                        )
                      }
                      className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      {data?.data?.baseProducts?.map((opt: any) => (
                        <option key={opt._id} value={opt._id}>
                          {`H: ${opt.size?.height}, W: ${opt.size?.width}, L: ${opt.size?.length}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Vertical Base</label>
                    <select
                      multiple
                      value={size.verticalBase}
                      onChange={(e) =>
                        handleBaseChange(
                          idx,
                          "verticalBase",
                          Array.from(e.target.selectedOptions, (o) => o.value)
                        )
                      }
                      className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      {data?.data?.baseProducts?.map((opt: any) => (
                        <option key={opt._id} value={opt._id}>
                          {`H: ${opt.size?.height}, W: ${opt.size?.width}, L: ${opt.size?.length}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block mb-1 font-medium">Price</label>
                <input
                  type="number"
                  value={size.price}
                  onChange={(e) => handleChange(idx, "price", e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Price"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={addSize}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
          >
            + Add Size
          </button>
        
        </div>
      </div>
    </div>
  );
}
