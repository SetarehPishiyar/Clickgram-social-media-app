import { useQuery } from "@tanstack/react-query";
import type { Post } from "./PostList";
import { supabase } from "../supabase-client";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";

const fetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);

  return data as Post;
};

const PostDetails = ({ postId }: { postId: number }) => {
  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });

  if (isLoading)
    return (
      <div className="rounded-3xl border border-white/10 p-8 text-center text-slate-300">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="rounded-3xl border border-red-500/20 p-8 text-center text-red-400">
        Error: {error.message}
      </div>
    );

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-sm">
      <h1 className="mb-6 text-4xl font-bold tracking-tight text-white">
        {data?.title}
      </h1>

      <img
        src={data?.imageUrl}
        alt={data?.title}
        className="mb-6 max-h-[500px] w-full rounded-2xl object-cover"
      />

      <p className="mb-6 whitespace-pre-wrap text-lg leading-8 text-slate-200">
        {data?.content}
      </p>

      <div className="border-t border-white/10 pt-4 flex justify-between">
        <span className="text-sm text-slate-400">
          Created at: {new Date(data!.created_at).toLocaleDateString()}
        </span>
        <LikeButton postId={postId} />
      </div>

      <CommentSection postId={postId} />
    </div>
  );
};

export default PostDetails;
