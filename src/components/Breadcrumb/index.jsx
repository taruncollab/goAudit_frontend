import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';


export default function CustomSeparator(props) {

  const navigate = useNavigate();

  const [listData, setListData] = useState([]);

  const {
    list
  } = props;

  const handleClick = (url) => {
    navigate(`../${url}`);
  }

  useEffect(() => {
    if (list) {
      const getListData = list?.map((data, index) => {
        if (list?.length !== index + 1) {
          return <Link underline="hover" key={index} color="inherit" onClick={() => handleClick(data?.url)}>
            {data?.title}
          </Link>;
        }
        else {
          return <Typography key={index} color="text.primary">
            {data?.title}
          </Typography>;
        }
      });
      setListData(getListData)
    }
  }, [list])


  return (
    <Stack spacing={2}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {listData}
      </Breadcrumbs>
    </Stack>
  );
}
