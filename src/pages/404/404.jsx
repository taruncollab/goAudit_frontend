import ScareCrow from "../../assets/Scarecrow.png";
import { Button } from "@mui/material";
import "./404.scss";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const handleHomeClick = () => {
    if (localStorage.getItem("userToken")) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="display">
      <div className="display__img">
        <img src={ScareCrow} alt="404-Scarecrow" />
      </div>
      <div className="display__content">
        <h2 className="display__content--info">404 Not Found</h2>
        <Button className="btn" onClick={handleHomeClick}>
          Back to homepage
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
