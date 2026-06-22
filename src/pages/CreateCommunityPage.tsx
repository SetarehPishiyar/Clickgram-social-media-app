import CreateCommunity from "../components/CreateCommunity";

const CreateCommunityPage = () => {
  return (
    <div className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h2 className="text-5xl font-bold tracking-tight text-gradient text-center">
            Create New Community
          </h2>
          <p className="mt-2 text-slate-400 text-center">
            Create new community and make friends.
          </p>
        </div>

        <CreateCommunity />
      </div>
    </div>
  );
};

export default CreateCommunityPage;
