import { useLogin } from "hooks";
import { NextRouter, useRouter } from "next/router";
import { useEffect } from "react";

type LoginGuardProps = {
  router: NextRouter;
};

export default function LoginGuard({ children, router }: React.PropsWithChildren<LoginGuardProps>) {
  const { user } = useLogin();

  useEffect(() => {
    switch (user) {
      case "admin":
        router.replace("/admin");
        break;
      case "student":
        router.replace("/student");
        break;
      case "professor":
        router.replace("/professor");
        break;
      case "unknown":
        router.replace("/404");
      default:
        break;
    }
  }, [user]);

  return <>{children}</>;
}
