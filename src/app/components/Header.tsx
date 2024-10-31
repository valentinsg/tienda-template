'use client'
import React, { useState } from 'react';
import Link from 'next/link'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-800">Mi Tienda</h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>

            {/* Productos Dropdown */}
            <div 
              className="relative" 
              onMouseEnter={() => setDropdownOpen(true)} 
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <Link
              href="/products"
              className="text-gray-600 hover:text-gray-900 flex items-center"
              >
              Products
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
              </Link>

              {dropdownOpen && (
              <div className="absolute z-50  w-48 rounded-md shadow-lg bg-white">
                <div className="py-1">
                <Link href="/products/remeras" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Remeras</Link>
                <Link href="/products/hoodies" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Hoodies</Link>
                <Link href="/products/pantalones" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Pantalones</Link>
                <Link href="/products/zapatillas" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Zapatillas</Link>
                <Link href="/products/ojotas" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Ojotas</Link>
                </div>
              </div>
              )}
            </div>

            <Link href="/about" className="text-gray-600 hover:text-gray-900">About Us</Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link href="/" className="block px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50">Home</Link>
          <Link href="/productos" className="block px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50">Productos</Link>
          <Link href="/about" className="block px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50">About Us</Link>
          <Link href="/contact" className="block px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50">Contact</Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;