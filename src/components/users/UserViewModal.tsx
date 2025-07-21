import { X } from "lucide-react"; // Lucide React Icon

export default function UserViewModal() {
    const user = {
        name: "John Doe",
        email: "johndoe@example.com",
        role: "Admin",
        chapter: "North Zone",
        region: "California",
        image: "https://randomuser.me/api/portraits/men/10.jpg",
        createdAt: "2023-07-12",
        isVerified: true,
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-[90%] max-w-md p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">User Details</h2>
                    <button className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="space-y-4 text-center mt-4">
                    <img
                        src={user.image}
                        alt={user.name}
                        className="w-20 h-20 rounded-full mx-auto border"
                    />
                    <h2 className="text-lg font-semibold">{user.name}</h2>
                    <p className="text-gray-500">{user.email}</p>
                    <p className="text-gray-400">{user.role}</p>
                    <div className="text-sm text-gray-600 space-y-2">
                        <p><strong>Chapter:</strong> {user.chapter}</p>
                        <p><strong>Region:</strong> {user.region}</p>
                        <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                        <p>
                            <strong>Status:</strong> 
                            <span className={`ml-2 px-2 py-1 rounded ${user.isVerified ? "bg-green-500 text-white" : "bg-yellow-500 text-black"}`}>
                                {user.isVerified ? "Verified" : "Pending"}
                            </span>
                        </p>
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <button className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-900">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
