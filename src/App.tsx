import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LinkTasksPage from "./pages/LinkTasksPage/LinkTasksPage";
import NotFoundPage from "./pages/NotFoundPage";
import RedirectPage from "./pages/RedirectPage";
import ViewTaskPage from "./pages/ViewTaskPage";

const App = () => {
  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path={"/sheet/:sheetId/rows/:rowId"} element={<ViewTaskPage />} />
      <Route path={"/rows/link"} element={<LinkTasksPage />} />
      <Route index element={<RedirectPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export { App };
