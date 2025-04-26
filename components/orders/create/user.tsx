"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { fetchPaginatedUsers } from "@/lib/fetchers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IUser } from "@/lib/types";
import { Controller, useFormContext } from "react-hook-form";
import { CreateOrderForm } from "./types";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Loader2,  } from "lucide-react";
import { createUser } from "@/lib/mutators";

export default function UserSelect() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [listStatus, setListStatus] = useState(false);
  const pageRef = useRef(1);
  const listRef = useRef<HTMLDivElement | null>(null);

  const queryClient = useQueryClient();

  const {
    setValue,
    control,
    formState: { errors },
    watch,
  } = useFormContext<CreateOrderForm>();

  const phone = watch("phone");
  // const user = watch("user");

  // 1️⃣ Faqat birinchi sahifani fetch qiladi
  useEffect(() => {
    const fetchFirstPage = async () => {
      setIsFetching(true);
      pageRef.current = 1;
      const data = await fetchPaginatedUsers(
        1,
        (searchValue || phone) as string
      );
      setUsers(data?.results || []);
      setHasNextPage(!!data?.next);
      setIsFetching(false);
    };

    fetchFirstPage();
  }, [searchValue, phone]);

  // 2️⃣ Yangi sahifa yuklash funksiyasi
  const loadMoreUsers = useCallback(async () => {
    if (!hasNextPage || isFetching) return;

    setIsFetching(true);
    const nextPage = pageRef.current + 1;

    try {
      const nextData = await queryClient.fetchQuery({
        queryKey: ["users-pg", nextPage, searchValue, phone],
        queryFn: () =>
          fetchPaginatedUsers(nextPage, (searchValue || phone) as string),
      });

      if (nextData?.results) {
        setUsers((prev) => [...prev, ...nextData.results]);
        pageRef.current = nextPage; // Sahifani oshiramiz
        setHasNextPage(!!nextData.next);
      }
    } catch (error) {
      console.error("Error fetching next page:", error);
    }

    setIsFetching(false);
  }, [hasNextPage, isFetching, queryClient, searchValue, phone]);

  // 3️⃣ Scroll event orqali yuklash
  useEffect(() => {
    if (!listStatus) return;

    const container = listRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isBottom =
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 5;

      if (isBottom && hasNextPage && !isFetching) {
        loadMoreUsers();
      }
    };

    container.addEventListener("scroll", handleScroll);

    // Also immediately check if already near bottom (short list)
    if (
      container.scrollHeight <= container.clientHeight + 5 &&
      hasNextPage &&
      !isFetching
    ) {
      loadMoreUsers();
    }

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [listStatus, hasNextPage, isFetching, loadMoreUsers, users]);

  // const phone = watch("phone");

  // // Set searchValue only from phone
  // useEffect(() => {
  //   if (phone) setSearchValue(phone);
  // }, [phone]);

  // // Lookup user once users are updated
  // useEffect(() => {
  //   if (phone && users.length > 0) {
  //     const phone2 = phone?.slice(1);
  //     const user = users.find((user) => user.number === phone2);
  //     setValue("user", user ? user.id : null);
  //     if (user) setSelectedUser(user.name);
  //   }
  // }, [users, phone, setValue]);

  const { mutate } = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setValue("user", data.id);
      setSearchValue(data.name);
    },
  });

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2 relative w-full flex justify-center items-start">
        <div className="space-y-2 w-full">
          <Label htmlFor="user">Foydalanuvchi</Label>
          {/* {listStatus ? ( */}
          <Input
            type="text"
            placeholder="Foydalanuvchilarni qidirish..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full input"
            onFocus={() => setListStatus(true)}
            onBlur={() => {
              setTimeout(() => {
                if (!listRef.current?.contains(document.activeElement)) {
                  setListStatus(false);
                }
              }, 100);
            }}
          />
          {
          // !user && searchValue && (
          //   <span className="text-xs text-red-500">Foydalanuvchi tanlanmadi!</span>
          // )
        }
        </div>

        {listStatus && (
          <div
            ref={listRef}
            className="border p-2 rounded w-full absolute bg-white top-[70px] z-20 max-h-64 overflow-y-auto"
            onMouseDown={(e) => e.preventDefault()} // 🟢 `onBlur` ni oldini olish
          >
            {isFetching ? (
              <div className="w-full flex justify-center">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              users.map((user, index) => (
                <div
                  key={index}
                  className="p-2 border-b cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setValue("user", user.id);
                    setValue("phone", user.number);
                    setListStatus(false);
                    setSearchValue(user?.name);
                  }}
                >
                  {user.name} ({user.number})
                </div>
              ))
            )}
          </div>
        )}
        
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Telefon raqami</Label>
        <div className="relative">
          <Controller
            name="phone"
            control={control}
            rules={{ required: "Telefon raqamni kiritish majburiy." }}
            render={({ field }) => (
              <Input
                id="phone"
                {...field}
                className="input"
                placeholder="Telefon raqamni kiriting"
                onBlur={() => mutate({ name: searchValue, number: phone })}
              />
            )}
          />
        </div>
        {errors.phone && (
          <p className="text-sm text-red-500 mt-1">
            {errors.phone.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
