import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight } from "lucide-react";

export interface Post {
  id: number;
  title: string;
  text: string;
}

const posts: Post[] = [
  { id: 1, title: "Post 1", text: "Matni 1" },
  { id: 2, title: "Post 2", text: "Matni 2" },
  { id: 3, title: "Post 3", text: "Matni 3" },
];

export default function PostsTable() {
  return (
    <Card className="mt-4 !shadow-none border-none">
      <CardContent className="p-4">     
        <Table>
          <TableHeader>
            <TableRow className=" border-none">
              <TableHead className="w-[50px] rounded-l-lg bg-[#F5F5F5] hover:bg-[#F5F5F5]">
                T/r
              </TableHead>
              <TableHead className="bg-[#F5F5F5] hover:bg-[#F5F5F5]">
                Post sarlavhasi
              </TableHead>
              <TableHead className="bg-[#F5F5F5] hover:bg-[#F5F5F5]">
                Post matni
              </TableHead>
              <TableHead className="bg-[#F5F5F5] hover:bg-[#F5F5F5]">
                Post fayli
              </TableHead>
              <TableHead className="bg-[#F5F5F5] hover:bg-[#F5F5F5] rounded-r-lg"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow
                key={post.id}
                className="group hover:border-transparent border-b-gray-100"
              >
                <TableCell className="rounded-l-lg group-hover:bg-[#F5F5F5]">
                  {post.id}
                </TableCell>
                <TableCell className="group-hover:bg-[#F5F5F5]">
                  {post.title}
                </TableCell>
                <TableCell className="group-hover:bg-[#F5F5F5]">
                  {post.text}
                </TableCell>
                <TableCell className="group-hover:bg-[#F5F5F5] text-[#038AFF]">
                  <div className="flex items-center justify-start">
                    PostFile.png
                    <ArrowUpRight className="ml-2 w-4 h-4" />
                  </div>
                </TableCell>
                <TableCell className="rounded-r-lg group-hover:bg-[#F5F5F5]">
                  <div className="flex items-center justify-end">
                    <Button className="hover:bg-green-500 bg-[#1AD012] rounded-[10px] text-white">
                      Yuborish
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
