import { useEffect } from "react";
import { useState } from "react";

const UserPage = () => {

    const [username, setUser] = useState(null);

    useEffect(() => {
        if (username) {
    document.title = "${user.name}'s Profile";
    }, [username]);

  return (
    <div>
      <h1>Sign Up Page</h1>
    </div>
  );
};

export default UserPage;