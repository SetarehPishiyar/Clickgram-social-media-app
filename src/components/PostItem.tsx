import { Link } from "react-router";
import type { Post } from "./PostList";

interface Props {
  post: Post;
}

const PostItem = ({ post }: Props) => {
  return (
    <Link
      to={`/post/${post.id}`}
      className="group block overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500 hover:shadow-xl hover:shadow-black/20"
    >
      {/* Banner */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h2 className="line-clamp-2 text-xl font-bold text-white">
            {post.title}
          </h2>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="h-9 w-9 rounded-full bg-gradient-to-tl from-[#8A2BE2] to-[#491F70]">
            {post.avatar_url && (
              <img
                src={post.avatar_url}
                alt="avatar"
                className="h-full w-full object-cover rounded-full"
              />
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-zinc-200">Blog Post</p>

            <p className="text-xs text-zinc-500">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <span className="text-sm text-purple-300 transition-colors group-hover:text-white">
          Read →
        </span>
      </div>
    </Link>
  );
};

export default PostItem;
