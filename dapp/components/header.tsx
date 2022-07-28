import ThemeSwitcher from "./themeSwitcher";
import Link from "next/link";

export default function Header() {
  return (
    <header className="navbar bg-base-100">
      <div className="navbar-start">
        <Link href="/">
          <a className="btn btn-ghost normal-case text-xl">Exam Manager</a>
        </Link>
        <Link href="/logs">
          <a className="btn btn-ghost normal-case text-m" href="logs">
            Logs
          </a>
        </Link>
      </div>
      <div className="navbar-end">
        <ThemeSwitcher />
        <a
          className="btn btn-primary"
          href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          target="_blank"
          rel="noreferrer"
        >
          Get free CFU
        </a>
      </div>
    </header>
  );
}
