import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

interface PostInput {
  title: string;
  content: string;
  avatar_url: string | null;
}
const createPost = async (post: PostInput, imageFile: File) => {
  const filePath = `${post.title}-${Date.now()}.${imageFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile);

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicUrlData } = supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);

  const { data, error } = await supabase
    .from("posts")
    .insert({ ...post, imageUrl: publicUrlData.publicUrl });

  if (error) throw new Error(error.message);

  return data;
};

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File }) => {
      return createPost(data.post, data.imageFile);
    },
    onSuccess: () => {
      setTitle("");
      setContent("");
      setSelectedFile(null);
      navigate("/posts");
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) return;
    mutate({
      post: {
        title,
        content,
        avatar_url: user?.user_metadata.avatar_url,
      },
      imageFile: selectedFile,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-sm"
    >
      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          onChange={(event) => setTitle(event.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 transition focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
          placeholder="Enter a title..."
        />
      </div>
      <div>
        <label
          htmlFor="content"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Description
        </label>
        <textarea
          id="content"
          name="description"
          required
          rows={5}
          onChange={(event) => setContent(event.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 transition focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
          placeholder="Write your post..."
        ></textarea>
      </div>
      <div>
        <label
          htmlFor="image"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Upload Image Here
        </label>
        <input
          type="file"
          accept="image/*"
          required
          onChange={handleFileChange}
          className="block w-full cursor-pointer rounded-xl border border-dashed border-slate-700 bg-slate-950 p-3 text-sm text-slate-400 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-purple-600 file:px-4 file:py-2 file:text-white hover:border-purple-500/50"
        />
      </div>

      <button type="submit" className="button" disabled={isPending}>
        {isPending ? "Creating..." : "Create Post"}
      </button>

      {isError && <p className="text-red-400">Error Creating post.</p>}
    </form>
  );
};

export default CreatePost;
