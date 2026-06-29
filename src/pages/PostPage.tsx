import { useParams } from "react-router";
import PostDetails from "../components/PostDetails";

const PostPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="px-2 md:px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <PostDetails postId={Number(id)} />
      </div>
    </div>
  );
};

export default PostPage;
