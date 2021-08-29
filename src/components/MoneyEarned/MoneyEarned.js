import "./MoneyEarned.css";

const MoneyEarned = ({ earned, startAgain }) => {
  return (
    <>
      <h1>You earned: {earned}</h1>
      <button className="play-btn" onClick={startAgain}>
        Play again
      </button>
    </>
  );
};

export default MoneyEarned;
