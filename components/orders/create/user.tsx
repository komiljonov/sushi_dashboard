"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { fetchPaginatedUsers } from "@/lib/fetchers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IUser } from "@/lib/types";
import { Controller, useFormContext } from "react-hook-form";
import { CreateOrderForm } from "./types";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Loader2, Plus } from "lucide-react";
import { createUser } from "@/lib/mutators";
import { Button } from "@/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PhoneInput from "@/components/helpers/phone-input";

export default function UserSelect() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [listStatus, setListStatus] = useState(false);
  const [status, setStatus] = useState(true);
  const pageRef = useRef(1);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const queryClient = useQueryClient();

  const {
    setValue,
    control,
    formState: { errors },
    watch,
  } = useFormContext<CreateOrderForm>();

  const phone = watch("phone");

  useEffect(() => {
    const fetchFirstPage = async () => {
      setIsFetching(true);
      pageRef.current = 1;
      const data = await fetchPaginatedUsers(1, searchValue || "");
      setUsers(data?.results || []);
      setHasNextPage(Boolean(data?.next));
      setIsFetching(false);
    };

    fetchFirstPage();
  }, [searchValue, phone]);

  const loadMoreUsers = useCallback(async () => {
    if (!hasNextPage || isFetching) return;

    setIsFetching(true);
    const nextPage = pageRef.current + 1;

    try {
      const nextData = await queryClient.fetchQuery({
        queryKey: ["users-pg", nextPage, searchValue, phone],
        queryFn: () => fetchPaginatedUsers(nextPage, searchValue || ""),
      });

      if (nextData?.results) {
        setUsers((prev) => [...prev, ...nextData.results]);
        pageRef.current = nextPage;
        setHasNextPage(Boolean(nextData.next));
      }
    } catch (error) {
      console.error("Error fetching next page:", error);
    } finally {
      setIsFetching(false);
    }
  }, [hasNextPage, isFetching, queryClient, searchValue, phone]);

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

    if (
      container.scrollHeight <= container.clientHeight + 5 &&
      hasNextPage &&
      !isFetching
    ) {
      loadMoreUsers();
    }

    return () => container.removeEventListener("scroll", handleScroll);
  }, [listStatus, hasNextPage, isFetching, loadMoreUsers]);

  const { mutate } = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users-pg"] });
      setValue("user", data.id);
      setSearchValue(data.name);
      setStatus(false);
    },
  });

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2 relative w-full flex justify-center items-start">
        <div className="space-y-2 w-full">
          <Label htmlFor="user">Foydalanuvchi</Label>
          <Input
            ref={inputRef}
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
        </div>

        {listStatus && (
          <div
            ref={listRef}
            className="border p-2 rounded w-full absolute bg-white top-[70px] z-20 max-h-64 overflow-y-auto"
            onMouseDown={(e) => e.preventDefault()}
          >
            {users.map((user, index) => (
              <div
                key={index}
                className="p-2 border-b cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setValue("user", user.id);
                  setValue("phone", user.number);
                  setListStatus(false);
                  setSearchValue(user.name);
                  inputRef.current?.blur();
                }}
              >
                {user.name} ({user.number})
              </div>
            ))}
            {isFetching && (
              <div className="w-full flex justify-center">
                <Loader2 className="animate-spin" />
              </div>
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
              <PhoneInput
                {...field}
                placeholder="Telefon raqamni kiriting"
              />
            )}
          />
          {users?.length === 0 && status && (
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    className="absolute right-1 top-1"
                    onClick={() => {
                      if (users.length === 0) {
                        mutate({
                          name: searchValue || "Call center orqali",
                          number: phone,
                        });
                      }
                    }}
                  >
                    <Plus />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Foydalanuvchini yaratish</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
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
