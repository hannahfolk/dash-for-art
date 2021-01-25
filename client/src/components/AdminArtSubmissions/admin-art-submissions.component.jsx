import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useParams } from "react-router-dom";

import {
  selectUserAccount,
  selectUserJWTToken,
} from "../../redux/user/user.selector";

import axios from "axios";
import Swal from "sweetalert2";

import Calendar from "./calendar.component";
import { AdminArtCard as ArtCard } from "../ArtCards";
import AutocompleteSearch from "../AutocompleteSearch";
import AdminArtApproval from "../AdminArtApproval";
import { MainButton } from "../Button";

import teefuryBirdLogo from "../../assets/teefury-bird.jpg";
import { ReactComponent as AdjustablesIcon } from "../../assets/adjustables.svg";

import {
  SubmissionContainer,
  TabArea,
  FilterHeader,
  StatusHeader,
  AdjustableIconWrapper,
  FilterContainer,
  FilterLink,
  ArtCardContainer,
} from "../SharedStyle/art-submissions.styles";

const AdminArtSubmissions = (props) => {
  const {
    userAccount: { contactEmail },
    token,
  } = props;
  const params = useParams();
  const [state, setState] = useState({
    search: "",
    isShowingFilter: false,
    status: "NEW",
    imageSrc: teefuryBirdLogo,
    submissionsArrIndex: 0,
    id: 0,
    isAnArtCardSelected: false,
    isAdminArtApproval: false,
    isFlipLeftDisabled: false,
    isFlipRightDisabled: false,
  });
  let [selectionCount, setSelectionCount] = useState(0);
  const [submissionsArr, setSubmissionsArr] = useState([]);
  const [dropdownArr, setDropdownArr] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 4)),
    endDate: new Date(),
  });

  const { startDate, endDate } = dateRange;

  const {
    search,
    isShowingFilter,
    status,
    submissionsArrIndex,
    id,
    isAdminArtApproval,
    isFlipLeftDisabled,
    isFlipRightDisabled,
  } = state;

  useEffect(
    () => {
      setSubmissionsArr([]);

      const status = _getCurrentPath();
      if (status === "DECLINED") {
        _getDeclinedSubmissionsByDate(startDate, endDate);
      } else {
        _getSubmissions(status);
      }
    },
    // eslint-disable-next-line
    [params]
  );

  const _getCurrentPath = () => {
    const status = params.status.toUpperCase();
    return status;
  };

  const _getSubmissions = async (status) => {
    setSelectionCount(0);
    const {
      data: { submissionsDetailsArr },
    } = await axios.get(`/api/admin/submissions/${status}`, {
      headers: { Authorization: `JWT ${token}` },
    });

    submissionsDetailsArr.forEach((submission) => {
      submission.isSelected = false;
    });

    _formatDropdownArr(submissionsDetailsArr);
    setState({
      ...state,
      status,
      isShowingFilter: false,
      isAdminArtApproval: false,
    });
    setSubmissionsArr(submissionsDetailsArr);
    return submissionsDetailsArr;
  };

  const _getDeclinedSubmissionsByDate = async (startDate, endDate) => {
    const start = new Date(startDate).toLocaleDateString("en-CA", {
      timeZone: "GMT",
    });
    const end = new Date(endDate).toLocaleDateString("en-CA", {
      timeZone: "GMT",
    });

    try {
      const {
        data: { submissionsDetailsArr },
      } = await axios.post(
        `/api/admin/submissions/declined-by-date`,
        {
          start,
          end,
        },
        {
          headers: { Authorization: `JWT ${token}` },
        }
      );

      submissionsDetailsArr.forEach((submission) => {
        submission.isSelected = false;
      });

      _formatDropdownArr(submissionsDetailsArr);
      setState({
        ...state,
        status: "DECLINED",
        isShowingFilter: false,
        isAdminArtApproval: false,
      });
      setSubmissionsArr(submissionsDetailsArr);

      return submissionsDetailsArr;
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Something went wrong. Please try again.",
      });
    }
  };

  const _formatDropdownArr = (submissionsDetailsArr) => {
    const dropdownArr = [
      {
        title: "Product Title",
        elements: [],
      },
      {
        title: "Artist Name",
        elements: [],
      },
      {
        title: "Date Submitted",
        elements: [],
      },
      {
        title: "Email Status",
        elements: [],
      },
    ];

    submissionsDetailsArr.forEach((submission) => {
      if (submission.title !== "" || submission.title !== null) {
        dropdownArr[0].elements.push(submission.title);
      }
      if (submission.artistName !== "" || submission.artistName !== null) {
        dropdownArr[1].elements.push(submission.artistName);
        const uniqueArtistNamesArr = new Set(dropdownArr[1].elements);
        dropdownArr[1].elements = [...uniqueArtistNamesArr];
      }
      if (submission.createdAt !== "" || submission.createdAt !== null) {
        dropdownArr[2].elements.push(
          new Date(submission.createdAt).toLocaleDateString("en-US", {
            timezone: "UTC",
          })
        );
        const uniqueCreatedAtDatesArr = new Set(dropdownArr[2].elements);
        dropdownArr[2].elements = [...uniqueCreatedAtDatesArr];
      }
      if (submission.emailStatus !== "" || submission.emailStatus !== null) {
        dropdownArr[3].elements.push(submission.emailStatus);
        const uniqueEmailStatusArr = new Set(dropdownArr[3].elements);
        dropdownArr[3].elements = [...uniqueEmailStatusArr];
      }
    });

    setDropdownArr(dropdownArr);
  };

  const _deleteAllSelected = (event) => {
    Swal.fire({
      title: "Are you sure?",
      text:
        "The art files will be deleted, and emails will be sent to the corresponding artists.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonColor: "#d33",
    }).then(async (response) => {
      if (response.value) {
        const timeOptions = {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        };

        const selectedSubmissionsArr = submissionsArr.filter(
          (submission) => submission.isSelected === true
        );

        selectedSubmissionsArr.forEach(async (submission) => {
          const { artistName, artistEmail, id, title } = submission;
          let { logs } = submission;
          const emailSubject = "We're sorry but your submission was declined.";
          const emailBody = `After reviewing your submission, ${title}, we've decided not to print your design at this time.<br/><br/>We receive a large number of high quality submissions on a daily basis and we can only choose a select few. Even when our basic design guidelines are met, sometimes it comes down to whether a design will resonate with the TeeFury audience to a level that will benefit both the artist and the site.<br/><br/>Please don't be discouraged! We appreciate every submission, and do hope to see more designs from you in the future.<br/><br/>Thanks for submitting!<br/><br/>The TeeFury Team`;

          if (logs !== null) {
            logs = JSON.parse(logs);
          } else {
            logs = [];
          }

          logs.push(
            {
              logInfo: `${contactEmail} changed status from ${status} to DECLINED`,
              logTimestamp: new Date().toLocaleTimeString("en-US", timeOptions),
            },
            {
              type: "emailStatusChange",
              logInfo: `${contactEmail} changed emailStatus from Not Emailed to Denied`,
              logTimestamp: new Date().toLocaleTimeString("en-US", timeOptions),
            },
            {
              type: "emailContentChange",
              logInfo: `${contactEmail} sent "Denied" email to ${artistName}`,
              emailContent: {
                artistEmail,
                emailSubject,
                emailBody,
              },
              logTimestamp: new Date().toLocaleTimeString("en-US", timeOptions),
            }
          );

          logs = JSON.stringify(logs);
          submission.logs = logs;

          await _sendDeniedEmail(artistEmail, id, title, logs);
        });

        await axios.put(
          "/api/admin/submissions/status-to-declined",
          { selectedSubmissionsArr },
          {
            headers: { Authorization: `JWT ${token}` },
          }
        );

        setTimeout(() => {
          axios.delete("/api/admin/submissions/declined-all-art-files", {
            headers: {
              Authorization: `JWT ${token}`,
            },
          });
        }, 1000);

        _getSubmissions(status);

        Swal.fire({
          title: "The art files have been deleted and emails have been sent!",
          icon: "success",
        });
      } else {
        Swal.fire("The submissions were not declined.");
      }
    });
  };

  const _sendDeniedEmail = async (artistEmail, id, title, logs) => {
    const deniedEmailSubject = "We're sorry but your submission was declined.";
    const deniedEmailBody = `After reviewing your submission, ${title}, we've decided not to print your design at this time.<br/><br/>We receive a large number of high quality submissions on a daily basis and we can only choose a select few. Even when our basic design guidelines are met, sometimes it comes down to whether a design will resonate with the TeeFury audience to a level that will benefit both the artist and the site.<br/><br/>Please don't be discouraged! We appreciate every submission, and do hope to see more designs from you in the future.<br/><br/>Thanks for submitting!<br/><br/>The TeeFury Team`;

    const reqBody = {
      artistEmail,
      subject: deniedEmailSubject,
      emailStatus: "Denied",
      emailColor: '{"color": "#ff0000"}',
      htmlContent: deniedEmailBody,
      logs,
    };

    try {
      await axios.put(`/api/admin/email/${id}`, reqBody, {
        headers: { Authorization: `JWT ${token}` },
      });
    } catch (error) {
      Swal.fire("Email(s) not sent. Please try again.");
    }
  };

  const handleAutocompleteChange = (event, { newValue, method }) => {
    setState({
      ...state,
      search: newValue,
    });
  };

  const handleAutocompleteSearch = async (event) => {
    event.preventDefault();

    try {
      let submissionsArr;
      if (status === "DECLINED") {
        submissionsArr = await _getDeclinedSubmissionsByDate(
          startDate,
          endDate
        );
      } else {
        submissionsArr = await _getSubmissions(status);
      }

      if (search !== "") {
        const filteredArr = submissionsArr.filter(
          (element) =>
            element.title.toLowerCase() === search.toLowerCase() ||
            element.artistName.toLowerCase() === search.toLowerCase() ||
            new Date(element.createdAt).toLocaleDateString("en-US", {
              timezone: "UTC",
            }) === search ||
            element.emailStatus.toLowerCase() === search.toLowerCase()
        );

        setSubmissionsArr(filteredArr);
      }
    } catch (error) {
      Swal.fire("Something went wrong. Please try again.");
    }
  };

  const toggleFilterArea = () => {
    const { isShowingFilter } = state;
    setState({ ...state, isShowingFilter: !isShowingFilter });
  };

  const handleSelectArtCard = (event) => {
    if (status === "NEW" || status === "PENDING") {
      const {
        id,
        dataset: { selected },
      } = event.currentTarget;

      submissionsArr.forEach((submission) => {
        if (submission.id === +id) {
          if (selected === "false") {
            submission.isSelected = true;
            selectionCount++;
          } else {
            submission.isSelected = false;
            selectionCount--;
          }
        }
      });

      setSubmissionsArr(submissionsArr);
      setSelectionCount(selectionCount);
    }
  };

  const openAdminArtApproval = (event) => {
    event.stopPropagation();
    const { id } = event.target;
    const index = parseInt(event.target.getAttribute("data-index"), 10);
    const isFlipLeftDisabled = index === 0 ? true : false;
    const isFlipRightDisabled =
      index === submissionsArr.length - 1 ? true : false;

    submissionsArr.forEach((submission) => {
      if (submission.isSelected === true) {
        submission.isSelected = false;
      }
    });

    setSubmissionsArr(submissionsArr);
    setSelectionCount(0);
    setState({
      ...state,
      id: id,
      submissionsArrIndex: index,
      isAdminArtApproval: true,
      isFlipLeftDisabled,
      isFlipRightDisabled,
    });
  };

  const closeAdminArtApproval = () => {
    setState({
      ...state,
      isAdminArtApproval: false,
    });
    setSubmissionsArr([]);

    // Reset array for admin
    const status = _getCurrentPath();
    if (status === "DECLINED") {
      _getDeclinedSubmissionsByDate(startDate, endDate);
    } else {
      _getSubmissions(status);
    }
  };

  const flipLeft = () => {
    if (submissionsArrIndex > 0) {
      let previousIndex = submissionsArrIndex - 1;
      const newCardId = submissionsArr[previousIndex].id;
      let isFlipLeftDisabled = previousIndex === 0 ? true : false;

      setState({
        ...state,
        id: newCardId,
        submissionsArrIndex: previousIndex,
        isFlipLeftDisabled,
        isFlipRightDisabled: false,
      });
    }
  };

  const flipRight = () => {
    if (submissionsArrIndex < submissionsArr.length - 1) {
      let nextIndex = submissionsArrIndex + 1;
      const newCardId = submissionsArr[nextIndex].id;
      const isFlipRightDisabled =
        nextIndex === submissionsArr.length - 1 ? true : false;

      setState({
        ...state,
        id: newCardId,
        submissionsArrIndex: nextIndex,
        isFlipLeftDisabled: false,
        isFlipRightDisabled,
      });
    }
  };

  const handleDateFilter = async ({ startDate, endDate }) => {
    try {
      await _getDeclinedSubmissionsByDate(startDate, endDate);
      setDateRange({
        startDate,
        endDate,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong. Please try again.",
      });
    }

    return;
  };

  return (
    <SubmissionContainer>
      <TabArea>
        <FilterHeader>
          <StatusHeader>
            <h2 style={{ textAlign: "center" }}>{status}</h2>
            {status === "DECLINED" ? (
              <Calendar
                handleDateFilter={handleDateFilter}
                globalStartDate={startDate}
                globalEndDate={endDate}
              />
            ) : (
              ""
            )}
          </StatusHeader>
          <AdjustableIconWrapper onClick={toggleFilterArea}>
            <AdjustablesIcon />
          </AdjustableIconWrapper>
          {isShowingFilter ? (
            <FilterContainer>
              <FilterLink
                to="/admin/art-submissions/new"
                data-filter="NEW"
                status={status === "NEW" ? "selected" : ""}
              >
                NEW
              </FilterLink>
              <FilterLink
                to="/admin/art-submissions/pending"
                data-filter="PENDING"
                status={status === "PENDING" ? "selected" : ""}
              >
                PENDING
              </FilterLink>
              <FilterLink
                to="/admin/art-submissions/reviewed"
                data-filter="REVIEWED"
                status={status === "REVIEWED" ? "selected" : ""}
              >
                REVIEWED
              </FilterLink>
              <FilterLink
                to="/admin/art-submissions/approved"
                data-filter="APPROVED"
                status={status === "APPROVED" ? "selected" : ""}
              >
                APPROVED
              </FilterLink>
              <FilterLink
                to="/admin/art-submissions/declined"
                data-filter="DECLINED"
                status={status === "DECLINED" ? "selected" : ""}
              >
                DECLINED
              </FilterLink>
              <FilterLink
                to="/admin/art-submissions/published"
                data-filter="PUBLISHED"
                status={status === "PUBLISHED" ? "selected" : ""}
              >
                PUBLISHED
              </FilterLink>
            </FilterContainer>
          ) : null}
        </FilterHeader>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <AutocompleteSearch
            search={search}
            handleAutocompleteChange={handleAutocompleteChange}
            handleAutocompleteSearch={handleAutocompleteSearch}
            dropdownArr={dropdownArr}
            submitButton="Search"
            placeholder="Type 'c'"
          />
          {selectionCount > 0 ? (
            <div style={{ marginLeft: "auto" }}>
              <MainButton
                onClick={_deleteAllSelected}
                style={{ width: "250px", borderRadius: "4px" }}
              >
                DECLINE {selectionCount}
                {selectionCount === 1 ? <> SUBMISSION</> : <> SUBMISSIONS</>}
              </MainButton>
            </div>
          ) : (
            ""
          )}
        </div>
        {isAdminArtApproval ? (
          <AdminArtApproval
            id={id}
            closeAdminArtApproval={closeAdminArtApproval}
            flipLeft={flipLeft}
            flipRight={flipRight}
            isFlipLeftDisabled={isFlipLeftDisabled}
            isFlipRightDisabled={isFlipRightDisabled}
          />
        ) : (
          <ArtCardContainer items={submissionsArr.length}>
            {submissionsArr.length > 0 ? (
              <>
                {submissionsArr.map((submissionDetails, i) => (
                  <ArtCard
                    key={i}
                    {...submissionDetails}
                    token={token}
                    index={i}
                    handleSelectArtCard={handleSelectArtCard}
                    openAdminArtApproval={openAdminArtApproval}
                  />
                ))}
              </>
            ) : (
              <h2>No Artwork to be Viewed</h2>
            )}
          </ArtCardContainer>
        )}
      </TabArea>
    </SubmissionContainer>
  );
};

const mapStateToProps = createStructuredSelector({
  userAccount: selectUserAccount,
  token: selectUserJWTToken,
});

export default connect(mapStateToProps)(AdminArtSubmissions);
