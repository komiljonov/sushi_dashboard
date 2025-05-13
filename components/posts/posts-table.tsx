import { Button } from "../ui/Button";

export interface Post {
  id: number;
  title: string;
}

interface Props {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
}

export default function PostsTable({ posts, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto border rounded-md mt-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left px-4 py-2">ID</th>
            <th className="text-left px-4 py-2">Sarlavha</th>
            <th className="text-left px-4 py-2">Amallar</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-b">
              <td className="px-4 py-2">{post.id}</td>
              <td className="px-4 py-2">{post.title}</td>
              <td className="px-4 py-2 space-x-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(post)}>
                  Tahrirlash
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(post)}>
                  O‘chirish
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
