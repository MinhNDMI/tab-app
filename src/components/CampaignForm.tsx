import * as React from "react";
import { useState, } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Button, List, ListItem, TextField } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import { Campaign, SubCampaign, Ad } from "./types";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const initialCampaign: Campaign = {
  information: {
    name: '',
    describe: ''
  },
  subCampaigns: [{
    name: 'Chiến dịch con 1',
    status: true,
    ads: [{
      name: 'Quảng cáo mặc định',
      quantity: 1
    }]
  }]
};

export default function CampaignForm() {
  const [value, setValue] = React.useState(0);
  const [campaign, setCampaign] = useState<Campaign>(initialCampaign);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Button variant="contained">Submit</Button>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Thông tin" {...a11yProps(0)} />
            <Tab label="Chiến dịch con" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Box sx={{ display: "flex", flexDirection: 'column', gap: '12px' }}>
            <TextField
              required
              id="outlined-required"
              label="Tên chiến dịch"
              defaultValue=""
              variant="standard"
            />
            <TextField id="outlined-required" label="Mô tả" defaultValue="" variant="standard" />
          </Box>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Box>
            <Box display='flex'>
              <Button sx={{ color: 'red', height:'fit-content' }} variant="outlined" startIcon={<AddIcon />}></Button>
              <List>
                {campaign.subCampaigns.map((item, index) => (
                  <ListItem key={index}>
                    <Box p={"16px"} sx={{ border: '2px solid grey', display: 'flex', flexDirection: 'column' }} alignItems="center"
                      gap={4}>
                      <Box>
                        {item?.name}
                        {item?.status ? <CheckCircleIcon color="success"/> : <CheckCircleIcon />}
                      </Box>
                      <Typography>{item.ads.reduce((total, curr) => total+curr.quantity, 0)}</Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Box>
            <Box>

            </Box>
          </Box>
        </CustomTabPanel>
      </Box>
    </Box>
  );
}
