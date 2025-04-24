import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/context/Auth";
import { useRouter } from "next/router";
import {
  Categories,
  CategoriesActive,
  Home,
  HomeActive,
  Logo,
  Orders,
  OrdersActive,
  Payments,
  PaymentsActive,
  Promocodes,
  PromocodesActive,
  Referrals,
  ReferralsActive,
  Users,
  UsersActive,
} from "@/lib/icons";
import { LogOut } from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  collapsed: boolean;
  page: string;
}

const menuItems = [
  {
    name: "Hisobotlar",
    href: "/",
    iconActive: HomeActive,
    icon: Home,
    page: "home",
  },
  {
    name: "Xodimlar",
    href: "/admins",
    iconActive: UsersActive,
    icon: Users,
    page: "admins",
  },
  {
    name: "Kategoriyalar",
    href: "/categories",
    iconActive: CategoriesActive,
    icon: Categories,
    page: "categories",
  },
  {
    name: "Promokodlar",
    href: "/promocodes",
    iconActive: PromocodesActive,
    icon: Promocodes,
    page: "promocodes",
  },
  {
    name: "Foydalanuvchilar",
    href: "/users",
    iconActive: UsersActive,
    icon: Users,
    page: "users",
  },
  {
    name: "Buyurtmalar",
    href: "/orders",
    iconActive: OrdersActive,
    icon: Orders,
    page: "orders",
  },
  {
    name: "To'lovlar",
    href: "/payments",
    iconActive: PaymentsActive,
    icon: Payments,
    page: "payments",
  },
  {
    name: "Referallar",
    href: "/referrals",
    iconActive: ReferralsActive,
    icon: Referrals,
    page: "referrals",
  },
];

export function Sidebar({ collapsed, page }: SidebarProps) {
  const { push } = useRouter();
  const { logout } = useAuth();

  // collapsed = true;

  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logout clicked");
    logout();
    push("/login");
  };

  return (
    <aside
      className={cn(
        "bg-white text-black border-r border-gray-200 transition-all duration-300 ease-in-out fixed top-0 h-screen", // Ensured light mode adaptation
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4">
          <div
            className={cn(
              "flex items-center",
              collapsed ? "justify-center w-full" : "justify-start"
            )}
          >
            <Link href={"/"}>
              <Image
                src={Logo}
                alt="Company Logo"
                width={collapsed ? 32 : 48}
                height={collapsed ? 32 : 48}
                className="rounded-full"
              />
            </Link>
            {!collapsed && (
              <h2 className="text-2xl font-bold ml-5 overflow-clip">
                Sushi Yummy
              </h2>
            )}
          </div>
        </div>
        <div className="flex flex-col relative">
          {menuItems.map((item) => (
            <NavItem
              key={item.name}
              href={item.href}
              icon={
                <Image
                  src={item.icon}
                  alt={item.name}
                  width={collapsed ? 20 : 24}
                  height={collapsed ? 32 : 48}
                />
              }
              activeIcon={
                <Image
                  src={item.iconActive}
                  alt={item.name}
                  width={collapsed ? 20 : 24}
                  height={collapsed ? 32 : 48}
                />
              }
              label={item.name}
              collapsed={collapsed}
              isSelected={item.page === page}
            />
          ))}
        </div>
        <div className={`${collapsed ? "" : "p-2"}  h-full flex items-end`}>
          {collapsed ? (
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full hover:text-red-500",
                      collapsed ? "px-4" : "px-4 justify-start"
                    )}
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    {!collapsed && <span className="ml-2">Chiqish</span>}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-sm">
                  Chiqish
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button
              variant="ghost"
              className={cn(
                "w-full hover:text-red-500",
                collapsed ? "px-4" : "px-4 justify-start"
              )}
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span className="ml-2">Chiqish</span>}
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  label: string;
  collapsed: boolean;
  isSelected: boolean;
}

export function NavItem({
  href,
  icon,
  label,
  collapsed,
  isSelected,
  activeIcon,
}: NavItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const button = (
    <Button
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className={cn(
        "w-full !rounded-none ease-linear duration-200 shadow-none hover:bg-[#FFF0F1] hover:text-[#FF2735] hover:border-l-[2.5px] border-[#FF2735] h-[56px] bg-white text-[#D6D6D6]",
        collapsed ? "px-4 justify-center" : "px-4 justify-start",
        (isSelected || isOpen) &&
          "bg-[#FFF0F1] border-l-[2.5px] border-[#FF2735]"
      )}
    >
      <span
        className={cn(
          "flex items-center gap-3",
          (isSelected || isOpen) && "text-[#FF2735]"
        )}
      >
        {isSelected || isOpen ? activeIcon : icon}
        {!collapsed && <span className="ml-2">{label}</span>}
      </span>
    </Button>
  );

  return (
    <Link href={href} as={href}>
      {collapsed ? (
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent side="right" className="text-sm">
              {label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        button
      )}
    </Link>
  );
}
