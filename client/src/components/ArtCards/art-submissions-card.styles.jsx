import styled, { css } from "styled-components";
import { LazyLoadImage } from "react-lazy-load-image-component";

export const CardContainer = styled.div`
  max-width: 400px;
`;

export const CardWrapper = styled.figure`
  position: relative;
  transition: transform 0.2s ease-in-out;
  display: flex;
  border-radius: 28px;
  ${(p) =>
    p["data-selected"]
      ? css`
          background-color: #dedddd;
        `
      : css`
          background-color: #fff;
        `}

  .title {
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    top: -16px;
    left: 0;
    width: 100%;
    text-align: center;
    padding: 20px 0;
    border-radius: 28px 28px 0 0;
    display: none;
  }

  &:hover {
    transform: scale(1.2);

    .title,
    figcaption {
      display: initial;
    }
  }
`;

export const ImgCard = styled(LazyLoadImage)`
  ${(p) =>
    p.loaded
      ? css`
          box-shadow: 0px 7px 16px 2px rgba(0, 0, 0, 0.2);
          /* max-height: 250px; */
          /* max-width: 140px; */
          width: 100%;
          max-width: 150px;
        `
      : css`
          max-height: 110px;
          max-width: 110px;
        `}
  border-radius: 25px;
  height: 100%;
`;

export const CardFooter = styled.figcaption`
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  bottom: 2px;
  left: 0;
  width: 100%;
  text-align: center;
  padding: 20px 0;
  border-radius: 0px 0px 28px 28px;
  cursor: pointer;
  display: none;
`;

export const Figcaption = styled.figcaption`
  margin-left: 20px;
`;

export const ArtTitle = styled.h2`
  font-family: sans-serif;
`;

export const ArtHeaders = styled.h3`
  margin-top: 0;
`;

export const Caption = styled.span`
  font-size: 12px;
`;
