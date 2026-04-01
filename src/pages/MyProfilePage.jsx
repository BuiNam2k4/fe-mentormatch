import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  Mail,
  Phone,
  User,
  Settings,
  Briefcase,
  GraduationCap,
  Target,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import profileService from "../services/profileService";
import { postService } from "../services/postService";
import PostCard from "../components/feed/PostCard";

export default function MyProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [postsError, setPostsError] = useState("");

  const roleNames = useMemo(() => profileData?.roles || [], [profileData]);
  const isMentor = roleNames.includes("ROLE_MENTOR");
  const isMentee = roleNames.includes("ROLE_MENTEE");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    setPostsError("");

    const [profileRes, postsRes] = await Promise.allSettled([
      profileService.getProfile(),
      postService.getMyPosts(),
    ]);

    if (profileRes.status === "fulfilled" && profileRes.value?.code === 1000) {
      setProfileData(profileRes.value.result);
    } else {
      setProfileData(null);
      setError("Unable to load your profile. Please try again.");
    }

    if (postsRes.status === "fulfilled" && postsRes.value?.code === 1000) {
      setPosts(postsRes.value.result || []);
    } else {
      setPosts([]);
      setPostsError("Unable to load your posts.");
    }

    setLoading(false);
  };

  useEffect(() => {
    const hasStoredUser = localStorage.getItem("mentormatch_user");
    if (!user && !hasStoredUser) {
      navigate("/login");
      return;
    }

    const timerId = setTimeout(() => {
      fetchData();
    }, 0);

    return () => clearTimeout(timerId);
  }, [user, navigate]);

  const handlePostUpdated = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)),
    );
  };

  const handlePostDeleted = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-[#372660]" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8 text-center">
        <h2 className="text-xl font-bold text-slate-800">My Profile</h2>
        <p className="text-sm text-red-500 mt-3">
          {error || "Unable to load profile data."}
        </p>
        <button
          onClick={fetchData}
          className="mt-4 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  const avatar =
    profileData.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.fullName || "User")}&background=ece8f6&color=372660&size=256`;
  const mentorProfile = profileData.mentorProfile;
  const menteeProfile = profileData.menteeProfile;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-[#372660] to-[#5c4a8f]" />
        <div className="px-6 pb-6 -mt-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <img
                src={avatar}
                alt={profileData.fullName}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
              />
              <div className="pb-1">
                <h1 className="text-2xl font-bold text-slate-900">
                  {profileData.fullName}
                </h1>
                <p className="text-sm text-slate-500">
                  @{profileData.userName}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {roleNames.map((role) => (
                    <span
                      key={role}
                      className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100"
                    >
                      {role.replace("ROLE_", "")}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/settings")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm"
            >
              <Settings className="w-4 h-4" />
              Edit profile
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
              <Mail className="w-4 h-4 text-[#372660]" />
              <span>{profileData.email || "No email"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
              <Phone className="w-4 h-4 text-[#372660]" />
              <span>{profileData.phone || "No phone number"}</span>
            </div>
          </div>
        </div>
      </div>

      {isMentor && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Mentor details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Title
              </p>
              <p className="text-sm text-slate-700 mt-1">
                {mentorProfile?.title || "Not updated yet"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Years of experience
              </p>
              <p className="text-sm text-slate-700 mt-1">
                {mentorProfile?.yearsOfExperience != null
                  ? `${mentorProfile.yearsOfExperience} years`
                  : "Not updated yet"}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Bio
              </p>
              <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap">
                {mentorProfile?.bio || "Not updated yet"}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Skills
              </p>
              {mentorProfile?.skills?.length ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {mentorProfile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-700 mt-1">Not updated yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {isMentee && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">Mentee details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Current education
              </p>
              <p className="text-sm text-slate-700 mt-1">
                {menteeProfile?.currentEducation || "Not updated yet"}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs uppercase tracking-wide text-slate-400 flex items-center gap-1">
                <Target className="w-3.5 h-3.5" />
                Learning goals
              </p>
              <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap">
                {menteeProfile?.learningGoals || "Not updated yet"}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs uppercase tracking-wide text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Interests
              </p>
              <p className="text-sm text-slate-700 mt-1">
                {menteeProfile?.interests || "Not updated yet"}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">My posts</h2>
          <button
            onClick={fetchData}
            className="px-3 py-2 rounded-lg text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            Refresh
          </button>
        </div>

        {postsError && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg px-4 py-3">
            {postsError}
          </div>
        )}

        {posts.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8 text-center">
            <User className="w-10 h-10 mx-auto text-slate-300 mb-3" />
            <h3 className="font-bold text-slate-800">No posts yet</h3>
            <p className="text-sm text-slate-500 mt-1">
              Share your first post from the feed page.
            </p>
            <button
              onClick={() => navigate("/feed")}
              className="mt-4 px-4 py-2 rounded-lg bg-[#372660] text-white hover:bg-[#2b1d4c] text-sm font-semibold"
            >
              Go to feed
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onPostUpdated={handlePostUpdated}
                onPostDeleted={handlePostDeleted}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
