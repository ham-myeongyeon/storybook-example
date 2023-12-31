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
  triggerNode: HTMLButtonElement | null;
  setTriggerNode: React.Dispatch<HTMLButtonElement | null>;
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
  const [triggerNode, setTriggerNode] =
    React.useState<HTMLButtonElement | null>(null);

  const SelectContextValue: SelectContext = React.useMemo(
    () => ({
      isOpen,
      setIsOpen,
      selectedOption,
      setSelectedOption,
      defaultValue,
      placeholder,
      triggerNode,
      setTriggerNode,
    }),
    [isOpen, setIsOpen, selectedOption, defaultValue, placeholder, triggerNode]
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

interface TriggerProps extends React.PropsWithChildren {
  focusedStyle?: string;
}

const Trigger: React.FC<TriggerProps> = (props) => {
  const { children, focusedStyle } = props;
  const { isOpen, setIsOpen, setTriggerNode } = React.useContext(SelectContext);
  const [isFocused, setIsFocused] = React.useState<boolean>(false);

  const handleClickSelect = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      setIsOpen(!isOpen);
    },
    [isOpen]
  );

  return (
    <button
      onFocus={(e) => {
        e.stopPropagation();
        setIsFocused(true);
      }}
      onBlur={(e) => {
        e.stopPropagation();
        setIsFocused(false);
      }}
      ref={(node) => setTriggerNode(node)}
      onClick={(e) => handleClickSelect(e)}
      className={`${isFocused ? focusedStyle ?? "border-black	" : ""}`}
    >
      {children}
    </button>
  );
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

interface ContentProps extends React.PropsWithChildren {
  contentAlignHorizontal?: "left" | "center" | "right";
}

const Content: React.FC<ContentProps> = (props) => {
  const { contentAlignHorizontal = "center", children } = props;
  const { isOpen, triggerNode, setIsOpen } = React.useContext(SelectContext);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const controlContentPosition = () => {
      if (!triggerNode || !contentRef.current) return;
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      contentRef.current.style.top = `${
        triggerNode?.getBoundingClientRect().bottom + scrollTop
      }px`;

      switch (contentAlignHorizontal) {
        case "left":
          contentRef.current.style.left = `${
            triggerNode?.getBoundingClientRect().left
          }px`;
          break;
        case "center":
          contentRef.current.style.left = `
            ${
              triggerNode?.getBoundingClientRect().left +
              triggerNode.getBoundingClientRect().width / 2
            }px
          `;
          contentRef.current.style.transform = "translateX(-50%)";
          break;
        case "right":
          contentRef.current.style.left = `${
            triggerNode.getBoundingClientRect().right -
            contentRef.current.getBoundingClientRect().width
          }px`;
          break;
      }
    };

    controlContentPosition();

    window.addEventListener("resize", controlContentPosition);

    return () => {
      window.removeEventListener("resize", controlContentPosition);
    };
  }, [triggerNode, contentRef.current, isOpen, contentAlignHorizontal]);

  const handleClickOutside = React.useCallback(
    (e: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    },
    [contentRef.current]
  );

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contentRef]);

  return (
    <>
      {createPortal(
        <div
          className={`${
            isOpen ? "visible" : "invisible"
          } absolute z-10 max-w-xs`}
          ref={contentRef}
        >
          {children}
        </div>,
        // 스토리북 docs 노드
        document.getElementById("storybook-docs")!
      )}
    </>
  );
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
  const { defaultValue, selectedOption, setSelectedOption, isOpen, setIsOpen } =
    React.useContext(SelectContext);

  const saveOption = React.useCallback(() => {
    const current = new Map();
    current.set(value, children);
    setSelectedOption(current);
  }, []);

  const closeSelect = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleClickOption = React.useCallback(
    (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
      e.stopPropagation();
      closeSelect();
      if (selectedOption?.get(value)) return;
      saveOption();
    },
    [selectedOption, closeSelect, saveOption]
  );

  React.useEffect(() => {
    if (!defaultValue) return;
    if (defaultValue !== value) return;

    saveOption();
  }, [defaultValue]);

  return <li onClick={handleClickOption}>{children}</li>;
};

const Root = Select;

export { Root, Trigger, Value, Content, Option };

export default Select;
