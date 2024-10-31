'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '../../types/Product';
import ProductList from '../components/ProductList';
import FilterSidebar from '../components/FilterSidebar';
import { Filters } from '../../types/Filters';

const Products = ({ products }: { products: Product[] }) => {
  const router = useRouter();
  const [filteredProducts, setFilteredProducts] = useState(products);

  const handleSelectProduct = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const applyFilters = (filters: Filters) => {
    const filtered = products.filter((product) => {
      const matchesCategory = filters.category ? product.category === filters.category : true;
      const matchesSize = filters.size ? product.sizes.includes(filters.size) : true;
      const matchesMinPrice = filters.minPrice ? parseFloat(product.price) >= parseFloat(filters.minPrice) : true;
      const matchesMaxPrice = filters.maxPrice ? parseFloat(product.price) <= parseFloat(filters.maxPrice) : true;
      const matchesStock = filters.inStock ? product.stock > 0 : true;

      return matchesCategory && matchesSize && matchesMinPrice && matchesMaxPrice && matchesStock;
    });

    setFilteredProducts(filtered);
  };

  return (
    <div className="flex">
      <FilterSidebar onFilterChange={applyFilters} />
      <div className="flex-1 p-4">
        <ProductList products={filteredProducts} onSelectProduct={handleSelectProduct} />
      </div>
    </div>
  );
};

export default Products;
