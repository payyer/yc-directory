import { PLAYLIST_BY_SLUG_QUERY, STARTUPS_BY_ID_QUERY } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { notFound } from "next/navigation";
import markdownit from "markdown-it";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import Link from "next/link";
import StartupCard, { StartupCardType } from "@/components/StartupCard";

export const experimental_ppr = true;

const md = markdownit();
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  // Parallel
  const [post, { select: editorPosts }] = await Promise.all([
    await client.fetch(STARTUPS_BY_ID_QUERY, { id }),
    await client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: "best-startups" }),
  ]);

  if (!post) return notFound();

  const parsedContent = md.render(post?.pitch || "");

  return (
    <>
      <section className="pink_container !min-h-[230px] overflow-hidden">
        <p className="tag">{formatDate(post?._createdAt)}</p>
        <h1 className="heading">{post?.title}</h1>
        <p className="sub-heading !max-w-5xl">{post?.description}</p>
      </section>

      <section className="section_container ">
        <img
          src={post?.image}
          alt="thumnail"
          className="w-full h-auto rounded-xl "
        />

        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${post?.author?._id}`}
              className="flex gap-2 items-center mb-3"
            >
              <Image
                src={post.author.image}
                alt=""
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg"
              />

              <div>
                <p className="text-20-medium">{post.author.name}</p>
                <p className="text-16-medium !text-black-300">
                  @{post?.author?.username}
                </p>
              </div>
            </Link>
            <p className="category-tag">{post.category}</p>
          </div>
          <h3 className="text-30-bold">Pitch Details</h3>
          {parsedContent ? (
            <article
              className="prose max-w-4xl font-work-sans break-all"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            ></article>
          ) : (
            <p className="no-result">No details provided</p>
          )}

          <hr className="divider" />

          {/* TODO: EDITOR  */}
          {editorPosts?.length > 0 && (
            <div className="max-w-4xl mx-auto">
              <p className="text-30-semibold">Best Startups</p>

              <ul className="mt-7 card_grid-sm">
                {editorPosts.map((post: StartupCardType) => (
                  <StartupCard key={post._id} post={post} />
                ))}
              </ul>
            </div>
          )}
        </div>

        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <View id={id} />
        </Suspense>
      </section>
    </>
  );
}
