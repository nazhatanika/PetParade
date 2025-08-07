import { useState } from "react";
import { supabase } from "./supabaseClient";

function NewPostForm({ onPostCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("posts").insert({
      title,
      content,
      image_url: imageUrl,
      upvotes: 0,
    });

    if (error) {
      console.error("Error creating post:", error.message);
    } else {
      setTitle("");
      setContent("");
      setImageUrl("");
      if (onPostCreated) onPostCreated(); // Let parent refresh post list
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a New Pet Post</h2>

      <label>Title:</label>
      <input
        type="text"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label>Content (optional):</label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <label>Image URL (optional):</label>
      <input
        type="url"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Posting..." : "Create Post"}
      </button>
    </form>
  );
}

export default NewPostForm;
