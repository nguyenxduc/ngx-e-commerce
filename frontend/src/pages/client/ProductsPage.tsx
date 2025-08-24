import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '@/api/product.service';
import type { Product, ProductFilters } from '@/types';

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>({});

  useEffect(() => {
    const category = searchParams.get('category');
    const sale = searchParams.get('sale');
    const sort = searchParams.get('sort');
    const search = searchParams.get('search');

    const newFilters: ProductFilters = {};
    if (category) newFilters.category = category;
    if (sale === 'true') newFilters.inStock = true;
    if (sort) newFilters.sortBy = sort as any;
    if (search) newFilters.search = search;

    setFilters(newFilters);
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getProducts(filters);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to mock data
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Váy Hè Thời Trang',
      description: 'Váy đẹp cho mùa hè',
      price: 299000,
      originalPrice: 399000,
      images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop'],
      category: 'women',
      rating: 4.5,
      reviewCount: 128,
      sellerId: '1',
      sellerName: 'Fashion Store',
      shopName: 'Fashion Store',
      inStock: true,
      tags: ['vay', 'he', 'thoi-trang'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      sizes: ['S', 'M', 'L'],
      colors: ['Đỏ', 'Xanh', 'Trắng'],
    },
    // Add more mock products...
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-base-200 rounded-lg h-80 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tất cả sản phẩm</h1>
        <p className="text-gray-600">Tìm thấy {products.length} sản phẩm</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-base-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-sm mb-2">{product.name}</h3>
              <div className="flex items-center space-x-1 mb-2">
                <span className="text-yellow-400">★</span>
                <span className="text-sm text-gray-600">{product.rating}</span>
                <span className="text-xs text-gray-500">({product.reviewCount})</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-primary">
                  {product.price.toLocaleString('vi-VN')}đ
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    {product.originalPrice.toLocaleString('vi-VN')}đ
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
