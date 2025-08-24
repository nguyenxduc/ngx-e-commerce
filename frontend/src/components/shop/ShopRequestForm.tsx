import React, { useState } from "react";
import { Store, Upload, X, CheckCircle } from "lucide-react";

interface ShopRequestFormData {
  shopName: string;
  description: string;
  category: string;
  address: string;
  phone: string;
  email: string;
  businessLicense: File | null;
  idCard: File | null;
  taxCode: string;
  bankAccount: string;
  bankName: string;
}

interface ShopRequestFormProps {
  onSubmit: (data: ShopRequestFormData) => void;
  loading?: boolean;
}

const ShopRequestForm: React.FC<ShopRequestFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState<ShopRequestFormData>({
    shopName: "",
    description: "",
    category: "",
    address: "",
    phone: "",
    email: "",
    businessLicense: null,
    idCard: null,
    taxCode: "",
    bankAccount: "",
    bankName: "",
  });

  const [errors, setErrors] = useState<Partial<ShopRequestFormData>>({});
  const [uploadedFiles, setUploadedFiles] = useState<{
    businessLicense?: string;
    idCard?: string;
  }>({});

  const categories = [
    "Electronics",
    "Fashion",
    "Home & Garden",
    "Sports & Outdoors",
    "Books & Media",
    "Health & Beauty",
    "Automotive",
    "Toys & Games",
    "Food & Beverages",
    "Other",
  ];

  const handleInputChange = (
    field: keyof ShopRequestFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileUpload = (
    field: "businessLicense" | "idCard",
    file: File
  ) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
    setUploadedFiles((prev) => ({ ...prev, [field]: file.name }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const removeFile = (field: "businessLicense" | "idCard") => {
    setFormData((prev) => ({ ...prev, [field]: null }));
    setUploadedFiles((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ShopRequestFormData> = {};

    if (!formData.shopName.trim()) {
      newErrors.shopName = "Shop name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.businessLicense) {
      newErrors.businessLicense = "Business license is required";
    }

    if (!formData.idCard) {
      newErrors.idCard = "ID card is required";
    }

    if (!formData.taxCode.trim()) {
      newErrors.taxCode = "Tax code is required";
    }

    if (!formData.bankAccount.trim()) {
      newErrors.bankAccount = "Bank account is required";
    }

    if (!formData.bankName.trim()) {
      newErrors.bankName = "Bank name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Store className="text-indigo-600" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Shop Registration Request
            </h2>
            <p className="text-sm text-gray-500">
              Fill out the form below to request shop registration
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shop Name *
              </label>
              <input
                type="text"
                value={formData.shopName}
                onChange={(e) => handleInputChange("shopName", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.shopName ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter shop name"
              />
              {errors.shopName && (
                <p className="mt-1 text-sm text-red-600">{errors.shopName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.category ? "border-red-300" : "border-gray-300"
                }`}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.description ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Describe your shop and what you plan to sell..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.address ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter shop address"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.phone ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.email ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Business Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Code *
              </label>
              <input
                type="text"
                value={formData.taxCode}
                onChange={(e) => handleInputChange("taxCode", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.taxCode ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter tax code"
              />
              {errors.taxCode && (
                <p className="mt-1 text-sm text-red-600">{errors.taxCode}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Account *
              </label>
              <input
                type="text"
                value={formData.bankAccount}
                onChange={(e) =>
                  handleInputChange("bankAccount", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.bankAccount ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter bank account number"
              />
              {errors.bankAccount && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.bankAccount}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name *
              </label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => handleInputChange("bankName", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.bankName ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter bank name"
              />
              {errors.bankName && (
                <p className="mt-1 text-sm text-red-600">{errors.bankName}</p>
              )}
            </div>
          </div>
        </div>

        {/* Document Upload */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Required Documents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business License *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {uploadedFiles.businessLicense ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="text-green-500" size={16} />
                      <span className="text-sm text-gray-700">
                        {uploadedFiles.businessLicense}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile("businessLicense")}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto text-gray-400" size={24} />
                    <p className="mt-2 text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload("businessLicense", file);
                      }}
                      className="hidden"
                      id="businessLicense"
                    />
                    <label
                      htmlFor="businessLicense"
                      className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      Choose File
                    </label>
                  </div>
                )}
              </div>
              {errors.businessLicense && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.businessLicense}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Card *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {uploadedFiles.idCard ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="text-green-500" size={16} />
                      <span className="text-sm text-gray-700">
                        {uploadedFiles.idCard}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile("idCard")}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto text-gray-400" size={24} />
                    <p className="mt-2 text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload("idCard", file);
                      }}
                      className="hidden"
                      id="idCard"
                    />
                    <label
                      htmlFor="idCard"
                      className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      Choose File
                    </label>
                  </div>
                )}
              </div>
              {errors.idCard && (
                <p className="mt-1 text-sm text-red-600">{errors.idCard}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            <span>{loading ? "Submitting..." : "Submit Request"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShopRequestForm;
