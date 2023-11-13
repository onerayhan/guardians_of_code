import React, { useState, useEffect } from "react";
import TinderCard from "react-tinder-card";


interface People{
  name: string;
  url: string;

}

function TinderCards() {
  //const [people, setPeople] = useState([]);

/*useEffect(() => {
    db.collection("/users").onSnapshot((snapshot) => {
      setPeople(snapshot.docs.map((doc) => doc.data()));
    });
  }, []);
*/

const people: People[]=[
  {
    name: 'Emre',
    url: '........'
  },
  {
    name: 'Emre',
    url: '........'
  },
  {
    name: 'Emre',
    url: '........'
  },
  {
    name: 'Emre',
    url: '........'
  },

]

  return (
    <div>
      <div className="flex justify-center mt-[10vh] mb-[55vh]">
        {people.map((person) => (
          <TinderCard
            key={person.name}
            className="absolute"
            preventSwipe={["up", "down"]}
          >
            <div
              style={{ backgroundImage: `url(${person.url})` }}
              className="relative bg-[black] w-[600px] max-w-[85vw] h-[50vh] shadow-[0px_18px_53px_0px_rgba(0,0,0,0.3)] bg-cover bg-center p-5 rounded-[20px]"
            >
              <h3 className="absolute text-white m-2.5 bottom-0">{person.name}</h3>
            </div>
          </TinderCard>
        ))}
      </div>
    </div>
  );
}

export default TinderCards;