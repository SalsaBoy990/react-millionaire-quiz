import { useRef } from "react";

import "./Start.css";

const Start = ({ setUserName, setUserData }) => {
  const userNameRef = useRef("");

  const handleUserInput = () => {
    const enteredValue = userNameRef.current.value;

    if (enteredValue) {
      setUserName(enteredValue);
      setUserData((prevUserData) => {
        const newUserData = { ...prevUserData, userName: enteredValue };
        localStorage.setItem("userData", JSON.stringify(newUserData));
        return newUserData;
      });
    }
  };

  return (
    <div className="start">
      <input
        type="text"
        placeholder="Enter your name"
        defaultValue=""
        ref={userNameRef}
        className="start-input"
        autoFocus={true}
      />
      <button className="start-button" onClick={handleUserInput}>
        Start
      </button>
    </div>
  );
};

export default Start;
