// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Button } from "@/components/ui/Button";
// import { useToast } from "@/hooks/use-toast";
// import PostsTable from "@/components/posts/posts-table";
// import PostFormModal from "@/components/posts/post-form-modal";
// import PostDeleteModal from "@/components/posts/post-delete";

// export default function PostsPage() {
//   const queryClient = useQueryClient();
//   const [modalOpen, setModalOpen] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [selectedPost, setSelectedPost] = useState<Post | null>(null);

//   const { toast } = useToast();

//   const { data: posts = [], isLoading } = useQuery<Post[]>({
//     queryKey: ["posts"],
//     queryFn: fetchPosts,
//   });

//   const create = useMutation({
//     mutationFn: createPost,
//     onSuccess: () => {
//       toast({ title: "Yaratildi" });
//       queryClient.invalidateQueries({ queryKey: ["posts"] });
//       setModalOpen(false);
//     },
//   });

//   const update = useMutation({
//     mutationFn: updatePost,
//     onSuccess: () => {
//       toast({ title: "Tahrirlandi" });
//       queryClient.invalidateQueries({ queryKey: ["posts"] });
//       setModalOpen(false);
//     },
//   });

//   const remove = useMutation({
//     mutationFn: selectedPost,
//     onSuccess: () => {
//       toast({ title: "O‘chirildi" });
//       queryClient.invalidateQueries({ queryKey: ["posts"] });
//       setDeleteOpen(false);
//     },
//   });

//   const handleSubmit = (formData: FormData) => {
//     if (selectedPost) {
//       update.mutate({ id: selectedPost.id, formData });
//     } else {
//       create.mutate(formData);
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between mb-4">
//         <h1 className="text-xl font-bold">Postlar</h1>
//         <Button
//           onClick={() => {
//             setSelectedPost(null);
//             setModalOpen(true);
//           }}
//         >
//           + Post
//         </Button>
//       </div>

//       {isLoading ? (
//         <p>Yuklanmoqda...</p>
//       ) : (
//         <PostsTable
//           posts={posts}
//           onEdit={(post) => {
//             setSelectedPost(post);
//             setModalOpen(true);
//           }}
//           onDelete={(post) => {
//             setSelectedPost(post);
//             setDeleteOpen(true);
//           }}
//         />
//       )}

//       <PostFormModal
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         initialData={selectedPost}
//         onSubmit={handleSubmit}
//         loading={create.isPending || update.isPending}
//       />

//       <PostDeleteModal
//         open={deleteOpen}
//         onClose={() => setDeleteOpen(false)}
//         post={selectedPost}
//         onConfirm={() => selectedPost && remove.mutate(selectedPost?.id)}
//         loading={remove.isPending}
//       />
//     </div>
//   );
// }
// function updatePost(variables: void): Promise<unknown> {
//     console.log(variables);
//     throw new Error("Function not implemented.");
// }

// function createPost(variables: void): Promise<unknown> {
//     console.log(variables);
    
//     throw new Error("Function not implemented.");
// }

// interface Post {
//   id: number;
//   title: string;
// }

// function fetchPosts(): Promise<Post[]> {
//   return fetch("/api/posts").then((res) => res.json());
// }

import React from 'react'

const index = () => {
  return (
    <div>
      
    </div>
  )
}

export default index
