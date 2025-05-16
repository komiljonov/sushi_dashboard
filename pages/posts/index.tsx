import { Layout } from "@/components/Layout";
import { PostForm } from "@/components/posts/post-form-modal";
import PostsTable from "@/components/posts/posts-table";
import { useCrumb } from "@/lib/context/crumb-provider";
import React, { useEffect } from "react";

const Posts = () => {
  const { setCrumb } = useCrumb();

  useEffect(() => {
    setCrumb([{ label: "Postlar", path: "/posts" }]);
  }, [setCrumb]);
  return (
    <Layout page="posts">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Postlar</h1>
        <PostForm />
      </div>
      <PostsTable />
    </Layout>
  );
};

export default Posts;
