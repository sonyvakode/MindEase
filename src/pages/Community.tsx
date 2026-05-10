import { useState, useEffect } from "react";
import { GlassCard } from "../components/UI/GlassCard";
import { 
  Heart, 
  Share2, 
  Shield, 
  MessageCircle, 
  Send, 
  Plus,
  ArrowUpRight,
  TrendingUp,
  User,
  Users,
  Trash2,
  X
} from "lucide-react";
import { api } from "../services/api";
import { auth } from "../lib/firebase";
import { CommunityPost, CommunityComment } from "../types";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";

function PostContent({ text }: { text: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = text.length > 280;
  const displayText = isExpanded ? text : text.slice(0, 280);

  return (
    <div className="mb-8 group/content">
      <p className={cn(
        "text-sm sm:text-base text-white/80 leading-relaxed transition-all duration-500",
        !isExpanded && shouldTruncate ? "line-clamp-4" : ""
      )}>
        {displayText}
        {!isExpanded && shouldTruncate && "..."}
      </p>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 text-[10px] font-bold text-emerald-400/60 hover:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 transition-all group-hover/content:translate-x-1"
        >
          {isExpanded ? "Show Less" : "Read Full Story"}
          <ArrowUpRight className={cn("w-3 h-3 transition-transform", isExpanded ? "rotate-[-90deg]" : "")} />
        </button>
      )}
    </div>
  );
}

