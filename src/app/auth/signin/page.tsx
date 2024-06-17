import Link from "next/link";
import SigninForm from "./components/signin-form";
import { buttonVariants } from "@/components/ui/button";

const SignInPage = async () => {
  return (
    <div className="flex flex-col space-y-4">
      <SigninForm />
      <Link
        className={buttonVariants({
          variant: "link",
          className: "w-fit",
        })}
        href="/auth/signup"
      >
        Sign up ?
      </Link>
    </div>
  );
};

export default SignInPage;
