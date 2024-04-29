import React, { useState } from "react";
import { Button, Checkbox, FormControlLabel, TextField, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Campaign, SubCampaign, Ad } from "./types";
import ClearIcon from '@mui/icons-material/Clear';
import { v4 as uuidv4 } from "uuid";

interface SubCampaignFormProps {
  campaign: Campaign;
  setCampaign: React.Dispatch<React.SetStateAction<Campaign>>;
  subCampaign: SubCampaign;
  setSubCampaign: React.Dispatch<React.SetStateAction<SubCampaign>>;
  handleChangeSubCampaign: (data: SubCampaign) => void;
  handleChangeStatusSubCampaign: () => void;
  handleAdNameChange: (newName: React.ChangeEvent<HTMLInputElement>, id: string) => void;
  handleAdQuantityChange: (newQuantity: React.ChangeEvent<HTMLInputElement>, id: string) => void;
  changeSubcampaignName: (newName: string) => void;
  checkIsValid: () => boolean;
}

export default function SubCampaignForm({
  campaign,
  setCampaign,
  subCampaign,
  setSubCampaign,
  handleChangeSubCampaign,
  handleChangeStatusSubCampaign,
  handleAdNameChange,
  handleAdQuantityChange,
  changeSubcampaignName,
  checkIsValid,
}: SubCampaignFormProps) {
  const [selectAll, setSelectAll] = useState(false);
  const [selectColumn, setSelectColumn] = useState<boolean[]>(
    Array(subCampaign.ads.length).fill(false)
  );

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setSelectColumn(Array(subCampaign.ads.length).fill(newSelectAll));
  };

  const handleSelectColumn = (index: number) => {
    setSelectColumn((prevSelectColumn) => {
      const newSelectColumn = [...prevSelectColumn];
      newSelectColumn[index] = !newSelectColumn[index];
      setSelectAll(newSelectColumn.every((value) => value));
      return newSelectColumn;
    });
  };

  const handleDeleteSelected = () => {
    const updatedAds = subCampaign.ads.filter(
      (_, index) => !selectColumn[index]
    );
    const updatedSubCampaign = { ...subCampaign, ads: updatedAds };
    setSubCampaign(updatedSubCampaign);
    setCampaign((prevCampaign) => ({
      ...prevCampaign,
      subCampaigns: prevCampaign.subCampaigns.map((subCamp) =>
        subCamp.id === subCampaign.id ? updatedSubCampaign : subCamp
      ),
    }));
    setSelectColumn((prevSelectColumn) =>
      prevSelectColumn.filter((_, index) => !selectColumn[index])
    );
    setSelectAll(false);
  };

  const addSubCampaign = async () => {
    const newSubCampaign: SubCampaign = {
      id: uuidv4(),
      name: `Chiến dịch con ${campaign.subCampaigns.length + 1}`,
      status: true,
      ads: [
        {
          id: uuidv4(),
          name: "Quảng cáo mặc định",
          quantity: 1,
        },
      ],
    };

    setSubCampaign(newSubCampaign);

    setCampaign((prevCampaign) => ({
      ...prevCampaign,
      subCampaigns: [...prevCampaign.subCampaigns, newSubCampaign],
    }));
  };

  const handleAddAd = () => {
    const newAd: Ad = {
      id: uuidv4(),
      name: `Quảng cáo ${subCampaign.ads.length + 1}`,
      quantity: 1,
    };
    const updatedSubCampaign = {
      ...subCampaign,
      ads: [...subCampaign.ads, newAd],
    };
    setSubCampaign(updatedSubCampaign);
    setCampaign((prevCampaign) => ({
      ...prevCampaign,
      subCampaigns: prevCampaign.subCampaigns.map((subCamp) =>
        subCamp.id === subCampaign.id ? updatedSubCampaign : subCamp
      ),
    }));
    setSelectColumn([...selectColumn, false]);
  };

  const handleDeleteRow = (id: string) => {
    const updatedAds = subCampaign.ads.filter((ad) => ad.id !== id);
    const updatedSubCampaign = { ...subCampaign, ads: updatedAds };
    setSubCampaign(updatedSubCampaign);
    setCampaign((prevCampaign) => ({
      ...prevCampaign,
      subCampaigns: prevCampaign.subCampaigns.map((subCamp) =>
        subCamp.id === subCampaign.id ? updatedSubCampaign : subCamp
      ),
    }));
    setSelectColumn(
      selectColumn.filter((_, index) => subCampaign.ads[index].id !== id)
    );
    setSelectAll(false);
  };

  const handleDeleteCampaign = async (id: string) => {
    const updatedSubCampaigns = await campaign.subCampaigns.filter((subCamp) => subCamp.id !== id);
    await setCampaign((prevCampaign) => ({
      ...prevCampaign,
      subCampaigns: updatedSubCampaigns,
    }));
    if (id !== subCampaign.id) {
      setSubCampaign(subCampaign);
    } else if (updatedSubCampaigns.length > 0) {
      await setSubCampaign(updatedSubCampaigns[0]);
    }
     else {
      alert('Vui lòng thêm campaign mới trước khi xoá')
    }
  };

  return (
    <Box>
      <Box display="flex" sx={{alignItems:'start'}}>
        <Button
          sx={{ color: "red", height: "fit-content", marginTop:'16px', marginRight:'16px' }}
          variant="outlined"
          onClick={addSubCampaign}
          startIcon={<AddIcon />}
        ></Button>
        <Box sx={{ display: "flex", gap: "12px", overflowX:'auto', width:'90vw',}}>
          {campaign.subCampaigns.map((item: SubCampaign, index: number) => (
            <Box key={index}>
              <Box
                onClick={() => handleChangeSubCampaign(item)}
                p={"16px"}
                width={'214px'}
                sx={{
                  position:'relative ',
                  borderRadius:'4px',
                  border:
                    item.id === subCampaign.id
                      ? "2px solid blue"
                      : "2px solid grey",
                  display: "flex",
                  flexDirection: "column",
                  color:
                    item.ads.some((ad) => ad.quantity === 0) && !checkIsValid()
                      ? "red"
                      : "black",
                }}
                alignItems="center"
                gap={4}
              >
                <Box sx={{display:'flex', alignItems:'center'}}>
                  {item?.name}
                  <CheckCircleIcon fontSize="small"
                    color={item?.status ? "success" : "action"}
                  />
                </Box>
                <Box sx={{position: "absolute", top:'5px', right:'5px'}} onClick={() => handleDeleteCampaign(item?.id)}>
                  <ClearIcon fontSize="small"/>
                </Box>
                <Typography sx={{color:'black'}}>
                  {item.ads.reduce((total, curr) => total + curr.quantity, 0)}
                </Typography>

              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <Box
          sx={{
            display: "flex",
            gap: "12px",
            justifyContent: "space-between",
          }}
        >
          <TextField
            sx={{ width: "80%" }}
            required
            id="outlined-required"
            label="Tên chiến dịch con "
            error={!subCampaign.name && !checkIsValid()}
            helperText={
              !subCampaign.name && !checkIsValid()
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
                  <TableCell style={{ width: "30%" }}>Tên quảng cáo*</TableCell>
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
                        value={ad.name}
                        error={!checkIsValid() && ad.name === ''}
                        helperText={
                          !checkIsValid() && ad.name === ''
                            ? "Tên quảng cáo không được để trống"
                            : ""
                        }
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
                        error={!checkIsValid() && ad.quantity === 0}
                        helperText={
                          !checkIsValid() && ad.quantity === 0
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
      </Box>
    </Box>
  );
}