export default function Community() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPost, setNewPost] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Recent");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [followingAuthors, setFollowingAuthors] = useState<Set<string>>(new Set(["Peer Support"]));
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);

  useEffect(() => {
    api.getCommunityPosts().then(setPosts);
  }, []);

  useEffect(() => {
    if (expandedPost) {
      api.getComments(expandedPost).then(setComments);
    } else {
      setComments([]);
    }
  }, [expandedPost]);

  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await api.createPost(newPost);
      const updated = await api.getCommunityPosts();
      setPosts(updated);
      setNewPost("");
      setShowForm(false);
    } catch (error) {
      console.error("Failed to post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !expandedPost || isCommenting) return;

    setIsCommenting(true);
    try {
      await api.addComment(expandedPost, newComment);
      const updatedComments = await api.getComments(expandedPost);
      setComments(updatedComments);
      setNewComment("");
      
      // Update local posts state to reflect new comment count
      setPosts(posts.map(p => p.id === expandedPost ? { ...p, comments: p.comments + 1 } : p));
    } catch (error) {
      console.error("Comment error:", error);
    } finally {
      setIsCommenting(false);
    }
  };

  const toggleLike = (id: string) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleFollow = (author: string) => {
    setFollowingAuthors(prev => {
      const next = new Set(prev);
      if (next.has(author)) next.delete(author);
      else next.add(author);
      return next;
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.deletePost(id);
      setPosts(posts.filter(p => p.id !== id));
      if (expandedPost === id) setExpandedPost(null);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const filters = ["Recent", "Following", "My Posts"];

  const filteredPosts = posts.filter(post => {
    if (activeFilter === "My Posts") {
      return post.authorId === auth.currentUser?.uid;
    }
    if (activeFilter === "Following") {
      return followingAuthors.has(post.author);
    }
    return true; 
  });

  return (
    <div className="space-y-8 pb-12 overflow-x-hidden">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Peer Support Community</h1>
          <p className="text-white/40 text-sm font-medium">A safe, anonymous space for sharing and listening.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="purple-gradient px-8 py-3 rounded-xl font-bold shadow-2xl shadow-emerald-500/30 flex items-center justify-center gap-2 text-sm hover:scale-105 transition-all text-white"
        >
          {showForm ? "Cancel" : <><Plus className="w-4 h-4" /> New Post</>}
        </button>
      </header>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <GlassCard className="p-6 border-emerald-500/20 bg-emerald-500/5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="What's on your mind? Share your feelings anonymously..."
                  className="w-full bg-black/20 border border-white/5 rounded-xl p-4 text-white placeholder:text-white/20 min-h-[120px] focus:outline-none focus:border-emerald-500/30 transition-all font-medium"
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2 rounded-xl text-xs font-bold text-white/40 hover:text-white transition-all tracking-widest uppercase"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !newPost.trim()}
                    className="purple-gradient px-8 py-2 rounded-xl text-xs font-bold text-white shadow-xl shadow-emerald-500/20 disabled:opacity-50"
                  >
                    {isSubmitting ? "Posting..." : "Share Anonymously"}
                  </button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs / Filters */}
      <div className="flex items-center gap-8 border-b border-white/5 pb-4">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn(
              "text-[10px] uppercase font-bold tracking-[0.2em] transition-all relative py-2 mb-[-16px]",
              activeFilter === f ? "text-emerald-400" : "text-white/30 hover:text-white/60"
            )}
          >
            {f}
            {activeFilter === f && (
              <motion.div layoutId="community-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_10px_#10B981]" />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence initial={false}>
            {filteredPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard className="group hover:border-white/10 transition-all cursor-default p-6 border-white/5">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shadow-lg">
                        <User className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm tracking-tight">{post.author}</span>
                          {auth.currentUser?.uid !== post.authorId && (
                            <button 
                              onClick={() => toggleFollow(post.author)}
                              className={cn(
                                "text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded transition-all",
                                followingAuthors.has(post.author) 
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20" 
                                  : "text-white/20 hover:text-emerald-400"
                              )}
                            >
                              {followingAuthors.has(post.author) ? "Following" : "+ Follow"}
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                           <span className="text-[9px] text-white/20 uppercase font-medium">{post.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-emerald-500/10 px-2 py-1 rounded text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Supportive Community</div>
                  </div>
                  
                  <PostContent text={post.text} />

                    <div className="flex items-center gap-6 pt-6 border-t border-white/5">
                      <button 
                        onClick={() => toggleLike(post.id)}
                        className={cn(
                          "flex items-center gap-2 transition-colors text-xs font-bold uppercase tracking-widest group",
                          likedPosts.has(post.id) ? "text-emerald-400" : "text-white/30 hover:text-emerald-400"
                        )}
                        title={likedPosts.has(post.id) ? "Unlike post" : "Love this post"}
                      >
                        <Heart className={cn("w-4 h-4 transition-all", likedPosts.has(post.id) ? "fill-emerald-500" : "group-hover:fill-emerald-500")} />
                        <span>{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                      </button>
                      <button 
                        onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                        className={cn(
                          "flex items-center gap-2 transition-colors text-xs font-bold uppercase tracking-widest group",
                          expandedPost === post.id ? "text-blue-400" : "text-white/30 hover:text-blue-400"
                        )}
                        title={expandedPost === post.id ? "Hide support thread" : "Open support thread"}
                      >
                        <MessageCircle className={cn("w-4 h-4 transition-all", expandedPost === post.id ? "fill-blue-500" : "group-hover:fill-blue-500")} />
                        <span>{post.comments}</span>
                      </button>
                      
                      {auth.currentUser?.uid === post.authorId && (
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="flex items-center gap-2 text-white/10 hover:text-red-400 transition-all text-xs font-bold uppercase tracking-widest group"
                          title="Permanently remove your post"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity">Delete</span>
                        </button>
                      )}

                      <button className="ml-auto text-white/20 hover:text-white transition-colors" title="Copy Link">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>

                    <AnimatePresence>
                      {expandedPost === post.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-white/[0.02] -mx-6 -mb-6 mt-6 border-t border-white/5"
                        >
                          <div className="p-6 space-y-6">
                            <div className="space-y-4">
                              {comments.map((comment) => (
                                <div key={comment.id} className="flex gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                    <User className="w-4 h-4 text-white/40" />
                                  </div>
                                  <div className="space-y-1 flex-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-bold text-white tracking-tight uppercase">{comment.authorName}</span>
                                      <span className="text-[8px] text-white/10 font-bold uppercase">{comment.timestamp}</span>
                                    </div>
                                    <p className="text-xs text-white/60 leading-relaxed">{comment.text}</p>
                                  </div>
                                </div>
                              ))}
                              {comments.length === 0 && (
                                <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest text-center py-4">No comments yet. Be the first to support!</p>
                              )}
                            </div>

                            <form onSubmit={handleAddComment} className="relative mt-4">
                              <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a supportive comment..."
                                className="w-full bg-black/20 border border-white/5 rounded-xl py-3 pl-4 pr-12 text-xs font-medium focus:outline-none focus:border-emerald-500/30 transition-all text-white placeholder:text-white/20"
                              />
                              <button
                                type="submit"
                                disabled={isCommenting || !newComment.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-emerald-400 hover:text-emerald-300 disabled:opacity-20 transition-all"
                              >
                                {isCommenting ? <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4" /> }
                              </button>
                            </form>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <aside className="space-y-8">
           <GlassCard className="p-8 space-y-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Community Guidelines</h3>
              <div className="space-y-6">
                 {[
                   { icon: Shield, text: "Be kind and respectful" },
                   { icon: Share2, text: "Share your feelings" },
                   { icon: Users, text: "Support others" },
                   { icon: Shield, text: "No negative comments" },
                   { icon: User, text: "Your identity is safe" }
                 ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
                       <span className="text-xs font-medium text-white/60">{item.text}</span>
                    </div>
                 ))}
              </div>
              <div className="pt-6 border-t border-white/5">
                 <p className="text-sm font-bold text-white mb-2">You are not alone.</p>
                 <p className="text-[10px] text-white/30 tracking-tight">We are in this together. ❤️</p>
              </div>
           </GlassCard>

           <GlassCard delay={0.4} className="bg-emerald-600/5 group border-emerald-500/10 p-8 shadow-emerald-500/5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-8 shadow-xl shadow-emerald-500/10 ring-1 ring-white/10">
                <TrendingUp className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Community Growth</h3>
              <p className="text-xs text-white/40 mb-8 font-medium leading-relaxed">Engagement in peer support communities is shown to reduce isolation by 40%.</p>
              <button 
                onClick={() => window.open("https://help.twitter.com/en/safety-and-security/mental-health-resources", "_blank")}
                className="text-xs font-bold text-emerald-400/60 flex items-center gap-2 group-hover:text-emerald-400 group-hover:gap-3 transition-all"
              >
                 Read Research <ArrowUpRight className="w-3 h-3" />
              </button>
           </GlassCard>
        </aside>
      </div>
    </div>
  );
}
