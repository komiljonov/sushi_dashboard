'use client';

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useAuth } from "@/lib/context/Auth";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/use-toast";
import SushiImage from "@/public/images/sushi.svg"
import Logo from "@/public/images/logo2.svg"
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useEffect } from "react";
import { useLoading } from "@/lib/context/Loading";
import Image from "next/image";
import User from "@/public/images/user.svg"
import Lock from "@/public/images/lock.svg"
import PasswordInput from "@/components/password-input";



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



    const { register, handleSubmit, formState: { errors }, control } = useForm<IFormInput>();


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
                title: "Kirishda xatolik",
                description: "Username yoki parol noto'g'ri."
            });
        }
    }

    return (isAuthenticated == null || isAuthenticated) ? null : (
        <div className="flex items-center justify-center min-h-screen bg-[#FF2735] relative">
            <Image src={SushiImage} alt="Sushi" className="absolute -top-8 right-0 object-cover w-[600px] h-[600px]" />
            <Card className="w-full max-w-[400px] relative z-20 rounded-3xl">
                <CardHeader className="mt-4">
                    <Image src={Logo} alt="Logo" width={64} height={64} className="mx-auto" />
                    <CardTitle className="text-2xl font-bold text-center mt-4">Sushi Yummy</CardTitle>
                </CardHeader>
                <CardContent className="mt-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2 relative">
                            <Label htmlFor="username">Foydalanuvchi nomi</Label>
                            <Input
                            className="h-[48px] rounded-lg bg-[#FAFAFA] !border-[#E5E5E5] pl-12"
                                id="username"
                                {...register('username', { required: true })}
                                placeholder="Foydalanuvchi nomini kiriting"
                            />
                            <Image src={User} alt="User" width={16} height={16} className="absolute bottom-3 left-3" />
                            {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
                        </div>
                        <div className="space-y-2 relative">
                            <Label htmlFor="password">Parol</Label>
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <PasswordInput style={{ paddingLeft: 48}} placeholder="Parolni kiriting" id="password" {...field} />
                                )}
                                />
                            <Image src={Lock} alt="Lock" width={18} height={18} className="absolute bottom-3 left-3" />
                            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                        </div>
                        <Button type="submit" className="w-full h-[48px] rounded-[10px] bg-black text-white hover:bg-gray-800">
                            Kirish
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
};


LoginPage.authRequired = false;

export default LoginPage;