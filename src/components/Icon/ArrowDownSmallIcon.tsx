import React from "react";
import Icon from "./Index";

interface ArrowDownSmallIconProps {
  width?: string;
  height?: string;
}

const ArrowDownSmallIcon = ({
  width,
  height,
  ...restProps
}: ArrowDownSmallIconProps) => (
  <Icon
    src="/image/new_icon/arrow-down-small.svg"
    width={width}
    height={height}
    {...restProps}
  />
);

export default ArrowDownSmallIcon;
