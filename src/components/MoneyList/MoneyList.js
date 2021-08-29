import "./MoneyList.css";

const MoneyList = ({ moneyPyramidMemo, questionNumber }) => {
  return (
    <ul className="moneyList">
      {moneyPyramidMemo.map((m) => {
        return (
          <li
            key={m.id}
            className={
              m.id === questionNumber ? "moneyListItem active" : "moneyListItem"
            }
          >
            <span className="moneyListItemNumber">{m.id}</span>
            <span className="moneyListItemAmount">{m.amount}</span>
          </li>
        );
      })}
    </ul>
  );
};

export default MoneyList;
