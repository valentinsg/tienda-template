'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '../../types/Product';
import ProductList from '../components/ProductList';
import FilterSidebar from '../components/FilterSidebar';
import { Filters } from '../../types/Filters';
import { useProducts } from '../context/ProductContext';

const Products = () => {
  const router = useRouter();
  const { products, isLoading, error } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState(products);

  const handleSelectProduct = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const applyFilters = (filters: Filters) => {
    const filtered = products.filter((product) => {
      const matchesCategory = filters.category ? product.category.toString() === filters.category.toString() : true;
      const matchesSize = filters.size ? product.available_sizes.size.sku === filters.size : true;
      const matchesMinPrice = filters.minPrice ? parseFloat(product.price) >= parseFloat(filters.minPrice) : true;
      const matchesMaxPrice = filters.maxPrice ? parseFloat(product.price) <= parseFloat(filters.maxPrice) : true;

      return matchesCategory && matchesSize && matchesMinPrice && matchesMaxPrice;
    });

    setFilteredProducts(filtered);
  };


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;


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
