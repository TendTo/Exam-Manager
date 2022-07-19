import { useLogin } from "hooks";
import { NextRouter, useRouter } from "next/router";
import { useEffect } from "react";

type LoginGuardProps = {
  router: NextRouter;
};

export default function LoginGuard({ children, router }: React.PropsWithChildren<LoginGuardProps>) {
  const { user } = useLogin();
  console.log(user);

  useEffect(() => {
    switch (user) {
      case "notLogged":
        router.push("/");
        break;
      case "admin":
        router.replace("/admin");
        break;
      case "student":
        router.replace("/students");
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
