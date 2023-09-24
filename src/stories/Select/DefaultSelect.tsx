import React, { useContext } from "react";
import styled from "styled-components";
import ArrowDownSmallIcon from "src/components/Icon/ArrowDownSmallIcon";
import { SelectContext } from "src/stories/Select/OldSelect";

const SelectBox = styled.div<{
  width?: string;
  selectValidation: boolean;
  disabled: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: ${({ width }) => width || "100%"};
  height: 40px;
  border-radius: 5px;
  padding: 0 10px;
  opacity: ${({ disabled }) => (disabled ? "0.6" : "")};
  border: ${({ selectValidation }) => `
    1px solid ${selectValidation ? "#d8d8d8" : "#ff4c4c"}
  `};
  cursor: ${({ disabled }) => (disabled ? "default" : "")};
  background-color: ${({ disabled }) => (disabled ? "#f7f7f7" : "")};
`;

interface DefaultSelectProps {
  width?: string;
  selectValidation?: boolean;
  renderSelectContent: () => string | number;
}

const DefaultSelect = ({
  width,
  selectValidation = true,
  renderSelectContent,
}: DefaultSelectProps) => {
  const { disabled } = useContext(SelectContext);

  return (
    <SelectBox
      selectValidation={selectValidation}
      disabled={disabled}
      width={width}
    >
      {renderSelectContent && typeof renderSelectContent === "function"
        ? renderSelectContent()
        : ""}
      <ArrowDownSmallIcon width="12px" height="10px" />
    </SelectBox>
  );
};

export default DefaultSelect;
