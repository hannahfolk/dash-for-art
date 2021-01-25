import React from "react";
import PropTypes from "prop-types";

import clsx from "clsx";

import CheckIcon from "@material-ui/icons/Check";
import NotInterestedRoundedIcon from "@material-ui/icons/NotInterestedRounded";
import IconButton from "@material-ui/core/IconButton";
import ListAltIcon from "@material-ui/icons/ListAlt";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.primary.main, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
  iconPaid: {
    color: "green",
  },
}));

const TealCheckbox = withStyles({
  root: {
    color: "#64add1",
    "&$checked": {
      color: "#64add1",
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const TableToolbar = ({
  numSelected,
  markedAsPaid,
  markedAsUnpaid,
  exportCSV,
  totalRecords,
  checkedExcludeTags,
  handleCheckboxChange,
}) => {
  const classes = useToolbarStyles();

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle">
          Commissions: <small>{`${totalRecords} Total Records Found`}</small>
        </Typography>
      )}

      {numSelected > 0 ? (
        <>
          <Tooltip title="Paid">
            <IconButton aria-label="paid" onClick={markedAsPaid}>
              <CheckIcon fontSize={"large"} className={classes.iconPaid} /> Paid
            </IconButton>
          </Tooltip>
          <Tooltip title="Unpaid">
            <IconButton aria-label="unpaid" onClick={markedAsUnpaid}>
              <NotInterestedRoundedIcon fontSize={"large"} color={"error"} />
              Unpaid
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "row", minWidth: "300px" }}
        >
          <FormControlLabel
            control={
              <TealCheckbox
                checked={checkedExcludeTags}
                onChange={handleCheckboxChange}
                name="checkedExcludeTags"
              />
            }
            label="Exclude Tags"
            style={{ minWidth: "150px" }}
          />
          <Tooltip title="CSV">
            <IconButton aria-label="export csv" onClick={exportCSV}>
              <ListAltIcon fontSize={"large"} /> Export CSV
            </IconButton>
          </Tooltip>
        </div>
      )}
    </Toolbar>
  );
};

TableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  markedAsPaid: PropTypes.func.isRequired,
};

export default TableToolbar;
