"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/Button";
import { Plus, RefreshCcw } from "lucide-react";
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
import { requestSync } from "@/lib/mutators";
import { useLoading } from "@/lib/context/Loading";
import CategoryManager from "../../components/category/category-manager";

const fetchCategories = async (): Promise<ICategory[]> => {
    const { data } = await request.get("categories");
    return data;
};

const deleteCategory = async (categoryId: string) => {
    await request.delete(`categories/${categoryId}`);
};

export function Categories() {
    const { setLoading, setInfo } = useLoading();

    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { data: categories, isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
    });

    // const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const router = useRouter();

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

    // const toggleCategory = useCallback((categoryId: string) => {
    //     setExpandedCategories((prev) =>
    //         prev.includes(categoryId)
    //             ? prev.filter((id) => id !== categoryId)
    //             : [...prev, categoryId]
    //     );
    // }, []);

    // const handleCategoryClick = useCallback((category: ICategory) => {
    //     if (category.content_type == "CATEGORY") {
    //         setSelectedCategory(category.id);
    //     }
    // }, []);

    const handleDoubleClick = useCallback((categoryId: string) => {
        router.push(`/categories/info?id=${categoryId}`);
    }, [router]);

    const handleDeleteCategory = useCallback((categoryId: string) => {
        setSelectedCategory(categoryId);
        setIsDeleteDialogOpen(true);
    }, []);

    const handleEditCategory = useCallback((categoryId: string) => {
        router.push(`/categories/info?id=${categoryId}`);
    }, [router]);

    const confirmDelete = useCallback(() => {
        if (selectedCategory) {
            deleteMutate(selectedCategory);
        }
        setIsDeleteDialogOpen(false);
    }, [selectedCategory, deleteMutate]);

    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        if (selectedCategory) {
            if (event.key === "Delete") {
                handleDeleteCategory(selectedCategory);
            } else if (event.key === "Enter" && !isDeleteDialogOpen) {
                router.push(`/categories/info?id=${selectedCategory}`);
            }
        }
    }, [selectedCategory, handleDeleteCategory, router, isDeleteDialogOpen]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [handleKeyPress]);


    const { mutate: request_sync } = useMutation({
        mutationFn: requestSync,
        onMutate: () => {
            setInfo({
                title: "Mahsulotlar sinxronlanmoqda",
                description: "Iltimos biroz kuting"
            })
            setLoading(true);
        },
        onSuccess: () => {
            setLoading(false);

            toast({
                title: "Mahsulotlar sinxronlandi."
            })
        },
        onError: () => {
            setLoading(false);
            toast({
                title: "Hatolik yuz berdi."
            })
        }
    });


    const sync = () => {

        request_sync();
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Kategoriyalar</h1>
                <div className="flex gap-2">

                    <Button className="button" onClick={sync}>
                        <RefreshCcw className="mr-2 h-4 w-4" />Sinxronlash
                    </Button>

                    <CreateCategoryModal parent={selectedCategory}>
                        <Button className="button">
                            <Plus className="mr-2 h-4 w-4" />Kategoriya qo&apos;shish
                        </Button>
                    </CreateCategoryModal>
                </div>
            </div>
            <div className="rounded-xl p-4 bg-white">
                {isLoading || !categories ? (
                    <SkeletonCategories />
                ) : (
                    <CategoryManager handleDoubleClick={handleDoubleClick}
                            handleDeleteCategory={handleDeleteCategory}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            handleEditCategory={handleEditCategory}/>
                    // <CategoryList
                    //     categories={categories}
                    //     expandedCategories={expandedCategories}
                    //     toggleCategory={toggleCategory}
                    //     selectedCategory={selectedCategory}
                    //     handleCategoryClick={handleCategoryClick}
                    //     handleDoubleClick={handleDoubleClick}
                    //     handleDeleteCategory={handleDeleteCategory}
                    //     handleEditCategory={handleEditCategory}
                    //     isParent={true}
                    // />
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

// interface CategoryListProps {
//     categories: ICategory[];
//     expandedCategories: string[];
//     toggleCategory: (categoryId: string) => void;
//     selectedCategory: string | null;
//     handleCategoryClick: (category: ICategory) => void;
//     handleDoubleClick: (categoryId: string) => void;
//     handleDeleteCategory: (categoryId: string) => void;
//     handleEditCategory: (categoryId: string) => void;
//     level?: number;
//     isParent: boolean;
// }

// function CategoryList({
//     categories,
//     expandedCategories,
//     toggleCategory,
//     selectedCategory,
//     handleCategoryClick,
//     handleDoubleClick,
//     handleDeleteCategory,
//     handleEditCategory,
//     level = 0,
//     isParent
// }: CategoryListProps) {
//     const indent = level * 24;
//     console.log(categories);
    
//     return (
//         <div className="space-y-2">
//             {isParent && <div className="grid grid-cols-4 w-full items-center p-2 hover:bg-green-100 rounded-md cursor-pointer">
//                 <div className="text-left">Mahsulot nomi (O'z)</div>
//                 <div className="text-left">Mahsulot nomi (RU)</div>
//                 <div className="text-left">Mahsulot soni</div>
//                 <div className="text-left">Bugungi tashriflar</div>
//             </div> }
//             {categories.map((category) => (
//                 <div key={category.id}>
//                     <div
//                         className={`flex items-center p-2 hover:bg-green-100 rounded-md cursor-pointer ${selectedCategory === category.id ? "bg-green-200" : ""
//                             }`}
//                         style={{ marginLeft: `${indent}px` }}
//                         onClick={(e) => {
//                             handleCategoryClick(category);
//                             e.stopPropagation();
//                             toggleCategory(category.id);
//                         }}
//                         onDoubleClick={() => handleDoubleClick(category.id)}
//                     >
//                         <div className="flex-1 flex items-center">
//                             {category.content_type === "CATEGORY" && (
//                                 <span className="mr-2 cursor-pointer">
//                                     {expandedCategories.includes(category.id) ? (
//                                         <ChevronDown className="h-4 w-4" />
//                                     ) : (
//                                         <ChevronRight className="h-4 w-4" />
//                                     )}
//                                 </span>
//                             )}
//                             <span>{category.name_uz}</span>
//                         </div>
//                         <div className="flex-1 flex items-center">
//                             {category.content_type === "CATEGORY" && (
//                                 <span className="mr-2 cursor-pointer">
//                                     {expandedCategories.includes(category.id) ? (
//                                         <ChevronDown className="h-4 w-4" />
//                                     ) : (
//                                         <ChevronRight className="h-4 w-4" />
//                                     )}
//                                 </span>
//                             )}
//                             <span>{category.name_ru}</span>
//                         </div>
//                         <div className="flex-1">Mahsulotlar soni: {category.products_count}</div>
//                         <div className="flex-1">Bugungi tashriflar: {category.today_visits}</div>
//                         <div className="flex items-center space-x-2">
//                             <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleEditCategory(category.id);
//                                 }}
//                             >
//                                 <Edit className="h-4 w-4" />
//                             </Button>
//                             <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleDeleteCategory(category.id);
//                                 }}
//                             >
//                                 <Trash2 className="h-4 w-4" />
//                             </Button>
//                         </div>
//                     </div>

//                     {expandedCategories.includes(category.id) && category.children.length > 0 && (
//                         <CategoryList
//                             categories={category.children}
//                             expandedCategories={expandedCategories}
//                             toggleCategory={toggleCategory}
//                             selectedCategory={selectedCategory}
//                             handleCategoryClick={handleCategoryClick}
//                             handleDoubleClick={handleDoubleClick}
//                             handleDeleteCategory={handleDeleteCategory}
//                             handleEditCategory={handleEditCategory}
//                             level={level + 1}
//                             isParent={false}
//                         />
//                     )}
//                 </div>
//             ))}
//         </div>
//     );
// }

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
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-8" />
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