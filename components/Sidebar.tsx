import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { Users, LogOut, Box, Home, Ticket, FingerprintIcon, ShoppingCartIcon, MapPin, CreditCard, LinkIcon } from "lucide-react"
import { useAuth } from '@/lib/context/Auth'
import { useRouter } from 'next/router'

interface SidebarProps {
    collapsed: boolean;
    page: string;
}

export function Sidebar({ collapsed, page }: SidebarProps) {
    const { push } = useRouter();
    const { logout } = useAuth();

    // collapsed = true;

    const handleLogout = () => {
        // Implement logout logic here
        console.log('Logout clicked');
        logout();
        push('/login');
    }

    return (
        <aside className={cn(
            "bg-white text-black border-r border-gray-200 transition-all duration-300 ease-in-out", // Ensured light mode adaptation
            collapsed ? "w-16" : "w-64"
        )}>
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4">
                    <div className={cn(
                        "flex items-center",
                        collapsed ? "justify-center w-full" : "justify-start"
                    )}>
                        <Link href={"/"}>
                            <Image
                                src="/images/logo.webp"
                                alt="Company Logo"
                                width={collapsed ? 32 : 40}
                                height={collapsed ? 32 : 40}
                                className="rounded-full" />
                        </Link>
                        {!collapsed && <h2 className="text-lg font-semibold ml-2 overflow-clip">Sushi Yummy</h2>}
                    </div>
                </div>
                <nav className="flex flex-col gap-2 p-2">
                    <NavItem href="/" icon={<Home className="h-4 w-4" />} label="Bosh menu" collapsed={collapsed} isSelected={page == 'home'} />
                    <NavItem href="/admins" icon={<FingerprintIcon className="h-4 w-4" />} label="Hodimlar" collapsed={collapsed} isSelected={page == 'admins'} />
                    <NavItem href="/categories" icon={<Box className="h-4 w-4" />} label="Kategoriyalar" collapsed={collapsed} isSelected={page == 'categories'} />
                    <NavItem href="/promocodes" icon={<Ticket className="h-4 w-4" />} label="Promocodelar" collapsed={collapsed} isSelected={page == 'promocodes'} />
                    <NavItem href="/users" icon={<Users className="h-4 w-4" />} label="Foydalanuvchilar" collapsed={collapsed} isSelected={page == 'users'} />
                    <NavItem href="/orders" icon={<ShoppingCartIcon className="h-4 w-4" />} label="Buyurtmalar" collapsed={collapsed} isSelected={page == 'orders'} />
                    <NavItem href="/filials" icon={<MapPin className="h-4 w-4" />} label="Filiallar" collapsed={collapsed} isSelected={page == 'filials'} />
                    <NavItem href="/payments" icon={<CreditCard className="h-4 w-4" />} label="To'lovlar" collapsed={collapsed} isSelected={page == 'payments'} />
                    <NavItem href="/referrals" icon={<LinkIcon className="h-4 w-4" />} label="Referrals" collapsed={collapsed} isSelected={page == 'referrals'} />
                </nav>
                <div className="p-2 mt-auto">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start",
                            collapsed ? "px-2" : "px-4"
                        )}
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4" />
                        {!collapsed && <span className="ml-2">Chiqish</span>}
                    </Button>
                </div>
            </div>
        </aside>
    )
}

interface NavItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    collapsed: boolean;
    isSelected: boolean;
}

export function NavItem({ href, icon, label, collapsed, isSelected }: NavItemProps) {
    return (
        <Link href={href} as={href}>
            <Button
                variant={isSelected ? "secondary" : "ghost"}
                className={cn(
                    "w-full justify-start",
                    collapsed ? "px-2" : "px-4",
                    isSelected && "bg-secondary"
                )}
            >
                <span className={cn(
                    "flex items-center",
                    isSelected && "text-secondary-foreground"
                )}>
                    {icon}
                    {!collapsed && (<span className="ml-2">{label}</span>)}
                </span>
            </Button>
        </Link>
    )
}
