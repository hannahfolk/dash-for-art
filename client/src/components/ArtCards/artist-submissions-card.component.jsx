import React, { useState, useEffect } from "react";
import teefuryBirdLogo from "../../assets/teefury-bird.jpg";

import {
  CardContainer,
  CardWrapper,
  ImgCard,
  CardFooter,
} from "./art-submissions-card.styles";

const ArtistArtCard = ({
  token,
  previewArt,
  status,
  id,
  index,
  title,
  openSubmissionsEdit,
}) => {
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchImage = () => {
      const thumbImg = `/api/art-submissions-thumb/?src=${previewArt.substring(
        20
      )}&w=180`;
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

    return () => {
      controller.abort();
    };
  }, [token, previewArt]);

  return (
    <CardContainer>
      <CardWrapper>
        <ImgCard
          src={imageSrc ? imageSrc : teefuryBirdLogo}
          alt={title}
          loaded={imageSrc ? "true" : ""}
          style={{ maxWidth: "180px" }}
        />
        <p className="title">{title}</p>
        {status === "NEW" || status === "PENDING" ? (
          <CardFooter id={id} data-index={index} onClick={openSubmissionsEdit}>
            VIEW OR EDIT
          </CardFooter>
        ) : null}
      </CardWrapper>
    </CardContainer>
  );
};

export default ArtistArtCard;
