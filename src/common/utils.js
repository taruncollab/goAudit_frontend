import dashboardWhite from "../assets/white/dashboardWhite.png";
import dashboardBlack from "../assets/black/dashboardBlack.png";
import companyWhite from "../assets/white/companyWhite.png";
import companyBlack from "../assets/black/companyBlack.png";
import locationWhite from "../assets/white/locationWhite.png";
import locationBlack from "../assets/black/locationBlack.png";
import categoryBlack from "../assets/black/category_black.png";
import categoryWhite from "../assets/white/category_White.png";
import questionWhite from "../assets/white/questionWhite.png";
import questionBlack from "../assets/black/questionBlack.png";
import formWhite from "../assets/white/formWhite.png";
import formBlack from "../assets/black/formBlack.png";
import formRecordWhite from "../assets/white/formRecordWhite.png";
import formRecordBlack from "../assets/black/formRecordBlack.png";
import compareWhite from "../assets/white/compareWhite.png";
import compareBlack from "../assets/black/compareBlack.png";
import Dashboard from "../pages/dashboard/Dashboard";
import Company from "../pages/company/Company";
import Location from "../pages/location/Location";
import Users from "../pages/users/Users";
import Category from "../pages/category/Category";
import Question from "../pages/question/Question";
import QuestionForm from "../pages/question/QuestionForm";
import QuestionDetails from "../pages/question/QuestionDetails";
import ShowForms from "../pages/form/ShowForms";
import Form from "../pages/form/Form";
import FormRecords from "../pages/form/formRecords";
import FormDetails from "../pages/form/FormDetails";
import CompareScore from "../pages/Compare/CompareScore";
import DraftFormRecords from "../pages/form/DraftFormRecords";

export const SidebarArray = [
  {
    name: "Dashboard",
    link: "/dashboard",
    role: ["A"],
    whiteIcon: dashboardWhite,
    blackIcon: dashboardBlack,
  },
  {
    name: "Company",
    link: "/company",
    role: ["A"],
    whiteIcon: companyWhite,
    blackIcon: companyBlack,
  },
  {
    name: "Location",
    link: "/location",
    role: ["A"],
    whiteIcon: locationWhite,
    blackIcon: locationBlack,
  },
  {
    name: "Users",
    link: "/users",
    role: ["A"],
    whiteIcon: dashboardWhite,
    blackIcon: dashboardBlack,
  },
  {
    name: "Category",
    link: "/category",
    role: ["A"],
    whiteIcon: categoryWhite,
    blackIcon: categoryBlack,
  },
  {
    name: "Add Question",
    link: "/question",
    role: ["A"],
    whiteIcon: questionWhite,
    blackIcon: questionBlack,
  },
  {
    name: "Fill Form",
    link: "/showforms",
    role: ["A", "U"],
    whiteIcon: formWhite,
    blackIcon: formBlack,
  },
  {
    name: "Draft Form",
    link: "/draftform",
    role: ["A", "U"],
    whiteIcon: formRecordWhite,
    blackIcon: formRecordBlack,
  },
  {
    name: "Form Records",
    link: "/formrecords",
    role: ["A", "U"],
    whiteIcon: formRecordWhite,
    blackIcon: formRecordBlack,
  },
  {
    name: "Compare Scores",
    link: "/comparescore",
    role: ["A"],
    whiteIcon: compareWhite,
    blackIcon: compareBlack,
  },
];

export const RoutesArray = [
  {
    link: "/dashboard",
    component: Dashboard,
  },
  {
    link: "/company",
    component: Company,
  },
  {
    link: "/location",
    component: Location,
  },
  {
    link: "/users",
    component: Users,
  },
  {
    link: "/category",
    component: Category,
  },
  {
    link: "/question",
    component: Question,
  },
  {
    link: "/questionform/:id?",
    component: QuestionForm,
  },
  {
    link: "/questiondetails/:id",
    component: QuestionDetails,
  },
  {
    link: "/showforms",
    component: ShowForms,
  },
  {
    link: "/fillform/:id?",
    component: Form,
  },
  {
    link: "/draftfillform/:id?",
    component: Form,
  },
  {
    link: "/draftform",
    component: DraftFormRecords,
  },
  {
    link: "/formrecords",
    component: FormRecords,
  },
  {
    link: "/formdetails/:id",
    component: FormDetails,
  },
  {
    link: "/comparescore",
    component: CompareScore,
  },
];

export const options = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
  { label: "Not Sure", value: "not sure" },
];

export const downloadReportExcel = (jsonData) => {
  let downloadData = [];
  jsonData.forEach((element) => {
    let innerData = {
      "Form Title": element && element.title,
      Question: element && element.formData && element.formData.text,
      Answer: element && element.formData && element.formData.answer[0],
    };
    downloadData.push(innerData);
  });
  return downloadData;
};
