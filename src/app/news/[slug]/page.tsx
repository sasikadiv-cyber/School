import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, desc, eq, ne } from "drizzle-orm";
import { ArrowLeft, ArrowRight, Clock, MapPin, User } from "lucide-react";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { ensureSeed } from "@/db/seed";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Reveal } from "@/components/reveal";
import { Eyebrow } from "@/components/eyebrow";
import { PostCard } from "@/components/news/post-card";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await ensureSeed();
  const [post] = await db.select().from(posts).where(eq(posts.slug, slug));

  if (!post) return { title: "Story not found — St. Thomas' College" };

  return {
    title: `${post.title} — St. Thomas' College`,
    description: post.excerpt,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await ensureSeed();

  const [post] = await db.select().from(posts).where(eq(posts.slug, slug));
  if (!post) notFound();

  const related = await db
    .select()
    .from(posts)
    .where(and(eq(posts.category, post.category), ne(posts.id, post.id)))
    .orderBy(desc(posts.publishedAt))
    .limit(3);

  const fallback = related.length
    ? related
    : (
        await db
          .select()
          .from(posts)
          .where(ne(posts.id, post.id))
          .orderBy(desc(posts.publishedAt))
          .limit(3)
      );

  const paragraphs = post.body.split("\n\n");

  return (
    <main className="relative bg-surface text-fg">
      <Navbar />

      {/* Cover */}
      <section className="relative flex min-h-[70svh] items-end overflow-hidden bg-ink text-white">
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/72" />
        <div className="grain absolute inset-0" />

        <div className="relative mx-auto w-full max-w-4xl px-5 pb-16 pt-32 md:px-8 md:pb-20">
          <Link
            href="/news"
            className="animate-fade-up group inline-flex items-center gap-2.5 font-sans text-[10px] uppercase tracking-[0.25em] text-white/60 transition-colors hover:text-gold"
          >
            <ArrowLeft
              size={14}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            Back to Newsroom
          </Link>

          <span
            className="animate-fade-up mt-7 inline-block rounded-full bg-gold px-4 py-1.5 font-sans text-[9px] uppercase tracking-[0.25em] text-ink"
            style={{ animationDelay: "120ms" }}
          >
            {post.category}
          </span>

          <h1
            className="animate-fade-up mt-6 font-display text-[clamp(2.1rem,4.8vw,4rem)] font-semibold leading-[1.08] tracking-[-0.03em]"
            style={{ animationDelay: "220ms" }}
          >
            {post.title}
          </h1>

          <div
            className="animate-fade-up mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-white/15 pt-6 font-sans text-[10px] uppercase tracking-[0.2em] text-white/55"
            style={{ animationDelay: "340ms" }}
          >
            <span className="text-gold">{formatDate(post.publishedAt)}</span>
            <span className="flex items-center gap-2">
              <User size={13} />
              {post.author}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={13} />
              {post.readMinutes} min read
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={13} />
              {post.location}
            </span>
          </div>
        </div>
      </section>

      {/* Body */}
      <article className="bg-surface py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <Reveal>
            <p className="font-display text-2xl font-medium leading-[1.45] tracking-[-0.01em] text-fg md:text-[1.7rem]">
              {post.excerpt}
            </p>
          </Reveal>

          <div className="mt-10 space-y-6 border-t border-fg/10 pt-10">
            {paragraphs.map((paragraph, i) => (
              <Reveal key={i} delay={Math.min(i * 60, 240)}>
                <p className="text-[16.5px] leading-[1.85] text-fg/70">
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>

          {/* Author card */}
          <Reveal delay={120}>
            <div className="mt-14 flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-card px-7 py-7 text-white">
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold font-display text-lg font-semibold text-ink">
                  {post.author
                    .replace(/^(Mr|Mrs|Ms|Dr)\.\s*/, "")
                    .charAt(0)}
                </span>
                <div>
                  <p className="font-display text-lg font-semibold tracking-[-0.01em]">
                    {post.author}
                  </p>
                  <p className="mt-0.5 font-sans text-[9px] uppercase tracking-[0.28em] text-white/45">
                    Contributing Editor
                  </p>
                </div>
              </div>
              <Link
                href="/news"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/20 px-6 py-3 text-[13px] font-medium text-white transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-ink"
              >
                More stories
                <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>
        </div>
      </article>

      {/* Related */}
      {fallback.length > 0 && (
        <section className="bg-surface-2 py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <Reveal>
              <Eyebrow>Related Stories</Eyebrow>
            </Reveal>
            <Reveal delay={120}>
              <h2 className="mt-7 font-display text-3xl font-semibold leading-[1.1] tracking-[-0.02em] md:text-5xl">
                Keep reading
              </h2>
            </Reveal>

            <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {fallback.map((item, i) => (
                <Reveal key={item.id} delay={i * 120} className="h-full">
                  <PostCard post={item} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
