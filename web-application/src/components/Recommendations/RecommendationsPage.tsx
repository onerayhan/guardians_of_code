import RecommendationsTable from './RecommendationsTable';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { Heading } from '@chakra-ui/react'



function RecommendationsPage() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#081730] text-white p-2.5">
    <Heading className="mt-10">Recommended Songs By Armonify</Heading>
    <Tabs className="mt-10"variant='soft-rounded' colorScheme='green'>
      <TabList>
        <Tab>Most Recommended</Tab>
        <Tab>Pop</Tab>
        <Tab>Hip Hop</Tab>
        <Tab>Rap</Tab>
        <Tab>Rock</Tab>
        <Tab>Electronic</Tab>
        <Tab>Funk</Tab>

      </TabList>
      <TabPanels>
        <TabPanel>
          <RecommendationsTable/>
        </TabPanel>
        <TabPanel>
        <RecommendationsTable/>
        </TabPanel>
        <TabPanel>
          <RecommendationsTable/>
        </TabPanel>
        <TabPanel>
          <RecommendationsTable/>
        </TabPanel>
        <TabPanel>
          <RecommendationsTable/>
        </TabPanel>
        <TabPanel>
          <RecommendationsTable/>
        </TabPanel>
        <TabPanel>
          <RecommendationsTable/>
        </TabPanel>
      </TabPanels>
    </Tabs>

    <Heading className=" mt-20">What Your Friends Listen?</Heading>
    <Tabs className="mt-10"variant='soft-rounded' colorScheme='green'>
      <TabList>
        <Tab>Most Recommended</Tab>
        <Tab>Pop</Tab>
        <Tab>Hip Hop</Tab>
        <Tab>Rap</Tab>
        <Tab>Rock</Tab>
        <Tab>Electronic</Tab>
        <Tab>Funk</Tab>

      </TabList>
      <TabPanels>
        <TabPanel>
          <RecommendationsTable/>
        </TabPanel>
        <TabPanel>
        <RecommendationsTable/>
        </TabPanel>
        <TabPanel>
          <RecommendationsTable/>
        </TabPanel>
        <TabPanel>
          <RecommendationsTable/>
        </TabPanel>
        <TabPanel>
          <RecommendationsTable/>
        </TabPanel>
        <TabPanel>
          <RecommendationsTable/>
        </TabPanel>
        <TabPanel>
          <RecommendationsTable/>
        </TabPanel>
      </TabPanels>
    </Tabs>
    </div>
 
  );
}

export default RecommendationsPage;