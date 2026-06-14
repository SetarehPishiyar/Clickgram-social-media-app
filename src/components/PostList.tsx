import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import PostItem from "./PostItem";

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  imageUrl: string;
  avatar_url: string | null;
}

const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Post[];
};

const PostList = () => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading)
    return (
      <div className="rounded-3xl border border-white/10 p-8 text-center text-slate-300">
        Loading Posts...
      </div>
    );

  if (error)
    return (
      <div className="rounded-3xl border border-red-500/20 p-8 text-center text-red-400">
        Error: {error.message}
      </div>
    );

  if (data?.length === 0)
    return (
      <div className="rounded-3xl border border-white/10 p-8 text-center text-slate-300">
        No Posts Yet...
      </div>
    );

  console.log(data);
  return (
    <div className="mx-auto grid max-w-7xl gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
      {data?.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostList;
