import CommunityList from "../components/CommunityList";

const CommuitiesPage = () => {
  return (
    <div className="px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-5xl font-bold tracking-tight text-gradient text-center">
          Communities
        </h2>
        <CommunityList />
      </div>
    </div>
  );
};

export default CommuitiesPage;
