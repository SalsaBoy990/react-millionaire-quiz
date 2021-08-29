import { useEffect, useState } from "react";
import useSound from "use-sound";

import { delay } from "../../utils";

import play from "../../assets/sounds/play.mp3";
import correct from "../../assets/sounds/correct.mp3";
import wrong from "../../assets/sounds/wrong.mp3";
import wait from "../../assets/sounds/wait.mp3";
import "./Trivia.css";

const Trivia = ({
  data,
  timer,
  questionNumber,
  setQuestionNumber,
  setStopper,
  selectedAnswer,
  setSelectedAnswer,
}) => {
  // states
  // current questions
  const [question, setQuestion] = useState(null);
  // current answers
  const [className, setClassName] = useState(null);

  // custom hook useSound
  const [startGameSound] = useSound(play);
  const [correctAnswerSound] = useSound(correct);
  const [wrongAnswerSound] = useSound(wrong);
  const [waitSound, { stop }] = useSound(wait);

  useEffect(() => {
    const soundOptions = { volume: 0.5 };

    startGameSound(soundOptions);
    delay(5000, () => {
      waitSound(soundOptions);
    });
  }, [startGameSound, waitSound]);

  // effects
  useEffect(() => {
    // array indexing is from 0
    setQuestion(data[questionNumber - 1]);
  }, [data, questionNumber]);

  useEffect(() => {
    if (timer === 0) {
      stop();
    }
  }, [timer, stop]);

  // user clicked on an answer item
  const handleSelectingAnswer = (answer) => {
    setSelectedAnswer(answer);
    setClassName("answer active");

    // delay showing correct/wrong state background color
    delay(3000, () => {
      setClassName(answer.correct ? "answer correct" : "answer wrong");
    });

    // delay checking if user clicked on the correct/wrong answer
    delay(5000, () => {
      if (answer.correct) {
        const soundOptions = { volume: 0.5 };
        stop();
        correctAnswerSound(soundOptions);

        delay(1000, () => {
          setQuestionNumber((prevNumber) => prevNumber + 1);
          setSelectedAnswer(null);
        });
        delay(8000, () => {
          waitSound(soundOptions);
        });
      } else {
        const soundOptions = { volume: 0.5 };
        stop();
        wrongAnswerSound(soundOptions);
        delay(1000, () => {
          setSelectedAnswer(null);
          setStopper(true);
        });
      }
    });
  };

  // template
  return (
    <div className="trivia">
      <div className="question">{question?.question}</div>
      <div className="answers">
        {question?.answers.map((answer, index) => (
          <div
            key={"answer" + index}
            className={selectedAnswer === answer ? className : "answer"}
            onClick={() => {
              handleSelectingAnswer(answer);
            }}
          >
            {answer.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trivia;
