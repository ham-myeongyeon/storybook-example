import React, { createContext } from "react";


/*
* Select
*/

interface SelectContext {};

const SelectContext = React.createContext<SelectContext>({});

interface SelectProps extends React.PropsWithChildren {}

const Select: React.FC<SelectProps> = (props) => {
  const { children } = props;
  const SelectContextValue: SelectContext = React.useMemo({
    
  }. []);


  return (
    <>
      <SelectContext.Provider value={SelectContextValue}>{children}</SelectContext.Provider>
    </>
  );
};

/*
*  Trigger
*/

interface TriggerProps {};

const Trigger: React.FC<TriggerProps> = (props) => {
  const {} = props;
  const {} = React.useContext(SelectContext);

  return <div></div>
}

/*
*  Value
*/

interface ValueProps {};

const Value: React.FC<ValueProps> = (props) => {
  const {} = props;
  const {} = React.useContext(SelectContext);

  return <div></div>
}

/*
*  Option
*/

interface OptionProps {};

const Option: React.FC<OptionProps> = (props) => {
  const {} = props;
  const {} = React.useContext(SelectContext);

  return <div></div>
}


export {
  Select,
  Trigger,
  Value,
  Option
}

export default Select;
