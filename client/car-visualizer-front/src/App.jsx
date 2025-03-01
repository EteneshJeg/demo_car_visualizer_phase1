import { Routes, Route } from "react-router-dom";
import { useUser } from "./store/UserContext";
import SpinnerComponent from "./components/SpinnerComponent";
import UploadImage from "./pages/UploadImage";
import AuthPage from "./pages/AuthPage";
import ToastComponent from "./components/ToastComponent";
function App() {
  const { isLoading } = useUser();

  return (
    <>
      <Routes>
        <Route path="/" element={<UploadImage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
      {isLoading && <SpinnerComponent />}
      <ToastComponent />

    </>
  );
}

export default App;
