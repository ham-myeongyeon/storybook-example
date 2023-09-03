import React from "react";
import styled from "styled-components";

interface IconProps {
  src: string;
  width?: string;
  height?: string;
  backgroundSize?: string;
  objectFit?: string;
}

const IconWrapper = styled.img<IconProps>`
  display: inline-flex;
  width: ${({ width }) => width && width};
  height: ${({ height }) => height && height};
  //background: ${({ src }) => src && `url(${src}) 100% 100%`};
  object-fit: ${({ objectFit }) => objectFit};
  background-size: ${({ backgroundSize }) =>
    backgroundSize && `${backgroundSize}`};
`;

const Icon = ({
  src,
  width = "100%",
  height = "100%",
  backgroundSize = "cover",
  objectFit,
  ...restProps
}: IconProps) => (
  <IconWrapper
    src={src}
    width={width}
    height={height}
    backgroundSize={backgroundSize}
    objectFit={objectFit}
    {...restProps}
  />
);

export default Icon;
