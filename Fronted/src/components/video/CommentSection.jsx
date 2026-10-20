import React, { useState, useEffect } from "react";
import { ThumbsUp, Trash2, Edit3, MessageSquare, Send } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const CommentSection = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/comments/${videoId}`);
      if (res.data?.data?.docs) {
        setComments(res.data.data.docs);
      }
    } catch (error) {
      console.error("Failed to load comments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (videoId) {
      fetchComments();
    }
  }, [videoId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!isAuthenticated) {
      addToast("Please login to comment", "error");
      return;
    }

    try {
      setSubmitting(true);
      const res = await axiosInstance.post(`/comments/${videoId}`, {
        content: newComment.trim(),
      });
      if (res.data?.data) {
        setComments((prev) => [res.data.data, ...prev]);
        setNewComment("");
        addToast("Comment added!", "success");
      }
    } catch (error) {
      addToast("Failed to add comment", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleLike = async (commentId) => {
    if (!isAuthenticated) {
      addToast("Please login to like comments", "error");
      return;
    }

    try {
      const res = await axiosInstance.post(`/likes/toggle/c/${commentId}`);
      const { isLiked } = res.data?.data || {};

      setComments((prev) =>
        prev.map((c) => {
          if (c._id === commentId) {
            return {
              ...c,
              isLiked,
              likesCount: isLiked ? (c.likesCount || 0) + 1 : Math.max(0, (c.likesCount || 0) - 1),
            };
          }
          return c;
        })
      );
    } catch (error) {
      addToast("Failed to update like", "error");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      await axiosInstance.delete(`/comments/c/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      addToast("Comment deleted", "info");
    } catch (error) {
      addToast("Failed to delete comment", "error");
    }
  };

  const handleStartEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async (commentId) => {
    if (!editContent.trim()) return;
    try {
      const res = await axiosInstance.patch(`/comments/c/${commentId}`, {
        content: editContent.trim(),
      });
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? res.data.data : c))
      );
      setEditingCommentId(null);
      addToast("Comment updated", "success");
    } catch (error) {
      addToast("Failed to update comment", "error");
    }
  };

  return (
    <div className="flex flex-col gap-6 mt-6 pt-6 border-t border-zinc-800">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-zinc-100">
          {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
        </h3>
      </div>

      {/* Add comment input */}
      <form onSubmit={handleAddComment} className="flex gap-3">
        <img
          src={
            user?.avatar ||
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
          }
          alt={user?.fullName || "User"}
          className="w-10 h-10 rounded-full object-cover shrink-0 border border-zinc-800"
        />
        <div className="flex-1 flex flex-col gap-2">
          <input
            type="text"
            placeholder={isAuthenticated ? "Add a comment..." : "Sign in to leave a comment"}
            disabled={!isAuthenticated || submitting}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full bg-zinc-900/80 border-b-2 border-zinc-700 focus:border-purple-500 py-2 px-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition rounded-t-lg"
          />
          {newComment.trim() && (
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setNewComment("")}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold shadow-md transition disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                Comment
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Comment List */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="text-zinc-500 text-sm py-4">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-zinc-500 text-sm py-4 italic">
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          comments.map((comment) => {
            const isAuthor = user?._id === (comment.owner?._id || comment.owner);
            const isEditing = editingCommentId === comment._id;

            return (
              <div key={comment._id} className="flex gap-3 items-start group">
                <img
                  src={
                    comment.owner?.avatar ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                  }
                  alt={comment.owner?.fullName || "User"}
                  className="w-9 h-9 rounded-full object-cover shrink-0 border border-zinc-800 mt-1"
                />
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-zinc-200">
                      @{comment.owner?.username || "user"}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {isEditing ? (
                    <div className="flex flex-col gap-2 mt-1">
                      <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-100 outline-none focus:border-purple-500"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(comment._id)}
                          className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-md text-xs font-semibold"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className="px-3 py-1 text-zinc-400 hover:text-white text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-300 leading-relaxed break-words">
                      {comment.content}
                    </p>
                  )}

                  {/* Comment Actions */}
                  <div className="flex items-center gap-4 mt-1">
                    <button
                      onClick={() => handleToggleLike(comment._id)}
                      className={`flex items-center gap-1.5 text-xs font-medium transition ${
                        comment.isLiked
                          ? "text-purple-400"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{comment.likesCount || 0}</span>
                    </button>

                    {isAuthor && !isEditing && (
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleStartEdit(comment)}
                          className="text-zinc-400 hover:text-zinc-200 p-1"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-zinc-400 hover:text-rose-400 p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommentSection;
