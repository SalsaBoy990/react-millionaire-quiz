import "./User.css";

const User = () => {
  const savedUserData = JSON.parse(localStorage.getItem("userData"));

  return (
    <div className="card">
      <h3>{savedUserData?.userName}</h3>
      <p className="best-total">
        Highest earning: $ {savedUserData?.bestResult}
      </p>
    </div>
  );
};

export default User;
