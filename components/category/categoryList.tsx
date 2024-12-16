import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Reorder, AnimatePresence } from "framer-motion";
import { ICategory } from "@/lib/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "@/lib/api";
// import { queryClient } from "@/lib/query";
import debounce from 'lodash/debounce';

interface CategoryListProps {
  expandedCategories: string[];
  toggleCategory: (id: string) => void;
  selectedCategory: string | null;
  handleCategoryClick: (category: ICategory) => void;
  handleDoubleClick: (id: string) => void;
  handleDeleteCategory: (id: string) => void;
  handleEditCategory: (id: string) => void;
  level?: number;
  isParent?: boolean;
}

const fetchCategories = async (): Promise<ICategory[]> => {
  const { data } = await request.get("categories");
  return data;
};

const CategoryList: React.FC<CategoryListProps> = ({
  expandedCategories = [],
  toggleCategory = () => {},
  selectedCategory = null,
  handleCategoryClick = () => {},
  handleDoubleClick = () => {},
  handleDeleteCategory = () => {},
  handleEditCategory = () => {},
  level = 0,
}) => {
  const [currentCategories, setCurrentCategories] = useState<ICategory[]>([]);
  const { data: categoriesData, isLoading } = useQuery<ICategory[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  useEffect(() => {
    if (isLoading) return;
    setCurrentCategories(categoriesData as ICategory[]);
  }, [isLoading, categoriesData]);

  const reorderMutation = useMutation({
    mutationFn: (idList: string[]) =>
      request.post("categories/reorder", { categories: idList }),
    onSuccess: () => {
      //   queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.error("Error reordering categories:", error);
    },
  });

  const debouncedGetSortedId = useMemo(
    () =>
      debounce((newOrder: ICategory[]) => {
        const sortedId = newOrder.map((item) => item.id);
        reorderMutation.mutate(sortedId);
      }, 500),
    []
  );

  const handleReorder = useCallback(
    (newItems: ICategory[]) => {
      console.log(newItems);
      setCurrentCategories(newItems);
      debouncedGetSortedId(newItems);
    },
    [debouncedGetSortedId]
  );

  const renderCategory = (category: ICategory) => (
    <div className="w-full bg-white">
      <div
        className={`flex items-center w-full p-2 hover:bg-green-100 rounded-md cursor-pointer ${
          selectedCategory === category.id ? "bg-green-200" : ""
        }`}
        style={{ marginLeft: `${level * 24}px` }}
        onClick={(e) => {
          handleCategoryClick(category);
          e.stopPropagation();
          toggleCategory(category.id);
        }}
        onDoubleClick={() => handleDoubleClick(category.id)}
      >
        <div className="flex-1 flex items-center">
          {category.content_type === "CATEGORY" && (
            <span className="mr-2 cursor-pointer">
              {expandedCategories.includes(category.id) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </span>
          )}
          <span>{category.name_uz}</span>
        </div>
        <div className="flex-1 flex items-center">{category.name_ru}</div>
        <div className="flex-1">
          Mahsulotlar soni: {category.products_count}
        </div>
        <div className="flex-1">
          Bugungi tashriflar: {category.today_visits}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEditCategory(category.id);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteCategory(category.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {expandedCategories.includes(category.id) &&
        category.children.length > 0 &&
        category?.children.map((category) => {
          return renderCategory(category);
        })}
    </div>
  );

  return (
    <Reorder.Group
      as="div"
      values={currentCategories}
      onReorder={handleReorder}
    >
      <AnimatePresence>
        <div className="grid grid-cols-4 w-full items-center p-2 hover:bg-green-100 rounded-md cursor-pointer">
          <div className="text-left">Mahsulot nomi (O'z)</div>
          <div className="text-left">Mahsulot nomi (RU)</div>
          <div className="text-left">Mahsulot soni</div>
          <div className="text-left">Bugungi tashriflar</div>
        </div>
        {currentCategories.map((category, index) => (
          <Reorder.Item
            key={category.id}
            value={category}
            animate={false}
            layout={"position"} // Disables layout animations
            whileDrag={{
              scale: 1.05,
              zIndex: index,
              boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
            }}
            className="duration-0 flex rounded-md"
          >
            {renderCategory(category)}
          </Reorder.Item>
        ))}
      </AnimatePresence>
    </Reorder.Group>
  );
};

export default CategoryList;
