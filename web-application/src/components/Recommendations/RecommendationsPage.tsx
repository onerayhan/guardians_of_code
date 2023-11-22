import RecommendationsTable from './RecommendationsTable';
import FriendRecomsTable from './FriendRecomsTable';
import { Heading } from '@chakra-ui/react'

function RecommendationsPage() {

  return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#081730] text-white">
        <Heading className="mt-20">Recommended Songs By Armonify</Heading>
        <RecommendationsTable />

        <Heading className="mt-20">What Your Friends Listen?</Heading>
        <FriendRecomsTable />
      </div>
 
  );
}

export default RecommendationsPage;