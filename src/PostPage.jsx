import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { supabase } from "./supabaseClient"

export default function PostPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [newTitle, setNewTitle] = useState("")
  const [newContent, setNewContent] = useState("")
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single()
      if (error) console.error(error)
      else {
        setPost(data)
        setNewTitle(data.title)
        setNewContent(data.content)
      }
    }
    fetchPost()
  }, [id])

  const handleDelete = async () => {
    const { error } = await supabase.from("posts").delete().eq("id", id)
    if (error) {
      console.error("Delete failed:", error)
    } else {
      navigate("/") // redirect to home page
    }
  }

  const handleUpdate = async () => {
    const { error } = await supabase
      .from("posts")
      .update({ title: newTitle, content: newContent })
      .eq("id", id)

    if (error) {
      console.error("Update failed:", error)
    } else {
      setPost({ ...post, title: newTitle, content: newContent })
      setEditing(false)
    }
  }

  if (!post) return <div>Loading...</div>

  return (
    <div>
      {editing ? (
        <>
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="New Title"
          />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="New Content"
          />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <button onClick={() => setEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </>
      )}
    </div>
  )
}
