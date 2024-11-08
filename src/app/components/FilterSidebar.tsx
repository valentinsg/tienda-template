import React, { useState } from 'react';
import { Filters } from '../../types/Filters';
import { Category } from '../../types/Category';
import { useProducts } from '../context/ProductContext';

interface FilterSidebarProps {
  onFilterChange: (filters: Filters) => void;
}

export default function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const {categories} = useProducts();

  const [filters, setFilters] = useState({
    category: '',
    color: '',
    size: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    const newFilters = {
      ...filters,
      [name]: type === 'checkbox' ? checked : value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="p-4 border-r border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Filtros</h2>
      
      {/* Categoría */}

      <label className="block mb-2">
        <span className="text-gray-700">Categoría</span>
        <select name="category" onChange={handleChange} className="mt-1 block w-full">
          <option value="">Todas</option>
          {categories.map((category: Category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      
      {/* Tamaño */}
      <label className="block mb-2">
        <span className="text-gray-700">Tamaño</span>
        <select name="size" onChange={handleChange} className="mt-1 block w-full">
          <option value="">Todos</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          {/* Agrega más opciones según las tallas */}
        </select>
      </label>

      {/* Precio mínimo y máximo */}
      <label className="block mb-2">
        <span className="text-gray-700">Precio mínimo</span>
        <input type="number" name="minPrice" onChange={handleChange} className="mt-1 block w-full" />
      </label>
      <label className="block mb-4">
        <span className="text-gray-700">Precio máximo</span>
        <input type="number" name="maxPrice" onChange={handleChange} className="mt-1 block w-full" />
      </label>

      {/* Stock */}
      <label className="flex items-center mb-4">
        <input type="checkbox" name="inStock" onChange={handleChange} className="mr-2" />
        <span className="text-gray-700">En stock</span>
      </label>
    </div>
  );
}
