import React, { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import { FaUserEdit } from "react-icons/fa";
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

import Heading from "../../common/components/headingIcon";

function Publishers() {
  const [publisherData, setPublisherData] = useState([]);
  const [dateColumns] = useState(["dateSaved"]);
  const [imgColumns] = useState(["imageURL"]);
  const columns = [
    { name: "imageURL", title: "Image" },
    { name: "_id", title: "Object Id" },
    { name: "email", title: "Email" },
    { name: "name", title: "Name" },
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
      alt="publisher"
      width="40"
      height="40"
      style={{ borderRadius: "50%" }}
    />
  );

  const ImgTypeProvider = (props) => (
    <DataTypeProvider formatterComponent={ImageFormatter} {...props} />
  );

  useEffect(() => {
    fetchPublisherData();
  }, []);

  const fetchPublisherData = async () => {
    const responseData = await axios.get("http://localhost:5000/publisher/");
    console.log(responseData);
    setPublisherData(responseData.data);
  };

  const commitChanges = async ({ added, changed, deleted }) => {
    if (added) {
      console.log("added");
      try {
        await axios.post("http://localhost:5000/publisher/", ...added);
      } catch (err) {
        console.log(err);
      }
    }
    if (changed) {
      const changedObjectID = Object.entries(changed)[0][0];
      const changedObject = Object.entries(changed)[0][1];
      try {
        await axios.patch(
          `http://localhost:5000/publisher/${changedObjectID}`,
          changedObject
        );
      } catch (err) {
        console.log(err);
      }
    }
    if (deleted) {
      const deletedObjectId = deleted[0];
      try {
        await axios.delete(
          `http://localhost:5000/publisher/${deletedObjectId}`
        );
      } catch (err) {
        console.log(err);
      }
    }
    fetchPublisherData();
  };

  return (
    <div>
      <Heading
        text="Publishers"
        icon={<FaUserEdit />}
        headingStyle={{
          fontSize: "2.6rem",
          marginBottom: "4rem",
          marginTop: "2rem",
        }}
      />
      <Paper>
        <Grid
          rows={publisherData}
          columns={columns}
          getRowId={(publisher) => publisher._id}
        >
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
    </div>
  );
}

export default Publishers;
