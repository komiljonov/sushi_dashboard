import { ICategory } from "@/lib/types";
import { useState, useCallback, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { request } from "@/lib/api";

// Deleting category API request
const deleteCategory = async (categoryId: string) => {
    await request.delete(`categories/${categoryId}`);
};

interface HierarchyListProps {
    categories: ICategory[];
}

export default function HierarchyList({ categories }: HierarchyListProps) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
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
        setSelectedCategory(category);
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
            deleteMutate(selectedCategory.id);
        }
        setIsDeleteDialogOpen(false);
    }, [selectedCategory, deleteMutate]);

    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        if (selectedCategory) {
            if (event.key === "Delete") {
                handleDeleteCategory();
            } else if (event.key === "Enter" && !isDeleteDialogOpen) {
                router.push(`/categories/info?id=${selectedCategory.id}`);
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
        <div className="space-y-2">
            {categories.map((category) => (
                <div key={category.id}>
                    <div
                        className={`flex items-center p-2 hover:bg-green-100 rounded-md cursor-pointer ${selectedCategory?.id === category.id ? "bg-green-200" : ""}`}
                        onClick={() => handleCategoryClick(category)}
                        onDoubleClick={() => handleDoubleClick(category.id)}
                    >
                        <div className="flex-1 flex items-center" onClick={(e) => { e.stopPropagation(); toggleCategory(category.id); }}>
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
                        <div className="ml-4">
                            <HierarchyList categories={category.children} />
                        </div>
                    )}
                </div>
            ))}

            {/* Delete Confirmation Dialog */}
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
                        <AlertDialogAction onClick={confirmDelete}>O&apos;chirish</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
