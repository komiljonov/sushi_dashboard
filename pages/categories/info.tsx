'use client';

import { Layout } from "@/components/Layout";
import { useEffect, useState } from "react";
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, TrendingUp } from 'lucide-react';
import { request } from '@/lib/api';
import { ICategory, ICategoryWithStats, IFile } from "@/lib/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import Image from "next/image";
import { queryClient } from "@/lib/query";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Products } from "@/components/product/list";
import { splitToHundreds } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import HierarchyList from '@/components/category/HierarchyList';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const getCategoryIdFromUrl = (): string | null => {
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    const queryParams = new URLSearchParams(url.search);
    return queryParams.get('id');
  }
  return null;
}

const fetchCategoryData = async (id: string): Promise<ICategoryWithStats> => {
  const { data } = await request.get(`categories/${id}/stats`);
  return data;
}

const editCategory = async (id: string, edit_data: ICategory): Promise<ICategory> => {
  const { data } = await request.patch(`categories/${id}`, edit_data);
  return data;
}

function CategoryInfo({ category }: { category?: ICategoryWithStats }) {
  const { toast } = useToast();
  const { register, reset, handleSubmit, control } = useForm<ICategory>();

  useEffect(() => {
    if (category) {
      reset({
        name_uz: category.name_uz,
        name_ru: category.name_ru,
        active: category.active
      });
    }
  }, [category, reset]);

  const mutation = useMutation({
    mutationFn: (data: ICategory) => {
      if (category) {
        return editCategory(category.id, data);
      }
      return Promise.reject(new Error('Kategoriya ID null'));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category', category?.id] });
      toast({
        title: 'Saqlandi'
      });
    },
    onError: (error) => {
      console.error('Kategoriya yaratishda xatolik:', error);
      toast({
        title: 'Xatolik yuz berdi',
        variant: 'destructive'
      });
    }
  });

  const handleSave = (data: ICategory) => {
    mutation.mutate(data);
  }

  const pieChartData = {
    labels: category?.products?.map(product => product.name_uz),
    datasets: [
      {
        data: category?.products?.map((product) => product.sale_count),
        backgroundColor: [
          '#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#6F42C1',
          '#F03E3E', '#FFD33D', '#4BBF73', '#3B82F6', '#5F3F8D'
        ],
      },
    ],
  };

  const barChartData = {
    labels: category?.visits?.map(item => item.date) || [],
    datasets: [
      {
        label: 'Tashrif chastotasi',
        data: category?.visits?.map(item => item.visits) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  }

  const barChartDataTime = {
    labels: category?.average_visit_time?.map(item => item.hour) || [],
    datasets: [
      {
        label: 'Tashrif chastotasi',
        data: category?.average_visit_time?.map(item => item.visit_count) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  }

  const barChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Tashrif chastotasi',
      },
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Tashriflar soni',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Sana',
        },
      },
    },
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Kategoriya ma&apos;lumotlari</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Kategoriyani tahrirlash</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleSave)}>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="name_uz">Nomi (O&apos;zbek)</Label>
                  <Input id="name_uz" {...register('name_uz', { required: true })} />
                </div>
                <div>
                  <Label htmlFor="name_ru">Nomi (Rus)</Label>
                  <Input id="name_ru" {...register('name_ru', { required: true })} />
                </div>
                <div className="flex items-center space-x-2">
                  <Controller
                    name="active"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="active"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
                <Button type="submit">Saqlash</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tashrif chastotasi</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {category?.visits && <Bar options={barChartOptions} data={barChartData} />}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2 mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eng ko&apos;p sotilgan mahsulotlar ulushi</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Pie data={pieChartData} />
            </div>
            <ul className="mt-4">
              {category?.products?.map((product, index) => (
                <li key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    {product.image && (
                      <Image
                        src={(product.image as IFile).file}
                        alt={product.name_uz}
                        width={50}
                        height={50}
                        className="w-8 h-8 mr-2"
                      />
                    )}
                    <span>{product.name_uz}</span>
                  </div>
                  <span>{splitToHundreds(product.price)} so&apos;m</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ohirgi yetti kunda eng ko&apos;p tashriflar vaqtlari</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {category?.average_visit_time && <Bar options={barChartOptions} data={barChartDataTime} />}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
export default function Page() {
  const [activeTab, setActiveTab] = useState("category-info");
  const categoryId = getCategoryIdFromUrl();

  const { data: category } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => {
      if (categoryId !== null) {
        return fetchCategoryData(categoryId);
      }
      return Promise.reject(new Error('Kategoriya ID null'));
    },
    enabled: categoryId !== null,
  });

  // If the category is not of type "PRODUCT", show the page without tabs.
  if (category && category.content_type !== "PRODUCT") {
    return (
      <Layout page="categories">
        <CategoryInfo category={category} />
      </Layout>
    );
  }

  // If the category is of type "PRODUCT", show the tabs as before.
  return (
    <Layout page="categories">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="category-info">Kategoriya ma&apos;lumotlari</TabsTrigger>

          {category?.content_type === "PRODUCT" && (
            <TabsTrigger value="products-list">Mahsulotlar ro&apos;yxati</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="category-info">
          <CategoryInfo category={category} />
        </TabsContent>

        {category?.content_type === "PRODUCT" && (
          <TabsContent value="products-list">
            <Products category={category} />
          </TabsContent>
        )}
      </Tabs>
    </Layout>
  );
}
