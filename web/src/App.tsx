import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { WeekPickerPage } from "./pages/WeekPickerPage";
import { SessionPickerPage } from "./pages/SessionPickerPage";
import { ExerciseRunnerPage } from "./pages/ExerciseRunnerPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<WeekPickerPage />} />
        <Route path="/w/:weekId" element={<SessionPickerPage />} />
        <Route path="/w/:weekId/d/:dayId/s/:sessionId" element={<ExerciseRunnerPage />} />
      </Route>
    </Routes>
  );
}
