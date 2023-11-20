import React, { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import { RiAdvertisementFill } from "react-icons/ri";
import Modal from "react-modal";
import { createUseStyles } from "react-jss";
import {
  PagingState,
  IntegratedPaging,
  EditingState,
  SortingState,
  IntegratedSorting,
  SearchState,
  IntegratedFiltering,
  DataTypeProvider,
} from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
  TableEditRow,
  TableEditColumn,
  Toolbar,
  SearchPanel,
} from "@devexpress/dx-react-grid-material-ui";

Modal.setAppElement("#root");

import Heading from "../../common/components/headingIcon";

function Ads() {
  const [adData, setAdData] = useState([]);
  const [dateColumns] = useState(["dateSaved"]);
  const [imgColumns] = useState(["imageURL"]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImgUrl, setModalImgUrl] = useState("");
  const classes = useStyles();

  const handleImgClick = (imgURL) => {
    setModalImgUrl(imgURL);
    setIsModalOpen(true);
  };

  const handleModalOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      setIsModalOpen(false);
    }
  };

  const columns = [
    { name: "imageURL", title: "Image" },
    { name: "_id", title: "Object Id" },
    { name: "targetCategory", title: "Category" },
    { name: "targetLocation", title: "Location" },
    { name: "redirectURL", title: "RedirectURL" },
    { name: "dateSaved", title: "Date Created" },
  ];

  const [tableColumnExtensions] = useState([
    { columnName: "imageURL", align: "center", width: "15rem" },
    { columnName: "_id", align: "center" },
    { columnName: "email", align: "center" },
    { columnName: "name", align: "center" },
    { columnName: "dateSaved", align: "center" },
  ]);

  const [editingStateColumnExtensions] = useState([
    { columnName: "_id", editingEnabled: false },
    { columnName: "dateSaved", editingEnabled: false },
    { columnName: "imageURL", editingEnabled: false },
  ]);

  const DateFormatter = ({ value }) =>
    value.replace(/(\d{4})-(\d{2})-(\d{2})/, "$3.$2.$1");

  const DateTypeProvider = (props) => (
    <DataTypeProvider formatterComponent={DateFormatter} {...props} />
  );

  const ImageFormatter = ({ row }) => (
    <img
      src={row.imageURL}
      alt="ad"
      width="60"
      height="60"
      style={{ cursor: "pointer" }}
      onClick={() => handleImgClick(row.imageURL)}
    />
  );

  const ImgTypeProvider = (props) => (
    <DataTypeProvider formatterComponent={ImageFormatter} {...props} />
  );

  useEffect(() => {
    fetchAdData();
  }, []);

  const fetchAdData = async () => {
    const responseData = await axios.get("http://localhost:5000/ad/");
    console.log(responseData);
    setAdData(responseData.data);
  };

  const commitChanges = async ({ added, changed, deleted }) => {
    if (added) {
      console.log("added");
      try {
        await axios.post("http://localhost:5000/ad/", ...added);
      } catch (err) {
        console.log(err);
      }
    }
    if (changed) {
      const changedObjectID = Object.entries(changed)[0][0];
      const changedObject = Object.entries(changed)[0][1];
      try {
        await axios.patch(
          `http://localhost:5000/ad/${changedObjectID}`,
          changedObject
        );
      } catch (err) {
        console.log(err);
      }
    }
    if (deleted) {
      const deletedObjectId = deleted[0];
      try {
        await axios.delete(`http://localhost:5000/ad/${deletedObjectId}`);
      } catch (err) {
        console.log(err);
      }
    }
    fetchAdData();
  };

  return (
    <div>
      <Heading
        text="Ads"
        icon={<RiAdvertisementFill />}
        headingStyle={{
          fontSize: "2.6rem",
          marginBottom: "4rem",
          marginTop: "2rem",
        }}
      />
      <Paper>
        <Grid rows={adData} columns={columns} getRowId={(ad) => ad._id}>
          <PagingState defaultCurrentPage={0} pageSize={10} />
          <SortingState
            defaultSorting={[{ columnName: "name", direction: "asc" }]}
          />
          <IntegratedPaging />
          <IntegratedSorting />
          <EditingState
            onCommitChanges={commitChanges}
            columnExtensions={editingStateColumnExtensions}
          />
          <SearchState />
          <IntegratedFiltering />
          <DateTypeProvider for={dateColumns} />
          <ImgTypeProvider for={imgColumns} />
          <Table columnExtensions={tableColumnExtensions} />
          <TableHeaderRow showSortingControls />
          <Toolbar />
          <SearchPanel />
          <TableEditRow />
          <TableEditColumn showAddCommand showEditCommand showDeleteCommand />
          <PagingPanel />
        </Grid>
      </Paper>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalOverlayClick}
        shouldCloseOnOverlayClick={true}
        className={classes.content}
        overlayClassName={classes.overlay}
      >
        <img
          src={modalImgUrl}
          style={{ transform: "scale(1.5)" }}
          alt="AdImage"
        />
      </Modal>
    </div>
  );
}

const useStyles = createUseStyles({
  content: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  overlay: {
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    backgroundColor: "rgba(57, 62, 70, 0.5)",
    zIndex: "9999",
  },
  imgZoomIcon: {
    color: "transparent",
    fontSize: "4.5rem",
    transition: "all .1s",
  },
});

export default Ads;
