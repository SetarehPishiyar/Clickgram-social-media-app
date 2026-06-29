import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DislikeIcon, LikeIcon } from "../constants/icons";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase-client";

interface Vote {
  id: number;
  user_id: string;
  post_id: number;
  vote: number;
}

const vote = async (voteValue: number, postId: number, userId: string) => {
  const { data: existingVote, error: ExistingVoteError } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (ExistingVoteError) throw new Error(ExistingVoteError.message);

  if (existingVote) {
    if (existingVote.vote === voteValue) {
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("id", existingVote.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from("votes")
        .update({ vote: voteValue })
        .eq("id", existingVote.id);
      if (error) throw new Error(error.message);
    }
  } else {
    const { error } = await supabase.from("votes").insert({
      user_id: userId,
      post_id: postId,
      vote: voteValue,
    });
    if (error) throw new Error(error.message);
  }
};

const fetchVotes = async (postId: number): Promise<Vote[]> => {
  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId);

  if (error) throw new Error(error.message);

  return data as Vote[];
};

const LikeButton = ({ postId }: { postId: number }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["like", postId],
    mutationFn: (voteValue: number) => {
      if (!user) {
        alert("User must be logged in to like a post");
        throw new Error("User must be logged in to like a post");
      }

      return vote(voteValue, postId, user?.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["votes", postId],
      });
    },
  });

  const {
    data: votes,
    isLoading,
    error: VotesError,
  } = useQuery<Vote[], Error>({
    queryKey: ["votes", postId],
    queryFn: () => fetchVotes(postId),
  });

  const userVote = votes?.find((v) => v.user_id === user?.id)?.vote;
  if (VotesError) throw new Error(VotesError.message);
  if (isLoading) return <div>Loading Votes...</div>;

  const likes = votes?.filter((vote) => vote.vote === 1).length ?? 0;
  const dislikes = votes?.filter((vote) => vote.vote === 0).length ?? 0;

  return (
    <div className="flex gap-2">
      <button
        onClick={() => mutate(1)}
        className="flex gap-2 items-center justify-center"
      >
        <LikeIcon size={20} color={userVote === 1 ? "#83f7d6" : "#ffffff"} />
        <span>{likes}</span>
      </button>

      <button
        onClick={() => mutate(0)}
        className="flex gap-2 items-center justify-center"
      >
        <DislikeIcon size={20} color={userVote === 0 ? "#f7838f" : "#ffffff"} />
        <span>{dislikes}</span>
      </button>
    </div>
  );
};

export default LikeButton;
