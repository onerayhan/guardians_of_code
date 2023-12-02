import RecommendationsTable from './RecommendationsTable';
import FriendRecomsTable from './FriendRecomsTable';
import { Heading } from '@chakra-ui/react'

function RecommendationsPage() {

  return (
      <div className="flex flex-col items-center justify-center min-h-full w-full bg-[#081730] text-white overflow-y-auto pb-96">
        <Heading className="mt-20">What You Listen?</Heading>
          <div className="pt-5"></div>
        <RecommendationsTable />
          <div className="pt-5"></div>
        <Heading className="mt-20">What Your Friends Listen?</Heading>
        <FriendRecomsTable />
      </div>
  );
}

export default RecommendationsPage;