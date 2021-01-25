import React, { useState, useEffect } from "react";

import teefuryBirdLogo from "../../assets/teefury-bird.jpg";

import MailOutlineIcon from "@material-ui/icons/MailOutline";

import {
  CardContainer,
  CardWrapper,
  ImgCard,
  CardFooter,
  Figcaption,
  ArtTitle,
  Caption,
  ArtHeaders,
} from "./art-submissions-card.styles";

const AdminArtCard = (props) => {
  const {
    token,
    previewArt,
    id,
    index,
    artistName,
    title,
    emailColor,
    createdAt,
    handleSelectArtCard,
    openAdminArtApproval,
    isSelected,
  } = props;
  const [imageSrc, setImageSrc] = useState("");
  const [emailStatusColor, setEmailStatusColor] = useState({
    color: "#6a6a6a",
  });

  useEffect(
    () => {
      const controller = new AbortController();
      const signal = controller.signal;
      const fetchImage = () => {
        const thumbImg = `/api/art-submissions-thumb/?src=${previewArt.substring(
          20
        )}`;
        fetch(thumbImg, { signal, headers: { Authorization: `JWT ${token}` } })
          .then((res) => {
            return res.blob();
          })
          .then((blob) => {
            setImageSrc(URL.createObjectURL(blob));
          })
          .catch((error) => {
            // console.error(error);
          });
      };
      
      if (!previewArt) {
        setImageSrc(teefuryBirdLogo);
      } else {
        fetchImage();
      }

      _changeEmailStatusColor();
      return () => {
        controller.abort();
      };
    },
    //eslint-disable-next-line
    [token, previewArt]
  );

  const _changeEmailStatusColor = () => {
    const emailStatusColor = JSON.parse(emailColor);
    if (emailStatusColor.color === "#6a6a6a") {
      setEmailStatusColor({ color: "white", opacity: 0 });
    } else {
      setEmailStatusColor(emailStatusColor);
    }
  };

  return (
    <CardContainer>
      <CardWrapper
        onClick={handleSelectArtCard}
        id={id}
        style={{ margin: "18px 15px" }}
        data-selected={isSelected}
      >
        <ImgCard
          src={imageSrc ? imageSrc : teefuryBirdLogo}
          alt={title}
          loaded={imageSrc ? "true" : ""}
        />
        <Figcaption>
          <ArtTitle style={{ fontSize: "16px" }}>
            {title.toUpperCase()}
          </ArtTitle>
          <Caption>Artist:</Caption>
          <ArtHeaders>{artistName}</ArtHeaders>
          <Caption>Submitted on:</Caption>
          <ArtHeaders style={{ fontSize: "14px" }}>
            {new Date(createdAt).toLocaleDateString()}
          </ArtHeaders>
          <MailOutlineIcon style={emailStatusColor} />
        </Figcaption>
        <CardFooter id={id} data-index={index} onClick={openAdminArtApproval}>
          Review Artwork
        </CardFooter>
      </CardWrapper>
    </CardContainer>
  );
};

export default AdminArtCard;
