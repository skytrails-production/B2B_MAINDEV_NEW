import React, { createContext, useState, useContext } from "react";

const PopoverContext = createContext();

export const usePopover = () => useContext(PopoverContext);

export const PopoverProvider = ({ children }) => {
  const [openPopover, setOpenPopover] = useState(null);

  const open = (id) => setOpenPopover(id);
  const close = () => setOpenPopover(null);

  const value = { openPopover, open, close };

  return <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>;
};
