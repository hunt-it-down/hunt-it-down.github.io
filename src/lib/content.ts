import { getCollection, type CollectionEntry } from 'astro:content';

export const sections = {
  projects: { title: '项目与实践', label: 'Projects', description: '不追求列出所有技术栈，只记录问题、方法和逐渐形成的经验。' },
  notes: { title: '学习笔记', label: 'Notes', description: '比起急着给出漂亮的结论，我希望先把问题问清楚。' },
  essays: { title: '随笔与文稿', label: 'Essays', description: '生活观察、阅读，以及偶尔不属于技术的想法。' },
} as const;

export type Section = keyof typeof sections;
export type Article = CollectionEntry<Section>;
export const sectionNames = Object.keys(sections) as Section[];

export async function articles(section?: Section): Promise<Article[]> {
  const entries = (await Promise.all((section ? [section] : sectionNames).map((name) => getCollection(name)))).flat();
  return entries.sort((a, b) => {
    if (section === 'projects') return a.data.order - b.data.order || a.id.localeCompare(b.id);
    return (b.data.date ?? '').localeCompare(a.data.date ?? '') || a.id.localeCompare(b.id);
  });
}

export const articleUrl = (entry: Article) => `/${entry.collection}/${entry.id}/`;
// UTF-8 hex is reversible and safe on both Windows and GitHub's Linux filesystem.
// It also keeps C++, C#, slash-containing tags and case variants distinct.
export const tagId = (tag: string) => `t-${Array.from(new TextEncoder().encode(tag), (byte) => byte.toString(16).padStart(2, '0')).join('')}`;
export const tagUrl = (tag: string) => `/tags/${tagId(tag)}/`;
export const articleTags = (entries: Article[]) => [...new Set(entries.flatMap((entry) => entry.data.tags))].sort((a, b) => a.localeCompare(b, 'zh-CN'));
