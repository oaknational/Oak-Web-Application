import Link from "next/link";

export default function Page() {
  return (
    <section>
      <div>
        <h1>Welcome! These downloads are only available to logged in users</h1>
        <Link href="/home">Go home</Link>
      </div>
    </section>
  );
}
