import React, { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import { createUseStyles } from "react-jss";
import { CgWebsite } from "react-icons/cg";

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

function AdSpaces() {
  const classes = useStyles();
  const [adSpaceData, setAdSpaceData] = useState([]);
  const [dateColumns] = useState(["dateSaved"]);
  const columns = [
    { name: "_id", title: "Object Id" },
    { name: "adType", title: "AdSpace Type" },
    { name: "adSize", title: "AdSpace Size" },
    { name: "ad", title: "Advertisement Id" },
    { name: "cpc", title: "CPC" },
    { name: "cpm", title: "CPM" },
    { name: "impressions", title: "Impressions" },
    { name: "clicks", title: "Clicks" },
    { name: "dateSaved", title: "Date Saved" },
  ];

  const [tableColumnExtensions] = useState([
    { columnName: "_id", align: "center" },
    { columnName: "adType", align: "center" },
    { columnName: "adSize", align: "center" },
    { columnName: "ad", align: "center" },
    { columnName: "cpc", align: "center", width: "8%" },
    { columnName: "cpm", align: "center", width: "8%" },
    { columnName: "impressions", align: "center", width: "8%" },
    { columnName: "clicks", align: "center", width: "8%" },
    { columnName: "dateSaved", align: "center" },
  ]);

  const [editingStateColumnExtensions] = useState([
    { columnName: "_id", editingEnabled: false },
    { columnName: "dateSaved", editingEnabled: false },
  ]);

  const DateFormatter = ({ value }) =>
    value.replace(/(\d{4})-(\d{2})-(\d{2})/, "$3.$2.$1");

  const DateTypeProvider = (props) => (
    <DataTypeProvider formatterComponent={DateFormatter} {...props} />
  );

  useEffect(() => {
    fetchAdSpaceData();
  }, []);

  const fetchAdSpaceData = async () => {
    const responseData = await axios.get("http://localhost:5000/ad_space/");
    setAdSpaceData(responseData.data);
  };

  const commitChanges = async ({ added, changed, deleted }) => {
    if (added) {
      console.log("added");
      try {
        await axios.post("http://localhost:5000/ad_space/", ...added);
      } catch (err) {
        console.log(err);
      }
    }
    if (changed) {
      const changedObjectID = Object.entries(changed)[0][0];
      const changedObject = Object.entries(changed)[0][1];
      try {
        await axios.patch(
          `http://localhost:5000/ad_space/${changedObjectID}`,
          changedObject
        );
      } catch (err) {
        console.log(err);
      }
    }
    if (deleted) {
      const deletedObjectId = deleted[0];
      try {
        await axios.delete(`http://localhost:5000/ad_space/${deletedObjectId}`);
      } catch (err) {
        console.log(err);
      }
    }
    fetchAdSpaceData();
  };

  return (
    <div className={classes.container}>
      <Heading
        text="AdSpaces"
        icon={<CgWebsite />}
        headingStyle={{
          fontSize: "2.6rem",
          marginBottom: "4rem",
          marginTop: "2rem",
        }}
      />
      <Paper>
        <Grid
          rows={adSpaceData}
          columns={columns}
          getRowId={(adSpace) => adSpace._id}
        >
          <PagingState defaultCurrentPage={0} pageSize={10} />
          <SortingState
            // defaultSorting={[{ columnName: "ranking", direction: "asc" }]}
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

const useStyles = createUseStyles({
  container: { position: "relative" },
});

export default AdSpaces;
