import { TableContainer, Table, Thead, Tr, Th, Tbody, Td } from '@chakra-ui/react'

function RecommendationsTable() {

    

  
return (


<TableContainer maxH="500px" overflowY="auto">
  <Table variant='striped' colorScheme='teal' size='lg'>
    <Thead className="sticky top-0 bg-[#081730] ">
      <Tr>
        <Th>Song Name</Th> 
        <Th>Artist Name</Th>
        <Th>Album Name</Th>
        <Th>Genre</Th>
        <Th>Duration</Th>
        <Th>Year</Th>
      </Tr>
    </Thead>
    <Tbody>
      <Tr>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
      </Tr>
      <Tr>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
      </Tr>
      <Tr>
      <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
      </Tr>
      <Tr>
      <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
      </Tr>
      <Tr>
      <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
     </Tr>
      <Tr>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
      </Tr>
      <Tr>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
      </Tr>
      <Tr>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
      </Tr>
      <Tr>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
        <Td>-</Td>
      </Tr>
    </Tbody>
  </Table>
</TableContainer>






  );
}


export default RecommendationsTable;