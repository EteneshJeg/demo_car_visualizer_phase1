import { createContext, useContext, useState, useEffect } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    message: "",
    isVisible: false,
    classes: "",
    type: "",
    avatar: "",
    title: "",
    notification: null,
  });

  const showToast = (ms, message, classes = "", type = "", avatar = "", title = "", notification = null) => {
    setToast({
      message,
      isVisible: true,
      classes: `${classes} duration-200 -translate-y-28`,
      type,
      avatar,
      title,
      notification,
    });

    setTimeout(() => {
      setToast((prev) => ({
        ...prev,
        classes: prev.classes.replace(" -translate-y-28", ""),
      }));
      setTimeout(() => {
        setToast((prev) => ({ ...prev, isVisible: false }));
      }, ms);
    }, 500);
  };

  return (
    <ToastContext.Provider value={{ toast, showToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
