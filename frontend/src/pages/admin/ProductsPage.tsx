import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Store,
  Tag,
  Eye,
  Edit,
  Trash2,
  Star,
} from "lucide-react";
import type { AdminProduct } from "../../types/admin.types";
import { AdminConfirmModal } from "../../components/admin/AdminConfirmModal";
import { AdminProductModal } from "../../components/admin/AdminProductModal";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<AdminProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(
    null
  );
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockProducts: AdminProduct[] = [
      {
        id: "1",
        name: "Wireless Bluetooth Headphones",
        shop: { id: "1", name: "TechStore" },
        category: "Electronics",
        price: 99.99,
        stock: 150,
        status: "active",
        featured: true,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-15",
      },
      {
        id: "2",
        name: "Smart Fitness Watch",
        shop: { id: "2", name: "HealthGear" },
        category: "Wearables",
        price: 199.99,
        stock: 75,
        status: "active",
        featured: true,
        createdAt: "2024-01-02",
        updatedAt: "2024-01-14",
      },
      {
        id: "3",
        name: "Laptop Stand Adjustable",
        shop: { id: "1", name: "TechStore" },
        category: "Accessories",
        price: 49.99,
        stock: 200,
        status: "active",
        featured: false,
        createdAt: "2024-01-03",
        updatedAt: "2024-01-13",
      },
      {
        id: "4",
        name: "Premium Phone Case",
        shop: { id: "3", name: "MobileWorld" },
        category: "Accessories",
        price: 29.99,
        stock: 0,
        status: "out_of_stock",
        featured: false,
        createdAt: "2024-01-04",
        updatedAt: "2024-01-12",
      },
      {
        id: "5",
        name: "Wireless Charger Pad",
        shop: { id: "1", name: "TechStore" },
        category: "Electronics",
        price: 39.99,
        stock: 100,
        status: "inactive",
        featured: false,
        createdAt: "2024-01-05",
        updatedAt: "2024-01-11",
      },
    ];
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.shop.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (product) => product.category === categoryFilter
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((product) => product.status === statusFilter);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "out_of_stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Electronics":
        return "bg-blue-100 text-blue-800";
      case "Wearables":
        return "bg-purple-100 text-purple-800";
      case "Accessories":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price * 24000);
  };

  // CRUD Operations
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product: AdminProduct) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    setDeleteProductId(productId);
    setIsConfirmModalOpen(true);
  };

  const handleSaveProduct = async (productData: Partial<AdminProduct>) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (selectedProduct) {
        // Update existing product
        setProducts((prev) =>
          prev.map((p) =>
            p.id === selectedProduct.id
              ? { ...p, ...productData, updatedAt: new Date().toISOString() }
              : p
          )
        );
      } else {
        // Add new product
        const newProduct: AdminProduct = {
          id: Date.now().toString(),
          ...(productData as AdminProduct),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setProducts((prev) => [...prev, newProduct]);
      }

      setIsProductModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteProductId) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProducts((prev) => prev.filter((p) => p.id !== deleteProductId));
      setIsConfirmModalOpen(false);
      setDeleteProductId(null);
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content">
            Quản lý sản phẩm
          </h1>
          <p className="text-base-content/70 mt-2">
            Quản lý tất cả sản phẩm trong hệ thống
          </p>
        </div>

        {/* Header Actions */}
        <div className="bg-base-100 rounded-xl shadow-sm p-6 border border-base-300 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-content/50" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-10 pr-4 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-base-100 text-base-content"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-base-100 text-base-content"
                >
                  <option value="all">Tất cả danh mục</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Wearables">Wearables</option>
                  <option value="Accessories">Accessories</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-base-100 text-base-content"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                  <option value="out_of_stock">Hết hàng</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleAddProduct}
              className="bg-primary text-primary-content px-4 py-2 rounded-lg hover:bg-primary-focus transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Thêm sản phẩm
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-base-200 border-b border-base-300">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                    Cửa hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                    Tồn kho
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-base-100 divide-y divide-base-300">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-base-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-base-300 rounded-lg flex items-center justify-center">
                          <Tag className="h-6 w-6 text-base-content/50" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-base-content">
                            {product.name}
                          </div>
                          <div className="text-sm text-base-content/70">
                            ID: {product.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Store className="h-4 w-4 text-base-content/50 mr-2" />
                        <span className="text-sm text-base-content">
                          {product.shop.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                          product.category
                        )}`}
                      >
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-base-content">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span
                          className={`text-sm font-medium ${
                            product.stock === 0
                              ? "text-error"
                              : product.stock < 50
                              ? "text-warning"
                              : "text-success"
                          }`}
                        >
                          {product.stock}
                        </span>
                        {product.featured && (
                          <Star className="h-4 w-4 text-warning ml-2" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          product.status
                        )}`}
                      >
                        {product.status === "active"
                          ? "Hoạt động"
                          : product.status === "inactive"
                          ? "Không hoạt động"
                          : "Hết hàng"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-base-content">
            Hiển thị <span className="font-medium">1</span> đến{" "}
            <span className="font-medium">{filteredProducts.length}</span> trong
            tổng số <span className="font-medium">{products.length}</span> sản
            phẩm
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 border border-base-300 rounded-lg text-sm text-base-content hover:bg-base-200 disabled:opacity-50 disabled:cursor-not-allowed">
              Trước
            </button>
            <button className="px-3 py-2 bg-primary text-primary-content rounded-lg text-sm hover:bg-primary-focus">
              1
            </button>
            <button className="px-3 py-2 border border-base-300 rounded-lg text-sm text-base-content hover:bg-base-200 disabled:opacity-50 disabled:cursor-not-allowed">
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AdminProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProduct(null);
        }}
        onSave={handleSaveProduct}
        product={selectedProduct}
        loading={loading}
      />

      <AdminConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setDeleteProductId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Xóa sản phẩm"
        message="Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
        loading={loading}
      />
    </div>
  );
}
