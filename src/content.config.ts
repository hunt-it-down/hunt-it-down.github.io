import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期须为带引号的 YYYY-MM-DD')
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
  }, '日期不存在');

const articleSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  // Explicit opt-in: only material already cleared for public release belongs here.
  public: z.literal(true),
  date: date.optional(),
  updated: date.optional(),
  tags: z.array(z.string().trim().min(1).max(40, '单个标签最多 40 个字符')).default([]).transform((tags) => [...new Set(tags)]),
  status: z.string().trim().min(1).optional(),
  eyebrow: z.string().trim().min(1).optional(),
  order: z.number().int().nonnegative().default(100),
}).refine((data) => !data.updated || !!data.date, '填写 updated 时必须同时填写 date')
  .refine((data) => !data.updated || !data.date || data.updated >= data.date, '更新日期不能早于发布日期');

function collection(name: string, requireDate = true) {
  return defineCollection({
    loader: glob({
      pattern: '**/*.md',
      base: `./src/content/${name}`,
      generateId: ({ entry }) => {
        const id = entry.replace(/\.md$/, '');
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(id)) {
          throw new Error(`文章路径须使用小写英文、数字、连字符：${name}/${entry}`);
        }
        return id;
      },
    }),
    schema: articleSchema.refine((data) => !requireDate || !!data.date, '笔记与随笔必须填写 date'),
  });
}

export const collections = {
  projects: collection('projects', false),
  notes: collection('notes'),
  essays: collection('essays'),
};
