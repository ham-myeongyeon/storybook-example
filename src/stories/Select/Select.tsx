import React, {
  ChangeEvent,
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
} from "react";
import styled, {
  css,
  DefaultTheme,
  FlattenInterpolation,
  ThemeProps,
} from "styled-components";
import * as MuiSelect,{ SelectProps } from "@mui/base/Select";
import Popper from "@mui/base/Popper";
import Option, { OptionProps } from "@mui/base/Option";
import DefaultSelect from "./DefaultSelect";

interface SelectContextProps {
  selectedId: string | number;
  disabled: boolean;
}

export const SelectContext = createContext<SelectContextProps>({
  selectedId: "",
  disabled: false,
});

const Wrapper = styled.div<{ selectMinWidth: string }>`
  min-width: ${({ selectMinWidth }) =>
    selectMinWidth ? `${selectMinWidth}` : ""};

  .MuiSelect-root {
    min-width: ${({ selectMinWidth }) =>
      selectMinWidth ? `${selectMinWidth}` : ""};
  }
`;

interface StyledSelectProps extends SelectProps<any, any> {}

const StyledSelect = styled(MuiSelect)<StyledSelectProps>``;

const ListBoxDefaultStyle = css`
  background-color: white;
  overflow: auto;
  list-style-type: none;
  max-height: 50vh;
  border: 1px solid #333333;
  border-radius: 5px;
  padding: 4px;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);

  ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
`;

const StyledListBox = styled("ul")<{
  listBoxStyle?: FlattenInterpolation<ThemeProps<DefaultTheme>>;
}>`
  ${ListBoxDefaultStyle};

  ${({ listBoxStyle }) => listBoxStyle};
`;

const StyledPopper = styled(Popper)<{ buttonBoxWidth: number }>`
  z-index: 100;
  min-width: ${({ buttonBoxWidth }) => `${buttonBoxWidth || ""}px`};
`;

const ButtonBox = styled.div`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const OptionDefaultStyle = (selected: boolean) =>
  css`
    border-radius: 5px;
    padding: 5px 12px;
    font-weight: 500;
    font-size: 1.4rem;
    clear: both;
    white-space: nowrap;
    cursor: pointer;
    background-color: ${({ theme }) => selected && theme.button.color.option};

    &:hover {
      background-color: ${({ theme }) => theme.button.color.option};
    }
  `;

interface StyledOptionProps extends OptionProps<any> {
  optionStyle: FlattenInterpolation<ThemeProps<DefaultTheme>>;
  selected: boolean;
}

const StyledOption = styled(Option)<StyledOptionProps>`
  ${({ selected }) => OptionDefaultStyle(selected)};

  ${({ optionStyle }) => optionStyle};
`;

interface CustomOptionProps extends PropsWithChildren<unknown> {
  optionId: string | number;
  optionStyle?: FlattenInterpolation<ThemeProps<DefaultTheme>>;
}

/*
- optionId: 현재 option의 optionId값, option value, label에 들어가는 값을 생각하면 된다.
- selectedId: 상위에서 선택된 optionId 상태값을 넣는다.
- optionStyle: 선택사항으로 option의 스타일을 지정할 때 styled-components의 css를 이용해서 전달한다.
 */
const CustomOption = ({
  optionId,
  optionStyle,
  children,
  ...restProps
}: CustomOptionProps) => {
  const { selectedId } = useContext(SelectContext);

  return (
    <StyledOption
      label={optionId}
      value={optionId}
      selected={selectedId === optionId}
      optionStyle={optionStyle}
      {...restProps}
    >
      {children}
    </StyledOption>
  );
};

interface SelectProps extends PropsWithChildren<unknown> {
  selectWidth?: string;
  renderButton:  React.ReactNode;
  listBoxStyle?: FlattenInterpolation<ThemeProps<DefaultTheme>>;
  onChangeSelect: (optionId: string) => void;
  selectedId: string | number;
  disabled?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

/*
- renderButton: select로 표현될 버튼 컴포넌트
- listBoxStyle: listBox의 스타일로 선택적 옵션, styled-components의 css로 넣어주면 된다.
- onChangeSelect: select의 onChange이벤트로 선택된 optionId로 이벤트를 수행한다.
 */
export const Select = (props: SelectProps) => {
  const {
    selectWidth = "100%",
    renderButton,
    onChangeSelect,
    listBoxStyle,
    selectedId,
    disabled = false,
    children,
    onFocus: handleFocus,
    onBlur: handleBlur,
    ...restProps
  } = props;
  const buttonBoxRef = React.useRef<HTMLElement>(null);
  const popperRef = React.useRef<HTMLElement>(null);

  const selectContextValue = React.useMemo(
    () => ({
      selectedId,
      disabled,
    }),
    [selectedId, disabled]
  );

  const slots = React.useMemo(
    () => ({
      popper: ({ ...restPopperProps }) => (
        <StyledPopper
          ref={popperRef}
          modifiers={[
            {
              name: "flip",
              options: {
                altBoundary: true,
              },
            },
            {
              name: "preventOverflow",
              options: {
                altAxis: true,
                tether: true,
                tetherOffset: () => 20,
              },
            },
          ]}
          buttonBoxWidth={buttonBoxRef?.current?.getBoundingClientRect()?.width}
          {...restPopperProps}
        />
      ),
      listbox: ({ ...listBoxProps }) => (
        <StyledListBox {...listBoxProps} listBoxStyle={listBoxStyle} />
      ),
    }),
    [listBoxStyle]
  );

  const handleChangeSelect = (e: ChangeEvent, optionId: string | number) => {
    if (!e) return;

    e.stopPropagation();
    if (onChangeSelect) {
      onChangeSelect(optionId);
    }
  };

  return (
    <SelectContext.Provider value={selectContextValue}>
      <Wrapper selectMinWidth={selectWidth}>
        <StyledSelect
          slots={slots}
          renderValue={() => (
            <ButtonBox ref={buttonBoxRef}>{renderButton}</ButtonBox>
          )}
          disabled={disabled}
          onFocus={handleFocus}
          onChange={handleChangeSelect}
          onBlur={handleBlur}
          {...restProps}
        >
          {children}
        </StyledSelect>
      </Wrapper>
    </SelectContext.Provider>
  );
};

Select.DefaultSelect = DefaultSelect;
Select.Option = CustomOption;

export default Select;
