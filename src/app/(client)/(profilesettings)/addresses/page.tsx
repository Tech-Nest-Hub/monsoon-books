import { MapPin } from "lucide-react";

// Optional: app/profile/addresses/page.tsx (Address Book page)
export default function AddressBookPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Address Book</h1>
        <p className="text-gray-500 mt-1">Manage your shipping addresses</p>
      </div>
      
      <div className="text-center py-12">
        <MapPin className="h-12 w-12 mx-auto text-gray-400" />
        <p className="text-gray-500 mt-2">No addresses added yet</p>
        <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Add New Address
        </button>
      </div>
    </div>
  )
}