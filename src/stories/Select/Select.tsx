import React from "react";

/*
 * Select
 */

type OptionMap = Map<string | number, string | React.ReactNode>;
interface SelectContext {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  optionMapRef: React.MutableRefObject<OptionMap | null>;
}

const SelectContext = React.createContext<SelectContext>({} as SelectContext);

interface SelectProps extends React.PropsWithChildren {}

const Select: React.FC<SelectProps> = (props) => {
  const { children } = props;
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const optionMapRef = React.useRef<OptionMap | null>(null);

  const SelectContextValue: SelectContext = React.useMemo(
    () => ({
      isOpen,
      setIsOpen,
      optionMapRef,
    }),
    [isOpen, setIsOpen]
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

interface TriggerProps {}

const Trigger: React.FC<TriggerProps> = (props) => {
  const {} = props;
  const { isOpen, setIsOpen } = React.useContext(SelectContext);

  const handleClickSelect = () => {
    setIsOpen(!isOpen);
  };

  return <button onClick={handleClickSelect}></button>;
};

/*
 * Value
 */

interface ValueProps {}

const Value: React.FC<ValueProps> = (props) => {
  const {} = props;
  const {} = React.useContext(SelectContext);

  return <div></div>;
};

/*
 * Content
 */

interface ContentProps {}

const Content: React.FC<ContentProps> = (props) => {
  const {} = props;

  return <div></div>;
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
  const { optionMapRef } = React.useContext(SelectContext);

  React.useEffect(() => {
    if (!optionMapRef?.current) {
      optionMapRef.current = new Map();
    }

    optionMapRef.current.set(value ?? children, children);
  }, []);

  return <option value={value}>{children}</option>;
};

const Root = Select;

export { Root, Trigger, Value, Content, Option };

export default Select;
