import { useToast } from "../store/ToastContext";
import { useNavigate } from "react-router-dom";

const ToastComponent = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const gotoMessage = () => {
    if (toast.notification) {
      navigate(`/chat?username=${toast.notification.sender.username}&itemId=${toast.notification?.reservation?.id}`);
    }
  };

  if (!toast.isVisible) return null;

  return (
    <div
      onClick={toast.type === "message" ? gotoMessage : () => {}}
      className={`transition ease-in-out shadow-lg px-6 py-3 fixed top-4 right-1/2 translate-x-1/2 rounded-lg z-[9999] ${toast.classes}`}
    >
      {toast.type === "message" ? (
        <div className="flex gap-4">
          <div>
            <h2 className="font-bold max-w-[90px] truncate">{toast.title}</h2>
            <p className="ml-2 max-w-[90px] truncate">{toast.message}</p>
          </div>
        </div>
      ) : (
        <div>{toast.message}</div>
      )}
    </div>
  );
};

export default ToastComponent;
