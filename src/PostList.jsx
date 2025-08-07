import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { Link } from "react-router-dom";

function PostList({ reloadFlag, setReloadFlag }) {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("created_at");

  useEffect(() => {
    const fetchPosts = async () => {
      let query = supabase.from("posts").select("*");

      // Apply sorting
      if (sortOption === "created_at" || sortOption === "upvotes") {
        query = query.order(sortOption, { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        setPosts(data);
      }
    };

    fetchPosts();
  }, [reloadFlag, sortOption]);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpvote = async (id, currentUpvotes) => {
    const { error } = await supabase
      .from("posts")
      .update({ upvotes: currentUpvotes + 1 })
      .eq("id", id);

    if (error) {
      console.error("Failed to upvote:", error.message);
    } else {
      setReloadFlag(!reloadFlag); // re-fetch posts
    }
  };

  return (
    <div className="post-list">
      <h2>Pet Feed</h2>

      {/* 🔍 Search and 🔃 Sort */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: "0.5rem", width: "60%", marginRight: "1rem" }}
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={{ padding: "0.5rem" }}
        >
          <option value="created_at">Sort by Date</option>
          <option value="upvotes">Sort by Upvotes</option>
        </select>
      </div>

      {filteredPosts.length === 0 && <p>No posts found!</p>}

      {filteredPosts.map((post) => (
        <div className="post" key={post.id}>
          <h3>
            <Link to={`/post/${post.id}`}>{post.title}</Link>
          </h3>
          {post.image_url && (
            <img className="post-image" src={post.image_url} alt="Pet" />
          )}

          {post.content && <p>{post.content}</p>}

          <p><strong>Upvotes:</strong> {post.upvotes}</p>
          <button onClick={() => handleUpvote(post.id, post.upvotes)}>Upvote</button>

          <p><strong>Date:</strong> {new Date(post.created_at).toLocaleString()}</p>

          {/* Comments */}
          <CommentList postId={post.id} reloadFlag={reloadFlag} />
          <CommentForm postId={post.id} onCommentAdded={() => setReloadFlag(!reloadFlag)} />
        </div>
      ))}
    </div>
  );
}

export default PostList;

function CommentForm({ postId, onCommentAdded }) {
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text.trim() === "") return;

    const { error } = await supabase
      .from("comments")
      .insert({ post_id: postId, content: text });

    if (error) {
      console.error("Error adding comment:", error.message);
    } else {
      setText("");
      onCommentAdded();
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "0.5rem" }}>
      <input
        type="text"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">Comment</button>
    </form>
  );
}

function CommentList({ postId, reloadFlag }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching comments:", error.message);
      } else {
        setComments(data);
      }
    };

    fetchComments();
  }, [postId, reloadFlag]);

  return (
    <div style={{ marginTop: "1rem" }}>
      <h4>Comments</h4>
      {comments.length === 0 && <p>No comments yet.</p>}
      {comments.map((comment) => (
        <p key={comment.id}>
          💬 {comment.content} <br />
          <small>{new Date(comment.created_at).toLocaleString()}</small>
        </p>
      ))}
    </div>
  );
}