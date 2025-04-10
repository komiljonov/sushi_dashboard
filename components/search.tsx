import { SearchIcon, X } from "lucide-react";
import React from "react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

const Search = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="flex gap-3 relative w-full">
      <SearchIcon className="w-5 h-5 absolute top-2 left-3 text-[#A3A3A3]" />
      <Input
        type="text"
        className=" !h-[36px] pl-10"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Qidirish..."
      />
      {search && <Button
        size={"icon"}
        variant={"ghost"}
        className="absolute right-1 h-[32px] top-[2px]"
        onClick={() => setSearch("")}
      >
        <X className="w-4 h-4" />
      </Button>}
    </div>
  );
};

export default Search;
