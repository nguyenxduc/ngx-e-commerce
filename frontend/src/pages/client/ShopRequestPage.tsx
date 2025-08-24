import React, { useState } from "react";
import { Store, CheckCircle, AlertCircle, Clock, FileText } from "lucide-react";
import ShopRequestForm from "../../components/shop/ShopRequestForm";

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

const ShopRequestPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (data: ShopRequestFormData) => {
    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would typically send the data to your backend
      console.log("Shop request submitted:", data);

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting shop request:", error);
      // Handle error (show notification, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Request Submitted Successfully!
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for your interest in opening a shop on our platform.
              We've received your application and will review it within 3-5
              business days.
            </p>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                What happens next?
              </h3>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    We'll review your application within 3-5 business days
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>You'll receive an email with our decision</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Store className="w-4 h-4" />
                  <span>
                    If approved, you can start setting up your shop immediately
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => (window.location.href = "/")}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Return to Home
              </button>
              <button
                onClick={() => setSubmitted(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="text-indigo-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Open Your Shop
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of successful sellers on our platform. Start selling
            your products to customers worldwide.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Easy Setup
            </h3>
            <p className="text-sm text-gray-600">
              Get your shop up and running in minutes with our simple setup
              process
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Store className="text-blue-600" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Global Reach
            </h3>
            <p className="text-sm text-gray-600">
              Sell to customers worldwide with our extensive marketplace
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-purple-600" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              24/7 Support
            </h3>
            <p className="text-sm text-gray-600">
              Get help whenever you need it with our dedicated support team
            </p>
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Requirements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900">
                Required Documents
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Valid business license</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Government-issued ID</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Tax identification number</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Bank account information</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900">
                Business Information
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Shop name and description</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Business category</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Contact information</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Physical address</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Application Process */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Application Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-indigo-600 font-semibold">1</span>
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                Submit Application
              </h3>
              <p className="text-xs text-gray-600">
                Fill out the form below with your business details
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-indigo-600 font-semibold">2</span>
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                Review Process
              </h3>
              <p className="text-xs text-gray-600">
                We'll review your application within 3-5 business days
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-indigo-600 font-semibold">3</span>
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                Approval
              </h3>
              <p className="text-xs text-gray-600">
                Receive approval email and start setting up your shop
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-indigo-600 font-semibold">4</span>
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                Start Selling
              </h3>
              <p className="text-xs text-gray-600">
                Add products and start selling to customers
              </p>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <ShopRequestForm onSubmit={handleSubmit} loading={isSubmitting} />
      </div>
    </div>
  );
};

export default ShopRequestPage;
