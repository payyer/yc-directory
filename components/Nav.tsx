import Image from "next/image";
import { auth, signIn, signOut } from "../app/auth";
import Link from "next/link";
import { BadgePlus, LogOut } from "lucide-react";

export default async function Nav() {
  const session = await auth();
  return (
    <header>
      <nav className="flex justify-between items-center shadow-sm bg-white px-5 py-3 text-black">
        <Link href={"/"}>
          <Image src={"/logo.png"} alt="" width={144} height={30} />
        </Link>
        <div>
          {session && session?.user ? (
            <div className="flex gap-5">
              <Link href={`/startup/create}`}>
                <BadgePlus className="size-6 text-red-500" />
              </Link>

              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit" className="cursor-pointer">
                  <LogOut className="size-6  text-red-500" />
                </button>
              </form>

              <Link href={`/user/${session?.id}`}>
                <Image
                  src={session?.user?.image}
                  width={32}
                  height={32}
                  alt={session?.user?.name}
                  className="rounded-full border border-black"
                />
              </Link>
            </div>
          ) : (
            <>
              <form
                action={async () => {
                  "use server";
                  await signIn("github");
                }}
              >
                <button type="submit">Signin with GitHub</button>
              </form>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
