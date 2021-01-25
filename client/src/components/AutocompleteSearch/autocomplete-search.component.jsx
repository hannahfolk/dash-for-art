/* eslint-disable no-use-before-define */
import React, { useState } from "react";
import Autosuggest from "react-autosuggest";

import { MainButton } from "../Button";

import "./autocomplete-styles.css";

// class AutocompleteSearch extends Component {
const AutocompleteSearch = (props) => {
  const {
    search,
    handleAutocompleteChange,
    handleAutocompleteSearch,
    dropdownArr,
    submitButton,
    placeholder
  } = props;
  const [suggestions, setSuggestions] = useState([]);

  const _escapeRegexCharacters = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const _getSuggestions = (value) => {
    const escapedValue = _escapeRegexCharacters(value.trim());

    if (escapedValue === "") {
      return [];
    }

    const regex = new RegExp("^" + escapedValue, "i");

    return dropdownArr
      .map((section) => {
        return {
          title: section.title,
          elements: section.elements.filter((element) => regex.test(element)),
        };
      })
      .filter((section) => section.elements.length > 0);
  };

  const _getSuggestionValue = (suggestion) => {
    return suggestion;
  };

  const _renderSuggestion = (suggestion) => {
    return <span>{suggestion}</span>;
  };

  const _renderSectionTitle = (section) => {
    return <strong>{section.title}</strong>;
  };

  const _getSectionSuggestions = (section) => {
    return section.elements;
  };

  const _onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(_getSuggestions(value));
  };

  const _onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const inputProps = {
    placeholder,
    value: search,
    onChange: handleAutocompleteChange,
  };

  return (
    <form
      style={{
        width: "400px",
        display: "flex",
        flexDirection: "row",
        position: "relative",
        marginBottom: "20px",
      }}
      onSubmit={handleAutocompleteSearch}
    >
      <Autosuggest
        multiSection={true}
        suggestions={suggestions}
        onSuggestionsFetchRequested={_onSuggestionsFetchRequested}
        onSuggestionsClearRequested={_onSuggestionsClearRequested}
        getSuggestionValue={_getSuggestionValue}
        renderSuggestion={_renderSuggestion}
        renderSectionTitle={_renderSectionTitle}
        getSectionSuggestions={_getSectionSuggestions}
        inputProps={inputProps}
      />
      <MainButton
        style={{
          width: "125px",
          height: "52px",
          marginLeft: "5px",
          borderRadius: "4px",
          position: "absolute",
          top: "0px",
        }}
      >
        {submitButton}
      </MainButton>
    </form>
  );
};

export default AutocompleteSearch;
