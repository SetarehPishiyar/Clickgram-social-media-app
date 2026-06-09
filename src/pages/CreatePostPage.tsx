import CreatePost from "../components/CreatePost";

const CreatePostPage = () => {
  return (
    <div className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h2 className="text-5xl font-bold tracking-tight text-gradient text-center">
            Create New Post
          </h2>
          <p className="mt-2 text-slate-400 text-center">
            Share your thoughts, stories, and ideas.
          </p>
        </div>

        <CreatePost />
      </div>
    </div>
  );
};

export default CreatePostPage;
