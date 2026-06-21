import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";

interface newCommentType {
  content: string;
  parent_comment_id?: number | null;
}

interface CommentType {
  id: number;
  post_id: number;
  content: string;
  created_at: string;
  user_id: string;
  author: string;
  parent_comment_id: number | null;
}

const createComment = async (
  newComment: newCommentType,
  postId: number,
  userId?: string,
  author?: string,
) => {
  if (!userId || !author)
    throw new Error("User must be logged in to post a comment");

  const { data, error } = await supabase.from("comments").insert({
    content: newComment.content,
    post_id: postId,
    user_id: userId,
    author,
    parent_comment_id: newComment.parent_comment_id,
  });

  if (error) throw new Error(error.message);

  return data;
};

const fetchComments = async (postId: number) => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as CommentType[];
};

const CommentSection = ({ postId }: { postId: number }) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (newComment: newCommentType) =>
      createComment(
        newComment,
        postId,
        user?.id,
        user?.user_metadata?.user_name,
      ),
    onSuccess: () => {
      setNewComment("");
      setReplyTo(null);
    },
  });

  const {
    data: comments,
    error: CommentsError,
    isLoading: isLoadingComments,
  } = useQuery<CommentType[], Error>({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    refetchInterval: 5000,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    mutate({ content: newComment, parent_comment_id: replyTo });
  };

  if (CommentsError) return <p>Error fetching comments</p>;
  if (isLoadingComments) return <p>Loading comments...</p>;

  const rootComments =
    comments?.filter((comment) => comment.parent_comment_id === null) ?? [];

  return (
    <div className="mt-12 space-y-8">
      <h3 className="text-2xl font-bold text-white">Comments</h3>
      {user ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-3xl border border-white/10 bg-black/1 p-6 backdrop-blur-sm"
        >
          {replyTo && (
            <div className="flex items-center justify-between rounded-xl border border-purple-500/20 bg-purple-500/10 p-3 text-sm">
              <span className="text-purple-300">
                Replying to comment #{replyTo}
              </span>

              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          )}
          <textarea
            value={newComment}
            rows={3}
            placeholder="write a comment..."
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full resize-none rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
          ></textarea>
          <div className="flex items-center gap-4">
            <button type="submit" className="button" disabled={isPending}>
              {isPending ? "Posting..." : "Post Comment"}
            </button>

            {isError && (
              <p className="text-sm text-red-400">Error posting comment</p>
            )}
          </div>
        </form>
      ) : (
        <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-400">
          You must be logged in to post a comment
        </p>
      )}

      <div className="space-y-5">
        {rootComments.map((comment) => {
          const replies =
            comments?.filter(
              (reply) => reply.parent_comment_id === comment.id,
            ) ?? [];

          return (
            <div
              key={comment.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-purple-500/40"
            >
              {/* Main comment */}
              <div className="mb-3 flex items-center justify-between">
                <p className="font-semibold text-purple-300">
                  {comment.author}
                </p>

                <p className="text-sm text-slate-500">
                  {new Date(comment.created_at).toLocaleDateString()}
                </p>
              </div>

              <p className="leading-relaxed text-slate-200">
                {comment.content}
              </p>

              <button
                onClick={() => setReplyTo(comment.id)}
                className="mt-4 text-sm text-slate-500 transition hover:text-purple-400"
              >
                Reply
              </button>

              {/* Replies */}
              {replies.length > 0 && (
                <div className="ml-8 mt-6 space-y-4 border-l border-purple-500/20 pl-6">
                  {replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="rounded-2xl border border-white/10 bg-slate-900/40 p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <p className="font-medium text-purple-300">
                          {reply.author}
                        </p>

                        <p className="text-xs text-slate-500">
                          {new Date(reply.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      <p className="text-slate-300">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommentSection;
