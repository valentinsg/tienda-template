'use client';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Product } from '../../types/Product';
import { addItem } from '../store/slices/cartSlice';
import Link from 'next/link';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ProductOverviewProps {
  product: Product;
}

const ProductOverview: React.FC<ProductOverviewProps> = ({ product }) => {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const handleAddToCart = () => {
    if (selectedSize) {
      const cartItem = {
        id: `${product.id}-${selectedSize}`,
        name: product.name,
        price: parseFloat(product.price),
        quantity: 1,
      };
      dispatch(addItem(cartItem));
      toast.success('Product added to cart!');
    } else {
      toast.error('Please select a size.');
    }
  };

  return (
    <div className="bg-white p-4 sm:p-8 lg:p-12">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Carousel of additional images */}
        {/* Main product image */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <img
            src={product.images[0].image_url}
            alt={product.name}
            className="rounded-lg object-center object-cover max-h-[500px] w-full"
          />
        </div>
        {/* Product details */}
        <div className="lg:col-span-5 space-y-6">
          {/* Name and breadcrumb */}
          <div>
            <nav aria-label="Breadcrumb">
              <ol role="list" className="flex items-center space-x-2 text-sm text-gray-500">
                <Link href="/" className="hover:text-gray-700">Home</Link>
                <li className="text-gray-300">/</li>
                <li aria-current="page">{product.name}</li>
              </ol>
            </nav>
            <h1 className="text-3xl font-bold text-gray-900 mt-4">{product.name}</h1>
          </div>
          {/* Price */}
          <p className="text-3xl font-semibold text-gray-900">{product.price}</p>
          <p className="text-sm text-gray-500">Taxes included</p>
          {/* Description */}
          <div>
            <h2 className="text-lg font-medium text-gray-900">Description</h2>
            <p className="mt-2 text-gray-700">{product.description}</p>
          </div>
          {/* Size selector */}
          <div>
            <h2 className="text-lg font-medium text-gray-900">Sizes</h2>
            <div className="mt-2 flex space-x-2">
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedSize || ''}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="">Select a size</option>
                {Object.keys(product.available_sizes).map((size) => (
                  <option key={size} value={size}>
                    {size.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Add to cart button */}
          <div>
            <button
              type="button"
              className={`w-full py-3 text-white font-medium rounded-lg ${selectedSize ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              onClick={handleAddToCart}
              disabled={!selectedSize}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOverview;