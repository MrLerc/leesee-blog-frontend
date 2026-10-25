
"use client";

import { FormEvent, useEffect, useState } from "react";

type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPosts() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/posts`);

      if (!response.ok) {
        throw new Error("Impossible de charger les articles.");
      }

      const data: Post[] = await response.json();
      setPosts(data);
    } catch {
      setError("Impossible de joindre le serveur. Vérifiez que Flask fonctionne.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(
        editingId !== null
          ? `${API_URL}/api/posts/${editingId}`
          : `${API_URL}/api/posts`,
        {
          method: editingId !== null ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, author }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue.");
      }

      setTitle("");
      setContent("");
      setAuthor("");
      setEditingId(null);

      await loadPosts();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible d'enregistrer l'article."
      );
    }
  }

  function handleEdit(post: Post) {
    setTitle(post.title);
    setContent(post.content);
    setAuthor(post.author);
    setEditingId(post.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Voulez-vous vraiment supprimer cet article?")) {
      return;
    }

    setError("");

    try {
      const response = await fetch(`${API_URL}/api/posts/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Impossible de supprimer l'article.");
      }

      await loadPosts();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur est survenue."
      );
    }
  }

  function handleCancelEdit() {
    setEditingId(null);
    setTitle("");
    setContent("");
    setAuthor("");
    setError("");
  }

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-slate-900 px-6 py-8 text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold">Mon blogue</h1>
        </div>
      </header>

      <div className="mx-auto grid max-w-4xl gap-8 px-6 py-8 md:grid-cols-[1fr_1.2fr]">
        <section className="h-fit rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold">
            {editingId !== null ? "Modifier un article" : "Créer un article"}
          </h2>

          {error && (
            <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="mb-1 block text-sm font-medium">
                Titre
              </label>
              <input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={200}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                placeholder="Entrez un titre"
                required
              />
            </div>

            <div>
              <label htmlFor="author" className="mb-1 block text-sm font-medium">
                Auteur
              </label>
              <input
                id="author"
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                maxLength={100}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                placeholder="Votre nom"
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="mb-1 block text-sm font-medium">
                Contenu
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className="min-h-32 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                placeholder="Rédigez votre article..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              {editingId !== null ? "Enregistrer les modifications" : "Publier l'article"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
              >
                Annuler
              </button>
            )}
          </form>
        </section>

        <section>
          <h2 className="mb-5 text-xl font-semibold">
            Articles récents ({posts.length})
          </h2>

          {loading ? (
            <p className="text-gray-500">Chargement des articles...</p>
          ) : posts.length === 0 ? (
            <div className="rounded-xl bg-white p-6 text-gray-500 shadow-sm">
              Aucun article pour le moment. Soyez le premier à en publier un!
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-xl bg-white p-6 shadow-sm"
                >
                  <h3 className="text-xl font-bold">{post.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Par {post.author}
                  </p>
                  <p className="mt-4 whitespace-pre-wrap leading-7 text-gray-700">
                    {post.content}
                  </p>

                  <div className="mt-5 flex gap-3 border-t border-gray-100 pt-4">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-sm font-medium text-red-600 hover:text-red-800"
                    >
                      Supprimer
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}