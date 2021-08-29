import { useEffect, useState, useMemo } from "react";
import useSound from "use-sound";

// components
import Trivia from "./components/Trivia/Trivia";
import Timer from "./components/Timer/Timer";
import MoneyList from "./components/MoneyList/MoneyList";
import MoneyEarned from "./components/MoneyEarned/MoneyEarned";
import Start from "./components/Start";
import User from "./components/User/User";

// data
import moneyPyramidData from "./data/moneyPyramidData";
import data from "./data/data";
import wait from "./assets/sounds/wait.mp3";

// styles
import "./App.css";

const App = () => {
  /*******************************************
   APP CONSTANTS
   ******************************************* */
  const timeLimit = 30;
  const noMoney = "$ 0";

  /*******************************************
  STATE HOOKS
  ******************************************* */

  // control the question we are at in the game
  const [questionNumber, setQuestionNumber] = useState(1);

  // control game state
  const [stopper, setStopper] = useState(false);

  // control money earned state
  const [earned, setEarned] = useState(noMoney);

  // control timer state
  const [timer, setTimer] = useState(timeLimit);

  // control selected answer state
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // eslint-disable-next-line no-unused-vars
  const [waitSound, { stop }] = useSound(wait);

  const [userName, setUserName] = useState(null);

  // eslint-disable-next-line no-unused-vars
  const [userData, setUserData] = useState(() => {
    const savedUserData = JSON.parse(localStorage.getItem("userData"));

    let userData = {};
    if (savedUserData) {
      userData = {
        userName: savedUserData.userName,
        bestResult: savedUserData.bestResult,
      };
    } else {
      userData = {
        userName: "John Doe",
        bestResult: 0,
      };
      localStorage.setItem("userData", JSON.stringify(userData));
    }

    return userData;
  });

  /*******************************************
  MEMOIZED VALUES
  ******************************************* */

  // the awards for each question, cached
  const moneyPyramidMemo = useMemo(() => {
    return moneyPyramidData;
  }, []);

  /*******************************************
  MANAGING SIDE EFFECTS
  ******************************************* */

  // Determine earned money at the end of the game
  useEffect(() => {
    if (questionNumber > 1) {
      const amountEarned = moneyPyramidMemo.find(
        (m) => m.id === questionNumber - 1
      ).amount;

      setEarned(amountEarned);

      setUserData((prevUserData) => {
        const prevAmount = parseInt(prevUserData.bestResult, 10);
        const newAmount = parseInt(amountEarned.split(" ")[1], 10);

        const newUserData = {
          ...prevUserData,
          bestResult: prevAmount < newAmount ? newAmount : prevAmount,
        };
        localStorage.setItem("userData", JSON.stringify(newUserData));
        return newUserData;
      });
    }
  }, [questionNumber, moneyPyramidMemo, setUserData, setEarned]);

  // Start countdown timer
  useEffect(() => {
    if (selectedAnswer !== null || !userName) {
      return;
    }
    if (timer === 0) {
      stop();
      setStopper(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedAnswer, timer, setTimer, setStopper, userName, stop]);

  // Reset timer in case of a new question
  useEffect(() => {
    setTimer(timeLimit);
  }, [setTimer, questionNumber]);

  /*******************************************
  METHODS
  ******************************************* */

  // Re-initialize state to start a new quiz
  const startAgain = () => {
    setStopper(false);
    setEarned(noMoney);
    setQuestionNumber(1);
    setTimer(timeLimit);
  };

  /*******************************************
  TEMPLATE
  ******************************************* */
  return (
    <div className="app">
      {userName ? (
        <>
          <div className="main">
            {stopper ? (
              <div className="endText">
                <MoneyEarned
                  earned={earned}
                  startAgain={startAgain}
                ></MoneyEarned>
              </div>
            ) : (
              <>
                <div className="top">
                  <Timer timer={timer}></Timer>
                </div>
                <div className="bottom">
                  <Trivia
                    data={data}
                    timer={timer}
                    setStopper={setStopper}
                    setQuestionNumber={setQuestionNumber}
                    questionNumber={questionNumber}
                    selectedAnswer={selectedAnswer}
                    setSelectedAnswer={setSelectedAnswer}
                  ></Trivia>
                </div>
              </>
            )}
          </div>

          <div className="pyramid">
            <User></User>
            <MoneyList
              moneyPyramidMemo={moneyPyramidMemo}
              questionNumber={questionNumber}
            ></MoneyList>
          </div>
        </>
      ) : (
        <Start setUserName={setUserName} setUserData={setUserData}></Start>
      )}
    </div>
  );
};

export default App;
