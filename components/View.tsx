import { client } from "@/sanity/lib/client";
import Ping from "./Ping";
import { STARTUPS_VIEWS_QUERY } from "@/lib/queries";
import { writeClient } from "@/sanity/lib/write-client";
import { after } from "next/server";

export default async function View({ id }: { id: string }) {
  const { views: totalViews } = await client
    .withConfig({ useCdn: false })
    .fetch(STARTUPS_VIEWS_QUERY, { id });

  after(
    async () =>
      await writeClient
        .patch(id)
        .set({ views: totalViews + 1 })
        .commit()
  );

  return (
    <div className="view-container !bottom-[80px] !right-[20px]">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>
      <p className="view-text">
        <span className="font-black">Views: {totalViews}</span>
      </p>
    </div>
  );
}
