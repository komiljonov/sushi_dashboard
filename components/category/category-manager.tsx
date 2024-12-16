'use client'

import CategoryList from '@/components/category/categoryList';
import { ICategory } from '@/lib/types';
import React, { useState } from 'react';



type CategoryProps = {
    handleDoubleClick: (categoryId: string) => void;
    handleDeleteCategory: (categoryId: string) => void;
    handleEditCategory: (categoryId: string) => void;
}

const CategoryManager: React.FC<CategoryProps> = ({handleDeleteCategory, handleDoubleClick, handleEditCategory}) => {
    
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };



  const handleCategoryClick = (category: ICategory) => {
    setSelectedCategory(category.id);
  };

  // const handleDoubleClick = (id: string) => {
  //   // Implement double click logic
  //   console.log('Double clicked:', id);
  // };

  // const handleDeleteCategory = (id: string) => {
  //   // Implement delete logic
  //   console.log('Delete category:', id);
  // };

  // const handleEditCategory = (id: string) => {
  //   // Implement edit logic
  //   console.log('Edit category:', id);
  // };


  return (
    <CategoryList
      expandedCategories={expandedCategories}
      toggleCategory={toggleCategory}
      selectedCategory={selectedCategory}
      handleCategoryClick={handleCategoryClick}
      handleDoubleClick={handleDoubleClick}
      handleDeleteCategory={handleDeleteCategory}
      handleEditCategory={handleEditCategory}
    />
  );
};

export default CategoryManager;

