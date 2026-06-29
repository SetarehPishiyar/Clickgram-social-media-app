import { useQuery } from "@tanstack/react-query";
import type { Post } from "./PostList";
import { supabase } from "../supabase-client";
import PostItem from "./PostItem";

const fetchPosts = async (communityId: number): Promise<Post[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("community_id", communityId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as Post[];
};

const CommunityDisplay = ({ communityId }: { communityId: number }) => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: () => fetchPosts(communityId),
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
  return (
    <div className="mx-auto mt-10 max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="md:text-3xl text-xl font-bold text-white">All Posts</h2>

        <div className="rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 md:text-sm text-xs text-purple-300">
          {data?.length} posts
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {data?.map((post) => (
          <div key={post.id}>
            <PostItem post={post} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityDisplay;
