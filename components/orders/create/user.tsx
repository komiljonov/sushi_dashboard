"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { fetchPaginatedUsers } from "@/lib/fetchers";
import { useQueryClient } from "@tanstack/react-query";
import { IUser } from "@/lib/types";
import { useFormContext } from "react-hook-form";
import { CreateOrderForm } from "./types";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Loader2 } from "lucide-react";

export default function UserSelect() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [listStatus, setListStatus] = useState(false);
    const [selectedUser, setSelectedUser] = useState<string>("");
  const pageRef = useRef(1);
  const listRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  // 1️⃣ Faqat birinchi sahifani fetch qiladi
  useEffect(() => {
    const fetchFirstPage = async () => {
      setIsFetching(true);
      pageRef.current = 1;
      const data = await fetchPaginatedUsers(1, searchValue);
      setUsers(data?.results || []);
      setHasNextPage(!!data?.next);
      setIsFetching(false);
    };

    fetchFirstPage();
  }, [searchValue]);

  // 2️⃣ Yangi sahifa yuklash funksiyasi
  const loadMoreUsers = useCallback(async () => {
    if (!hasNextPage || isFetching) return;

    setIsFetching(true);
    const nextPage = pageRef.current + 1;

    try {
      const nextData = await queryClient.fetchQuery({
        queryKey: ["users-pg", nextPage, searchValue],
        queryFn: () => fetchPaginatedUsers(nextPage, searchValue),
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
  }, [hasNextPage, isFetching, queryClient, searchValue]);

  // 3️⃣ Scroll event orqali yuklash
  useEffect(() => {
    const container = listRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isBottom =
        container.scrollTop + container.clientHeight >= container.scrollHeight - 5;

      if (isBottom && hasNextPage && !isFetching) {
        loadMoreUsers();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetching, searchValue, loadMoreUsers]);

  const { setValue } = useFormContext<CreateOrderForm>();

  return (
    <div className="space-y-2 relative w-full flex justify-center items-start">
      <div className="space-y-2 w-full">
        <Label htmlFor="user">Foydalanuvchi</Label>
        {listStatus ? <Input
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
        /> :
        <Input
          type="text"
          placeholder="Foydalanuvchilarni qidirish..."
          value={selectedUser}
          className="input"
          onClick={() => {
            // setValue('user', "");
            // setValue('phone', "");
            setListStatus(true)}}
          readOnly
        />}
      </div>

      {listStatus && (
        <div
          ref={listRef}
          className="border p-2 rounded w-full absolute bg-white top-[70px] z-20 max-h-64 overflow-y-auto"
          onMouseDown={(e) => e.preventDefault()} // 🟢 `onBlur` ni oldini olish
        >
          { isFetching ? (
            <div className="w-full flex justify-center">
            <Loader2 className="animate-spin" /></div>
          ) : (
            users.map((user, index) => (
              <div
                key={index}
                className="p-2 border-b cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setValue("user", user.id);
                  setValue('phone', user.number);
                  setSelectedUser(user.name);
                  setListStatus(false);
                  setSearchValue("");
                }}
              >
                {user.name} ({user.number})
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
