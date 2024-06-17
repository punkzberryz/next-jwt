import Link from "next/link";
import AuthNav from "./auth-nav";

const links: {
  href: string;
  label: string;
}[] = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/auth/signin",
    label: "Sign In",
  },
  {
    href: "/auth/signup",
    label: "Sign Up",
  },
  {
    href: "/dashboard",
    label: "Dashboard",
  },
];
const Navbar = () => {
  return (
    <div className="border-b mb-2 px-20">
      <nav className="flex space-x-2">
        <ul className="flex space-x-4 flex-1">
          {links.map((link) => (
            <li key={link.label}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>

        <AuthNav />
      </nav>
    </div>
  );
};

export default Navbar;
