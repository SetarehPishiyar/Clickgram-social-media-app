import { useParams } from "react-router";
import CommunityDisplay from "../components/CommunityDisplay";

const CommunityPage = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-5xl font-bold tracking-tight text-gradient text-center">
          Community Posts
        </h2>
        <CommunityDisplay communityId={Number(id)} />
      </div>
    </div>
  );
};

export default CommunityPage;
