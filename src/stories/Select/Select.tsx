import React from "react";
import { createPortal } from "react-dom";

/*
 * Select
 */

type OptionId = string | number;
type OptionContent = string | React.ReactNode;
type OptionMap = Map<OptionId, OptionContent>;

interface SelectContext {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedOption: OptionMap | null;
  setSelectedOption: React.Dispatch<React.SetStateAction<OptionMap | null>>;
  defaultValue?: OptionId;
  placeholder?: string;
}

const SelectContext = React.createContext<SelectContext>({} as SelectContext);

interface SelectProps extends React.PropsWithChildren {
  defaultValue?: OptionId;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = (props) => {
  const { defaultValue, placeholder, children } = props;
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [selectedOption, setSelectedOption] = React.useState<OptionMap | null>(
    null
  );

  const SelectContextValue: SelectContext = React.useMemo(
    () => ({
      isOpen,
      setIsOpen,
      selectedOption,
      setSelectedOption,
      defaultValue,
      placeholder,
    }),
    [isOpen, setIsOpen, selectedOption, defaultValue, placeholder]
  );

  return (
    <>
      <SelectContext.Provider value={SelectContextValue}>
        {children}
      </SelectContext.Provider>
    </>
  );
};

/*
 * Trigger
 */

interface TriggerProps extends React.PropsWithChildren {}

const Trigger: React.FC<TriggerProps> = (props) => {
  const { children } = props;
  const { isOpen, setIsOpen } = React.useContext(SelectContext);

  const handleClickSelect = () => {
    setIsOpen(!isOpen);
  };

  return <button onClick={handleClickSelect}>{children}</button>;
};

/*
 * Value
 */

interface ValueProps {}

const Value: React.FC<ValueProps> = () => {
  const { selectedOption, placeholder } = React.useContext(SelectContext);
  const currentValue = selectedOption?.values().next().value ?? placeholder;

  return <span>{currentValue}</span>;
};

/*
 * Content
 */

interface ContentProps extends React.PropsWithChildren {}

const Content: React.FC<ContentProps> = (props) => {
  const { children } = props;
  const { isOpen } = React.useContext(SelectContext);

  return <>{isOpen && createPortal(<div>{children}</div>, document.body)}</>;
};

/*
 * Option
 */

interface OptionProps extends React.PropsWithChildren {
  value: string | number;
  children: React.ReactNode | string;
}

const Option: React.FC<OptionProps> = (props) => {
  const { value, children } = props;
  const { defaultValue, selectedOption, setSelectedOption } =
    React.useContext(SelectContext);

  const handleClickOption = () => {
    if (selectedOption?.get(value)) return;

    const current = new Map();
    current.set(value, children);
    setSelectedOption(current);
  };

  React.useEffect(() => {
    if (!defaultValue) return;
    if (defaultValue !== value) return;

    const current = new Map();
    current.set(value, children);
    setSelectedOption(current);
  }, [defaultValue]);

  return (
    <option value={value} onClick={handleClickOption}>
      {children}
    </option>
  );
};

const Root = Select;

export { Root, Trigger, Value, Content, Option };

export default Select;
