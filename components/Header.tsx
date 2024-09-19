"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bell, User, ChevronRight, ChevronLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/context/Auth";
import { request } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";


interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function Header({ collapsed, setCollapsed }: HeaderProps) {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const { userInfo, logout } = useAuth();
  const { toast } = useToast();

  const changePasswordMutation = useMutation({
    mutationFn: async ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) => {
      const { data } = await request.post("auth/change_password", {
        "old_password": oldPassword,
        "new_password": newPassword
      });
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      setIsChangePasswordOpen(false);
      toast({
        title: "Password changed",
        description: "Parol o'zgartirildi."
      });
    }
  });

  const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPasswordError("")
    const formData = new FormData(e.currentTarget)
    const oldPassword = formData.get("oldPassword") as string
    const newPassword = formData.get("newPassword") as string
    const repeatNewPassword = formData.get("repeatNewPassword") as string

    if (newPassword !== repeatNewPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    changePasswordMutation.mutate({ oldPassword, newPassword })
  }

  const handleLogout = () => {
    console.log("Logging out...")
    logout();
    // Implement logout logic here
  }

  return (
    <header className="bg-background border-b h-16 flex items-center justify-between px-4">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="mr-4"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
        <h1 className="text-xl font-semibold">Boshqaruv</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="User menu">
              <User className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="space-y-4">
              <p className="font-semibold">{userInfo?.name}</p>
              <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">Parolni almashtirish</Button>
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle>Parolni almashtirish</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="oldPassword">Hozirgi parol</Label>
                      <Input id="oldPassword" name="oldPassword" type="password" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Yangi parol</Label>
                      <Input id="newPassword" name="newPassword" type="password" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="repeatNewPassword">yangi parolni takrorlang</Label>
                      <Input id="repeatNewPassword" name="repeatNewPassword" type="password" required />
                    </div>
                    {passwordError && (
                      <p className="text-red-600 text-sm">{passwordError}</p>
                    )}
                    <Button type="submit" disabled={changePasswordMutation.isPending}>
                      {changePasswordMutation.isPending ? "Kuting..." : "O'zgartirish"}
                    </Button>
                  </form>
                  {changePasswordMutation.isSuccess && (
                    <p className="text-green-600">Parol yangilandi.</p>
                  )}
                  {changePasswordMutation.isError && (
                    <p className="text-red-600">Parolni o&apos;zgartirishda hatolik. Iltimos qaytadan urinib ko&apos;ring.</p>
                  )}
                </DialogContent>
              </Dialog>
              <Button variant="outline" className="w-full" onClick={handleLogout}>
                Chiqish
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}