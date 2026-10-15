import { getCollection, type CollectionEntry } from 'astro:content';
import blogIndex from '../data/blog.json';

const includeDrafts = import.meta.env.DEV;

export async function getBlogPosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft || includeDrafts);
  const postsByKey = new Map(posts.map((post) => [`${post.data.language}/${post.data.slug}`, post]));

  const indexed = blogIndex.entries.map((key) => {
    const post = postsByKey.get(key);
    if (!post) throw new Error(`Blog index references missing Markdown post: ${key}`);
    return post;
  }).sort((a, b) => b.data.date.localeCompare(a.data.date));

  if (!includeDrafts) return indexed;

  const drafts = posts.filter((post) => !blogIndex.entries.includes(`${post.data.language}/${post.data.slug}`));
  return [...indexed, ...drafts].sort((a, b) => b.data.date.localeCompare(a.data.date));
}
