import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import SyringeLoader from "./feedback/Loader";

const IndexPage = lazy(() => import("./pages/IndexPage"));
const RecordsPage = lazy(() => import("./pages/RecordsPage"));

function App() {
  return (
    <Router>
      <Suspense fallback={<SyringeLoader />}>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/records" element={<RecordsPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
