'use client'
import { supabase } from '@/app/supabase';
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import { Category } from '@/types/Category';

const CategoryPage = () => {
  const router = useParams();
  const slug = router.slug;
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (slug) {
      // Fetch category data from Supabase based on slug
      const fetchCategory = async () => {
        try {
          const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('slug', slug)
            .single();

          if (error) {
            throw error;
          }

          setCategory(data);
        } catch (error) {
          console.error('Error fetching category:', error);
        }
      };

      fetchCategory();
    }
  }, [slug]);

  if (!category) {
    return <div>Loading...</div>;
  }

  return (
    <div> 
      <h1>{category.name}</h1>
    </div>
  );
};

export default CategoryPage;