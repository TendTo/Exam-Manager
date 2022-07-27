import ThemeSwitcher from "./themeSwitcher";

export default function Header() {
  return (
    <header className="navbar bg-base-100">
      <div className="navbar-start">
        
        <a className="btn btn-ghost normal-case text-xl">Exam Manager</a>
      </div>
      <div className="navbar-end">
       <ThemeSwitcher/>
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
