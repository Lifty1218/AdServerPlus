import React, { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import { CgWebsite } from "react-icons/cg";
import { TailSpin } from "react-loader-spinner";
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

import Heading from "../../common/components/headingIcon";

function Domains() {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [domainData, setDomainData] = useState([]);
  const [dateColumns] = useState(["dateSaved"]);
  const columns = [
    // { name: "_id", title: "Object Id" },
    { name: "ranking", title: "Ranking" },
    { name: "name", title: "Title" },
    { name: "url", title: "URL" },
    { name: "category", title: "Category" },
    { name: "score", title: "Analytics Score" },
    { name: "dateSaved", title: "Date Created" },
  ];

  const [tableColumnExtensions] = useState([
    { columnName: "_id", align: "center" },
    { columnName: "ranking", align: "center", width: "10%" },
    { columnName: "name", align: "center" },
    { columnName: "url", align: "center" },
    { columnName: "category", align: "center" },
    { columnName: "score", align: "center", width: "12%" },
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
    fetchDomainData();
  }, []);

  const fetchDomainData = async () => {
    const responseData = await axios.get("http://localhost:5000/domain/");
    setDomainData(responseData.data);
  };

  const updateDomainRankings = async () => {
    setIsLoading(true);
    const responseData = await axios.get(
      "http://localhost:5000/domain/update_rankings"
    );
    // if (responseData.data) {
    setIsLoading(false);
    fetchDomainData();
    // }
  };

  const commitChanges = async ({ added, changed, deleted }) => {
    if (added) {
      console.log("added");
      try {
        await axios.post("http://localhost:5000/domain/", ...added);
      } catch (err) {
        console.log(err);
      }
    }
    if (changed) {
      const changedObjectID = Object.entries(changed)[0][0];
      const changedObject = Object.entries(changed)[0][1];
      try {
        await axios.patch(
          `http://localhost:5000/domain/${changedObjectID}`,
          changedObject
        );
      } catch (err) {
        console.log(err);
      }
    }
    if (deleted) {
      const deletedObjectId = deleted[0];
      try {
        await axios.delete(`http://localhost:5000/domain/${deletedObjectId}`);
      } catch (err) {
        console.log(err);
      }
    }
    fetchDomainData();
  };

  return (
    <div className={classes.container}>
      <Heading
        text="Domains"
        icon={<CgWebsite />}
        headingStyle={{
          fontSize: "2.6rem",
          marginBottom: "4rem",
          marginTop: "2rem",
        }}
      />
      <Paper>
        <Grid
          rows={domainData}
          columns={columns}
          getRowId={(domain) => domain._id}
        >
          <PagingState defaultCurrentPage={0} pageSize={10} />
          <SortingState
            defaultSorting={[{ columnName: "ranking", direction: "asc" }]}
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
      <button className={classes.button} onClick={updateDomainRankings}>
        {isLoading ? "Updating..." : "Update Rankings"}
        {isLoading && (
          <span style={{ marginLeft: "2rem" }}>
            <TailSpin color="#fff" height={25} width={25} />
          </span>
        )}
      </button>
    </div>
  );
}

const useStyles = createUseStyles({
  container: { position: "relative" },
  button: {
    position: "absolute",
    top: "0",
    right: "0",
    padding: "1.5rem 3rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    outline: "none",
    backgroundColor: "#00ADB5",
    border: "none",
    color: "#f5f5f5",
    fontSize: "1.6rem",
    borderRadius: "3px",
    textTransform: "uppercase",
    transition: "all .2s",
    "&:hover": {
      backgroundColor: "#374151",
    },
  },
});

export default Domains;
