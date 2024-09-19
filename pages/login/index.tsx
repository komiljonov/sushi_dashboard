'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/context/Auth";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/use-toast";

import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect } from "react";
import { useLoading } from "@/lib/context/Loading";



interface IFormInput {
    username: string;
    password: string;
}

const LoginPage: React.FC & { authRequired?: boolean } = () => {

    const { authenticate, isAuthenticated } = useAuth();
    const { push } = useRouter();
    const { toast } = useToast();
    const { setLoading, setInfo } = useLoading();

    useEffect(() => {
        if (isAuthenticated) {
            push('/');

        }

    }, [isAuthenticated, push]);



    const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();


    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        setInfo({
            title: "Yuklanmoqda",
            description: "Iltimos biroz kuting."
        })
        setLoading(true);
        const res = await authenticate(data.username, data.password);

        if (res) {
            setLoading(false);
            push("/");
        } else {
            setLoading(false);
            toast({
                title: "Kirishda hatolik",
                description: "Username yoki parol noto'g'ri."
            });
        }
    }

    return (isAuthenticated == null || isAuthenticated) ? null : (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Kirish</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                {...register('username', { required: true })}
                                placeholder="Enter your username"
                            />
                            {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                {...register('password', { required: true })}
                            />
                            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                        </div>
                        <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
                            Login
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
};


LoginPage.authRequired = false;

export default LoginPage;