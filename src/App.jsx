import { useState } from "react"; 
import { Routes, Route } from "react-router-dom";
import PostList from "./PostList";
import NewPostForm from "./NewPostForm";
import PostPage from "./PostPage";
import "./App.css"

function App() {
  const [reloadFlag, setReloadFlag] = useState(false);

  const handlePostCreated = () => {
    setReloadFlag(!reloadFlag);
  };

  return (
    <div>
      <h1>🐾 Pet Parade</h1>
      <p>Welcome to the cutest pet forum!</p>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <NewPostForm onPostCreated={handlePostCreated} />
              <PostList reloadFlag={reloadFlag} setReloadFlag={setReloadFlag} />
            </>
          }
        />
        <Route path="/post/:id" element={<PostPage />} />
      </Routes>
    </div>
  );
}

export default App;
