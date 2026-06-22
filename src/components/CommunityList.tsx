import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { Link } from "react-router";

export interface Community {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export const fetchCommunities = async (): Promise<Community[]> => {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as Community[];
};

const CommunityList = () => {
  const { data, isLoading, isError, error } = useQuery<Community[], Error>({
    queryFn: fetchCommunities,
    queryKey: ["communities"],
  });
  return (
    <div className="mx-auto max-w-4xl pt-24 px-4">
      {isLoading && (
        <div className="text-center text-slate-400">Loading Communities...</div>
      )}

      {isError && (
        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-400">
          Error: {error.message}
        </div>
      )}

      <div className="space-y-5">
        {data?.map((community) => (
          <Link
            key={community.id}
            to={`/communities/${community.id}`}
            className="block rounded-3xl border border-slate-700 bg-slate-950 p-6 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/40 hover:bg-slate/10 hover:scale-102"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-purple-300">
                  {community.name}
                </h2>

                <p className="mt-3 text-slate-300 leading-relaxed">
                  {community.description}
                </p>
              </div>

              <div className="rounded-full bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
                Community
              </div>
            </div>

            <div className="mt-6 border-t border-white/10 pt-4">
              <p className="text-sm text-slate-500">
                Created {new Date(community.created_at).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CommunityList;
