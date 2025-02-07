import { Routes, Route } from "react-router-dom";
import AdminCallbackPage from "@/pages/AdminCallbackPage";
import HomePage from "@/pages/HomePage";
import LinkTasksPage from "@/pages/LinkTasksPage/LinkTasksPage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import RedirectPage from "@/pages/RedirectPage";
import ViewTaskPage from "@/pages/ViewTaskPage";

const App = () => {
  return (
    <Routes>
      <Route index element={<RedirectPage />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/admin/callback" element={<AdminCallbackPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/rows/link" element={<LinkTasksPage />} />
      <Route path="/sheet/:sheetId/rows/:rowId" element={<ViewTaskPage />} />
    </Routes>
  );
}

export { App };
