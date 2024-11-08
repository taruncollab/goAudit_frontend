export const getInitialValues = (dataArr = []) => {
  const tempObj = {};
  dataArr.map((data) => {
    tempObj[data?.name] = data?.value;
  });
  return tempObj;
};

export const getValidationSchema = (Yup, dataArr = []) => {
  const tempObj = {};
  dataArr.map((data) => {
    tempObj[data?.name] = data?.validate;
  });
  return Yup.object().shape(tempObj);
};

export const addAutoSrId = (data = []) => {
  let returnData = [];
  data?.map((row, index) => {
    returnData.push({ ...row, autoSrId: data.length - index });
  });
  return returnData;
};

export const getCompanyName = (id, comp) => {
  let data = comp.find((item) => item._id == id);
  return data && data.name;
};
export const getLocationName = (id, location) => {
  let data = location.find((item) => item._id == id);
  return data && data.locName;
};
export const getCategoryName = (id, category) => {
  let data = category.find((item) => item._id == id);
  return data && data.name;
};
export const getUserName = (id, user) => {
  let data = user.find((item) => item._id == id);
  return data && data.name;
};

export const splitOnLastDot = (str) => {
  const result = str.split(/\.([^.]*)$/);
  const newStr = result.length > 1 ? [result[0], result[1]] : [str];
  return newStr[1].toLowerCase();
}