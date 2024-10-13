import { Route, Routes } from "react-router-dom";
import { Homepage } from "./pages/home.page";

function App() {
  return (
    <Routes>
      <Route element={<Homepage />} path="/" />
    </Routes>
  );
}

export default App;
