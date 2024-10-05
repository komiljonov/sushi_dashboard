"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/Button";
import { Plus, ChevronDown, ChevronRight } from "lucide-react";
import { request } from "@/lib/api";
import { Layout } from "@/components/Layout";
import CreateCategoryModal from "@/components/category/create";
import { ICategory } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Fetching categories from API
const fetchCategories = async (): Promise<ICategory[]> => {
    const { data } = await request.get("categories");
    return data;
};

// Deleting category API request
const deleteCategory = async (categoryId: string) => {
    await request.delete(`categories/${categoryId}`);
};

export function Categories() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { data: categories = [], isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
    });

    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const router = useRouter();

    // Mutation for deleting category
    const { mutate: deleteMutate } = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            toast({
                title: "Kategoriya o'chirildi.",
                description: "O'chirildi.",
            });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            setSelectedCategory(null);
        },
        onError: () => {
            toast({
                title: "Kategoriyani o'chirishda hatolik.",
                description: "O'chirilmadi.",
            });
        },
    });

    const toggleCategory = useCallback((categoryId: string) => {
        setExpandedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        );
    }, []);

    const handleCategoryClick = useCallback((category: ICategory) => {
        console.log(category);

        if (category.content_type == "CATEGORY") {
            setSelectedCategory(category.id);
        }
    }, []);

    const handleDoubleClick = useCallback((categoryId: string) => {
        router.push(`/categories/info?id=${categoryId}`);
    }, [router]);

    const handleDeleteCategory = useCallback(() => {
        if (selectedCategory) {
            setIsDeleteDialogOpen(true);
        } else {
            toast({
                title: "Ogohlantirish",
                description: "Hech qanday kategoriya tanlanmagan",
            });
        }
    }, [selectedCategory, toast]);

    const confirmDelete = useCallback(() => {
        if (selectedCategory) {
            deleteMutate(selectedCategory);
        }
        setIsDeleteDialogOpen(false);
    }, [selectedCategory, deleteMutate]);

    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        if (selectedCategory) {
            if (event.key === "Delete") {
                handleDeleteCategory();
            } else if (event.key === "Enter" && !isDeleteDialogOpen) {
                // Only open category if the delete dialog is not open
                router.push(`/categories/info?id=${selectedCategory}`);
            }
        }
    }, [selectedCategory, handleDeleteCategory, router, isDeleteDialogOpen]);


    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [selectedCategory, handleKeyPress]);

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Kategoriyalar</h1>
                <CreateCategoryModal parent={selectedCategory}>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />Kategoriya qo&apos;shish
                    </Button>
                </CreateCategoryModal>
            </div>
            <div className="border rounded-md p-4">
                {isLoading ? (
                    <SkeletonCategories />
                ) : (
                    <CategoryList
                        categories={categories}
                        expandedCategories={expandedCategories}
                        toggleCategory={toggleCategory}
                        selectedCategory={selectedCategory}
                        handleCategoryClick={handleCategoryClick}
                        handleDoubleClick={handleDoubleClick}
                    />
                )}
            </div>
            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Kategoriyani o&apos;chirish</AlertDialogTitle>
                        <AlertDialogDescription>
                            Haqiqatan ham bu kategoriyani o&apos;chirmoqchimisiz? Bu amalni qaytarib bo&apos;lmaydi.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>
                            O&apos;chirish
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

interface CategoryListProps {
    categories: ICategory[];
    expandedCategories: string[];
    toggleCategory: (categoryId: string) => void;
    selectedCategory: string | null;
    handleCategoryClick: (category: ICategory) => void;
    handleDoubleClick: (categoryId: string) => void;
    level?: number;
}

function CategoryList({
    categories,
    expandedCategories,
    toggleCategory,
    selectedCategory,
    handleCategoryClick,
    handleDoubleClick,
    level = 0,
}: CategoryListProps) {
    const indent = level * 24; // Adjusting indentation in pixels

    return (
        <div className="space-y-2">
            {categories.map((category) => (
                <div key={category.id}>
                    <div
                        className={`flex items-center p-2 hover:bg-green-100 rounded-md cursor-pointer ${selectedCategory === category.id ? "bg-green-200" : ""
                            }`}
                        style={{ marginLeft: `${indent}px` }}
                        onClick={(e) => {
                            handleCategoryClick(category);
                            e.stopPropagation();
                            toggleCategory(category.id);
                        }}
                        onDoubleClick={() => handleDoubleClick(category.id)}
                    >
                        <div
                            className="flex-1 flex items-center"

                        >
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

                        <div className="flex-1">Mahsulotlar soni: {category.products_count}</div>
                        <div className="flex-1">Bugungi tashriflar: {category.today_visits}</div>
                    </div>

                    {expandedCategories.includes(category.id) && category.children.length > 0 && (
                        <CategoryList
                            categories={category.children}
                            expandedCategories={expandedCategories}
                            toggleCategory={toggleCategory}
                            selectedCategory={selectedCategory}
                            handleCategoryClick={handleCategoryClick}
                            handleDoubleClick={handleDoubleClick}
                            level={level + 1}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

function SkeletonCategories() {
    return (
        <div className="space-y-2">
            {Array(4)
                .fill(null)
                .map((_, index) => (
                    <div key={index} className="flex items-center p-2">
                        <div className="flex-1">
                            <Skeleton className="h-4 w-28" />
                        </div>
                        <div className="flex-1">
                            <Skeleton className="h-4 w-28" />
                        </div>
                        <div className="flex-1">
                            <Skeleton className="h-4 w-28" />
                        </div>
                    </div>
                ))}
        </div>
    );
}

export default function Page() {
    return (
        <Layout page="categories">
            <Categories />
        </Layout>
    );
}