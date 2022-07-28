import { LogoUnict, LogoGitHub } from "components";

export default function Footer() {
  return (
    <footer className="footer items-center p-4 bg-neutral text-neutral-content grid-flow-col">
      <div className="grid-flow-col">
        <a href="https://github.com/TendTo/Exam-Manager">
          <LogoUnict />
        </a>
      </div>
      <div className="grid-flow-col gap-4 justify-self-end">
        <a href="https://github.com/TendTo/Exam-Manager">
          <LogoGitHub />
        </a>
      </div>
    </footer>
  );
}
