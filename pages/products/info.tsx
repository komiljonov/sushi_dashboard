import { Layout } from "@/components/Layout";
import { useEffect, useState } from "react";

import { Bar, Pie } from 'react-chartjs-2';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, Users, TrendingUp } from 'lucide-react';

import { request } from '@/lib/api';
import { ICategory, ICategoryWithStats } from "@/lib/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { queryClient } from "@/lib/query";
import { useToast } from "@/hooks/use-toast";

// import { setSourceMapsEnabled } from "process";


function getRandomNumber(start: number, end: number): number {
    return Math.floor(Math.random() * (end - start + 1)) + start;
}


ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)


const getCategoryIdFromUrl = (): string | null => {
    if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        const queryParams = new URLSearchParams(url.search);
        const id = queryParams.get('id');
        return id;
    }
    return null;
};


const fetchCategoryData = async (id: string): Promise<ICategoryWithStats> => {
    const { data } = await request.get(`categories/${id}/stats`);
    return data;
}



const editCategory = async (id: string, edit_data: ICategory): Promise<ICategory> => {
    const { data } = await request.patch(`categories/${id}`, edit_data);

    return data;
}

function CategoryInfo() {

    const { toast } = useToast();


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [categoryId] = useState(getCategoryIdFromUrl);

    const { register, reset, handleSubmit } = useForm<ICategory>();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: category, isSuccess } = useQuery({
        queryKey: ['category', categoryId],
        queryFn: () => {
            if (categoryId !== null) {
                return fetchCategoryData(categoryId);
            }
            // Handle the case where categoryId is null
            return Promise.reject(new Error('Category ID is null'));
        },
        enabled: categoryId !== null,
    });


    useEffect(() => {
        if (isSuccess) {
            reset({
                name_uz: category?.name_uz,
                name_ru: category?.name_ru
            });
        }

    }, [isSuccess, reset, category]);



    const mutation = useMutation({
        mutationFn: (data: ICategory) => {
            if (categoryId !== null) {
                return editCategory(categoryId, data)
            }
            return Promise.reject(new Error('Category ID is null'));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['category', categoryId] });
            reset();
            toast({
                title: 'Saqlandi'
            })
            
        },
        onError: (error) => {
            console.log('Error creating category:', error);
        }
    });

    const handleSave = (data: ICategory) => {
        mutation.mutate(data);
    }

    const visitCounts = 15000
    const visitFrequency = [
        { date: '2023-06-01', visits: 500 },
        { date: '2023-06-02', visits: 600 },
        { date: '2023-06-03', visits: 550 },
        { date: '2023-06-04', visits: 700 },
        { date: '2023-06-05', visits: 800 },
    ]

    const pieChartData = {
        labels: category?.most_sold_products?.map(product => product.name_uz),
        datasets: [
            {
                data: category?.most_sold_products?.map(() => getRandomNumber(100, 200)),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                    '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'
                ],
            },
        ],
    }

    const barChartData = {
        labels: visitFrequency.map(item => item.date),
        datasets: [
            {
                label: 'Visit Frequency',
                data: visitFrequency.map(item => item.visits),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    }

    const barChartOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Visit Frequency',
            },
        },
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Category Info</h1>

            <form className="mb-8" onSubmit={handleSubmit(handleSave)}>
                <div className="grid gap-4">
                    <div>
                        <Label htmlFor="name_uz">Name (Uzbek)</Label>
                        <Input id="name_uz"  {...register('name_uz', { required: true })} />
                    </div>
                    <div>
                        <Label htmlFor="name_ru">Name (Russian)</Label>
                        <Input id="name_ru" {...register('name_uz', { required: true })} />
                    </div>
                    <Button type="submit">Save</Button>
                </div>
            </form>

            <div className="grid gap-2 md:grid-cols-1 lg:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Products Sales Share</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <Pie data={pieChartData} />
                        </div>
                        <ul className="mt-4">
                            {category?.most_sold_products?.map((product, index) => (
                                <li key={index} className="flex items-center justify-between py-2">
                                    <div className="flex items-center">
                                        <Image src={product.image} alt={product.name_uz} width={50} height={50} className="w-8 h-8 mr-2" />
                                        <span>{product.name_uz}</span>
                                    </div>
                                    <span>${product.price.toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Visit Counts</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{visitCounts.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Total visits</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Visit Frequency</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px]">
                            <Bar options={barChartOptions} data={barChartData} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}




export default function Page() {
    return <Layout page='categories'>
        <CategoryInfo />
    </Layout>
}