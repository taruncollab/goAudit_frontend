import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { getCompanies } from "../apis/companySlice";
import { getLocations } from "../apis/locationSlice";
import { getCategories } from "../apis/categorySlice";
import { getQuestions } from "../apis/questionSlice";

const useHandleDelete = (apiAction, name) => {
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You won't be able to revert this ${name}!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, delete this ${name}!`,
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(apiAction(id)).then((response) => {
          if (response.type?.includes("fulfilled")) {
            Swal.fire("Deleted!", `${name} has been deleted.`, "success");
            if (name == "Company") {
              dispatch(getCompanies({}));
            }
            if (name == "Location") {
              dispatch(getLocations({}));
            }
            if (name == "Category") {
              dispatch(getCategories({}));
            }
            if (name == "Question") {
              dispatch(getQuestions({}));
            }
          } else {
            Swal.fire(
              "Error!",
              `There was an issue deleting the ${name}.`,
              "error"
            );
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", `${name} is safe :)`, "info");
      }
    });
  };

  return handleDelete;
};

export default useHandleDelete;
