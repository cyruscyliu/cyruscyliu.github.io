import { getCollection, type CollectionEntry } from 'astro:content';
import blogIndex from '../data/blog.json';

export async function getBlogPosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const postsBySlug = new Map(posts.map((post) => [post.data.slug, post]));

  return blogIndex.entries.map((slug) => {
    const post = postsBySlug.get(slug);
    if (!post) throw new Error(`Blog index references missing Markdown post: ${slug}`);
    return post;
  });
}
