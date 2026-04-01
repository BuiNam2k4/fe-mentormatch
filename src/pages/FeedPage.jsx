import React, { useState, useEffect } from "react"
import Sidebar from '../components/layout/Sidebar'
import RightSidebar from '../components/layout/RightSidebar'
import CreatePost from '../components/feed/CreatePost'
import PostCard from '../components/feed/PostCard'
import { postService } from '../services/postService'
import { Loader2 } from "lucide-react"

export default function FeedPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const res = await postService.getAllPosts()
      if (res.code === 1000) {
        // Assume latest logic is handled by backend ordering, otherwise we could sort here
        setPosts(res.result)
      } else {
        setError(res.message || "Failed to load posts")
      }
    } catch (err) {
      console.error(err)
      setError("An error occurred while fetching posts.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handlePostCreated = (newPost) => {
     // Prepend the new post to the list instantly for snappy UX, or simply re-fetch
     setPosts(prev => [newPost, ...prev])
  }

  return (
    <div className="flex gap-8 justify-center max-w-7xl mx-auto">
      <Sidebar />
      <div className="flex-1 max-w-2xl min-w-0">
        <CreatePost onPostCreated={handlePostCreated} />
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-[#372660] animate-spin" />
          </div>
        ) : error ? (
           <div className="text-center text-red-500 py-8 bg-white border border-red-100 rounded-xl">
             <p>{error}</p>
             <button onClick={fetchPosts} className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-700">
               Thử lại
             </button>
           </div>
        ) : posts.length === 0 ? (
          <div className="text-center text-slate-500 py-12 bg-white rounded-xl border border-slate-100 shadow-sm">
             Chưa có bài viết nào. Hãy là người đầu tiên chia sẻ!
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard 
                 key={post.id} 
                 post={post} 
                 onPostUpdated={(updatedPost) => setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p))}
                 onPostDeleted={(postId) => setPosts(prev => prev.filter(p => p.id !== postId))}
              />
            ))}
          </div>
        )}
      </div>
      <RightSidebar />
    </div>
  )
}
