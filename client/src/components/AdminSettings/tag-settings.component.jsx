import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectUserJWTToken } from "../../redux/user/user.selector";

import axios from "axios";
import Swal from "sweetalert2";

import CloseIcon from "@material-ui/icons/Close";

import { default as AddTagInput } from "../AutocompleteSearch";

import { TagsContainer, Tag } from "./admin-settings.styles";

const TagSettings = (props) => {
  const { token } = props;
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState([]);

  useEffect(
    () => {
      _getTags();
    },
    // eslint-disable-next-line
    []
  );

  const _getTags = async () => {
    try {
      const {
        data: { tagsArr },
      } = await axios.get("/api/admin/settings/tags", {
        headers: { Authorization: `JWT ${token}` },
      });
      tagsArr.sort((a, b) => (a.tag > b.tag ? 1 : -1));
      setTags(tagsArr);
    } catch (error) {
      Swal.fire("Something went wrong while getting tags. Please try again.");
    }
  };

  const _handleInputChange = (event, { newValue, method }) => {
    setTag(newValue);
  };

  const _handleSaveTags = async (event) => {
    event.preventDefault();

    try {
      await axios.post(
        "/api/admin/settings/tags",
        { tag },
        {
          headers: { Authorization: `JWT ${token}` },
        }
      );

      _getTags();

      setTag("");
    } catch (error) {
      Swal.fire("Something went wrong while adding a tag. Please try again.");
    }
  };

  const _handleDeleteTag = async (event) => {
    const { id } = event.currentTarget;

    try {
      await axios.delete(`/api/admin/settings/tags/${id}`, {
        headers: { Authorization: `JWT ${token}` },
      });

      _getTags();
    } catch (error) {
      Swal.fire("Something went wrong while deleting a tag. Please try again.");
    }
  };

  return (
    <div>
      <h1>Tags</h1>
      <p>
        Please enter any tags you would like to filter out of the commissions
        table.
      </p>
      <p>Note: Tags are case and hyphen sensitive.</p>
      <AddTagInput
        search={tag}
        handleAutocompleteChange={_handleInputChange}
        handleAutocompleteSearch={_handleSaveTags}
        dropdownArr={[]}
        submitButton="Add a tag"
        placeholder="e.g. 'Replacement'"
      />
      <TagsContainer>
        {tags.map(({ tag, id }) => (
          <Tag key={id}>
            {tag}
            <CloseIcon
              style={{
                marginLeft: "10px",
                color: "#8193a2",
                fontSize: "16px",
              }}
              onClick={_handleDeleteTag}
              id={id}
            />
          </Tag>
        ))}
      </TagsContainer>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectUserJWTToken,
});

export default connect(mapStateToProps)(TagSettings);
