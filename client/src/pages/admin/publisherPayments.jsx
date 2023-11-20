import React, { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import { createUseStyles } from "react-jss";
import { MdPayments } from "react-icons/md";

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

function Payments() {
  const classes = useStyles();
  const [paymentData, setPaymentData] = useState([]);
  const [dateColumns] = useState(["timestamp"]);
  const columns = [
    { name: "_id", title: "Object Id" },
    { name: "publisher", title: "Publisher Id" },
    { name: "adSpace", title: "Ad Space Id" },
    { name: "product", title: "Items" },
    { name: "amount", title: "Amount" },
    { name: "timestamp", title: "Timestamp" },
  ];

  const [tableColumnExtensions] = useState([
    { columnName: "_id", align: "center" },
    { columnName: "publisher", align: "center" },
    { columnName: "adSpace", align: "center" },
    { columnName: "product", align: "center" },
    { columnName: "amount", align: "center", width: "10%" },
    { columnName: "timestamp", align: "center" },
  ]);

  const [editingStateColumnExtensions] = useState([
    { columnName: "_id", editingEnabled: false },
    { columnName: "publisher", editingEnabled: false },
    { columnName: "adSpace", editingEnabled: false },
    { columnName: "product", editingEnabled: false },
    { columnName: "amount", editingEnabled: false },
    { columnName: "timestamp", editingEnabled: false },
  ]);

  const DateFormatter = ({ value }) =>
    value.replace(/(\d{4})-(\d{2})-(\d{2})/, "$3.$2.$1");

  const DateTypeProvider = (props) => (
    <DataTypeProvider formatterComponent={DateFormatter} {...props} />
  );

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    const responseData = await axios.get(
      "http://localhost:5000/payment/publishers/all"
    );
    setPaymentData(responseData.data);
  };

  const commitChanges = async ({ added, changed, deleted }) => {
    if (added) {
      console.log("added");
      try {
        await axios.post("http://localhost:5000/payment/", ...added);
      } catch (err) {
        console.log(err);
      }
    }
    if (changed) {
      const changedObjectID = Object.entries(changed)[0][0];
      const changedObject = Object.entries(changed)[0][1];
      try {
        await axios.patch(
          `http://localhost:5000/payment/${changedObjectID}`,
          changedObject
        );
      } catch (err) {
        console.log(err);
      }
    }
    if (deleted) {
      const deletedObjectId = deleted[0];
      try {
        await axios.delete(`http://localhost:5000/payment/${deletedObjectId}`);
      } catch (err) {
        console.log(err);
      }
    }
    fetchPaymentData();
  };

  return (
    <div className={classes.container}>
      <Heading
        text="Publisher Payments"
        icon={<MdPayments />}
        headingStyle={{
          fontSize: "2.6rem",
          marginBottom: "4rem",
          marginTop: "2rem",
        }}
      />
      <Paper>
        <Grid
          rows={paymentData}
          columns={columns}
          getRowId={(payment) => payment._id}
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
    </div>
  );
}

const useStyles = createUseStyles({
  container: { position: "relative" },
});

export default Payments;
