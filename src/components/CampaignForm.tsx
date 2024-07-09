import * as React from "react";
import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  Button,
  TextField,
} from "@mui/material";
import { Campaign, SubCampaign } from "./types";
import { v4 as uuidv4 } from "uuid";


import SubCampaignForm from "./SubCampaignForm";

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
    name: "",
    describe: "",
  },
  subCampaigns: [
    {
      id: uuidv4(),
      name: "Chiến dịch con 1",
      status: true,
      ads: [
        {
          id: uuidv4(),
          name: "Quảng cáo mặc định",
          quantity: 1,
        },
      ],
    },
  ],
};

export default function CampaignForm() {
  const [value, setValue] = React.useState(0);
  const [campaign, setCampaign] = useState<Campaign>(initialCampaign);
  const [subCampaign, setSubCampaign] = useState<SubCampaign>(
    campaign.subCampaigns[0]
  );

  const [isValid, setIsValid] = useState(true);

  const handleChangeSubCampaign = (data: SubCampaign) => {
    setSubCampaign({
      ...data,
    });
  };

  const handleChangeStatusSubCampaign = () => {
    const updatedSubCampaigns = campaign.subCampaigns.map((subCamp) => {
      if (subCamp.id === subCampaign.id) {
        return { ...subCamp, status: !subCamp.status };
      }
      return subCamp;
    });   
  
    setSubCampaign((prevSubCampaign) => ({
      ...prevSubCampaign,
      status: !prevSubCampaign.status,
    }));
    setCampaign((prevCampaign) => ({
      ...prevCampaign,
      subCampaigns: updatedSubCampaigns,
    }));
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleAdNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const updatedAds = subCampaign.ads.map((ad) =>
      ad.id === id ? { ...ad, name: e.target.value } : ad
    );
    const updatedSubCampaign = { ...subCampaign, ads: updatedAds };
    setSubCampaign(updatedSubCampaign);
    setCampaign((prevCampaign) => ({
      ...prevCampaign,
      subCampaigns: prevCampaign.subCampaigns.map((subCamp) =>
        subCamp.id === subCampaign.id ? updatedSubCampaign : subCamp
      ),
    }));
  };

  const handleAdQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const value = e.target.value.trim(); // Loại bỏ khoảng trắng ở đầu và cuối chuỗi

    // Kiểm tra nếu giá trị là rỗng, có thể xử lý theo ý muốn của bạn
    // Ví dụ: đặt giá trị mặc định là 0 khi trường rỗng
    const newValue = value === "" ? "0" : value;

    const parsedValue = parseInt(newValue);

    if (isNaN(parsedValue)) {
      // Xử lý trường hợp giá trị NaN ở đây
      // Ví dụ: có thể cung cấp một giá trị mặc định hoặc thông báo lỗi
    } else {
      const updatedAds = subCampaign.ads.map((ad) =>
        ad.id === id ? { ...ad, quantity: parsedValue } : ad
      );
      const updatedSubCampaign = { ...subCampaign, ads: updatedAds };
      setSubCampaign(updatedSubCampaign);
      setCampaign((prevCampaign) => ({
        ...prevCampaign,
        subCampaigns: prevCampaign.subCampaigns.map((subCamp) =>
          subCamp.id === subCampaign.id ? updatedSubCampaign : subCamp
        ),
      }));
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCampaign((prevCampaign) => ({
      ...prevCampaign,
      information: {
        ...prevCampaign.information,
        name: e.target.value,
      },
    }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCampaign((prevCampaign) => ({
      ...prevCampaign,
      information: {
        ...prevCampaign.information,
        describe: e.target.value,
      },
    }));
  };

  const changeSubcampaignName = (newName: string) => {
    setSubCampaign((prevSubCampaign) => ({
      ...prevSubCampaign,
      name: newName,
    }));

    setCampaign((prevCampaign) => ({
      ...prevCampaign,
      subCampaigns: prevCampaign.subCampaigns.map((subCamp) =>
        subCamp.id === subCampaign.id ? { ...subCamp, name: newName } : subCamp
      ),
    }));
  };

  const checkIsValid = () => {
    // Kiểm tra xem tên chiến dịch đã được nhập hay chưa
    if (!campaign.information.name) {
      setIsValid(false);
      return false;
    }

    // Kiểm tra xem tên các chiến dịch con và số lượng quảng cáo đã được nhập hay chưa
    for (const subCamp of campaign.subCampaigns) {
      if (!subCamp.name) {
        setIsValid(false);
        return false;
      }

      for (const ad of subCamp.ads) {
        if (!ad.name || ad.quantity === 0) {
          setIsValid(false);
          return false;
        }
      }
    }
    return true;
  };

  const onSubmit = async () => {
    // Chờ cho hàm checkIsValid() hoàn thành trước khi tiếp tục
    // const checkkisValid = await checkIsValid();

    if (checkIsValid()) {
      console.log("Data is valid. Submitting...");

      alert("Thêm chiến dịch thành công\n" + JSON.stringify({ campaign }));
      // Thực hiện các hành động cần thiết khi dữ liệu hợp lệ
    } else {
      alert("Vui lòng điền đúng và đầy đủ thông tin");
      // Thông báo cho người dùng về việc điền đầy đủ thông tin bắt buộc
    }

    // console.log(checkkisValid);
  };

  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "end",
          marginTop: "24px",
          borderBottom: "1px solid black",
        }}
      >
        <Button variant="contained" onClick={onSubmit}>
          Submit
        </Button>
      </Box>
      <Box sx={{marginX:'24px'}}>
        <Box
          sx={{
            width: "auto",
            padding: "16px",
            boxShadow:
              "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
          }}
        >
          {/* tabs */}
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
            <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* <FormControl> */}

              <TextField
                required
                id="outlined-required"
                label="Tên chiến dịch"
                value={campaign.information.name}
                error={!campaign.information.name && !isValid}
                helperText={
                  !campaign.information.name && !isValid
                    ? "Tên chiến dịch là trường bắt buộc"
                    : ""
                }
                onChange={handleNameChange}
                variant="standard"
              />
              {/* </FormControl> */}
              <TextField
                id="outlined-required"
                label="Mô tả"
                // defaultValue=""
                value={campaign.information.describe}
                onChange={handleDescriptionChange}
                variant="standard"
              />
            </Box>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <SubCampaignForm
            campaign={campaign}
            setCampaign={setCampaign}
            subCampaign={subCampaign}
            setSubCampaign={setSubCampaign}
            handleChangeSubCampaign={handleChangeSubCampaign}
            handleChangeStatusSubCampaign={handleChangeStatusSubCampaign}
            handleAdNameChange={handleAdNameChange}
            handleAdQuantityChange={handleAdQuantityChange}
            changeSubcampaignName={changeSubcampaignName}
            checkIsValid={checkIsValid}
          />
            {/* <Box>
            <Box display="flex">
              <Button
                sx={{ color: "red", height: "fit-content" }}
                variant="outlined"
                onClick={addSubCampaign}
                startIcon={<AddIcon />}
              ></Button>
              <List sx={{ display: "flex", gap: "12px" }}>
                {campaign.subCampaigns.map(
                  (item: SubCampaign, index: number) => (
                    <ListItem key={index}>
                      <Box
                        onClick={() => handleChangeSubCampaign(item)}
                        p={"16px"}
                        sx={{
                          border:
                            item.id === subCampaign.id
                              ? "2px solid blue"
                              : "2px solid grey",
                          display: "flex",
                          flexDirection: "column",
                          color: item.ads.some((ad) => ad.quantity === 0) && !isValid? 'red' : 'black'
                        }}
                        alignItems="center"
                        gap={4}
                      >
                        <Box>
                          {item?.name}
                          <CheckCircleIcon
                            color={item?.status ? "success" : "action"}
                          />
                        </Box>
                        <Typography>
                          {item.ads.reduce(
                            (total, curr) => total + curr.quantity,
                            0
                          )}
                        </Typography>
                      </Box>
                    </ListItem>
                  )
                )}
              </List>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Box
                sx={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "between !important",
                }}
              >
                <TextField
                  sx={{ width: "80%" }}
                  required
                  id="outlined-required"
                  label="Tên chiến dịch con "
                  // defaultValue=""
                  error={!subCampaign.name && !isValid}
                  helperText={
                    !subCampaign.name && !isValid
                      ? "Tên chiến dịch con là trường bắt buộc"
                      : ""
                  }
                  onChange={(e) => changeSubcampaignName(e.target.value)}
                  value={subCampaign.name}
                  variant="standard"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={subCampaign.status}
                      onChange={handleChangeStatusSubCampaign}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                  label="Đang hoạt động"
                />
              </Box>
              <Box></Box>
            </Box>
            <Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: "10%" }}>
                        <Checkbox
                          checked={selectAll}
                          onChange={handleSelectAll}
                          indeterminate={
                            subCampaign.ads.length > 0 && !selectAll
                          }
                        />
                      </TableCell>
                      <TableCell style={{ width: "30%" }}>
                        Tên quảng cáo*
                      </TableCell>
                      <TableCell style={{ width: "30%" }}>Số lượng*</TableCell>
                      <TableCell style={{ width: "30%" }}>
                        {selectAll ||
                        selectColumn.some((selected) => selected) ? (
                          <Button onClick={handleDeleteSelected}>
                            <DeleteIcon />
                          </Button>
                        ) : (
                          ""
                        )}

                        <Button variant="outlined" onClick={handleAddAd}>
                          {" "}
                          <AddIcon /> Thêm
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subCampaign.ads.map((ad, index) => (
                      <TableRow key={ad.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectColumn[index]}
                            onChange={() => handleSelectColumn(index)}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            required
                            id="outlined-required"
                            // defaultValue=""
                            value={ad.name}
                            onChange={(e) =>
                              handleAdNameChange(
                                e as React.ChangeEvent<HTMLInputElement>,
                                ad.id
                              )
                            }
                            variant="standard"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            required
                            id="outlined-required"
                            value={ad.quantity}
                            onChange={(e) =>
                              handleAdQuantityChange(
                                e as React.ChangeEvent<HTMLInputElement>,
                                ad.id
                              )
                            }
                            variant="standard"
                            error={ad.quantity === 0 && !isValid}
                            helperText={
                              ad.quantity === 0 && !isValid
                                ? "Số lượng không thể bằng 0"
                                : ""
                            }
                            inputProps={{
                              inputMode: "numeric",
                              pattern: "[0-9]*",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Button onClick={() => handleDeleteRow(ad.id)}>
                            <DeleteIcon />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box> */}
          </CustomTabPanel>
        </Box>
      </Box>
    </Box>
  );
}
