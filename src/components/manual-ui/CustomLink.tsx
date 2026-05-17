import Link from "next/link";
import { usePathname } from "next/navigation";

const CustomLink = ({
  href,
  title,
  className = '',
  underlineClassName = 'bg-dark dark:bg-light',
}: {
  href: string
  title: string
  className?: string
  underlineClassName?: string
}) => {
  const pathname = usePathname();

  return (
    <Link href={href} className={`${className} relative group`}>
      {title}
      <span
        className={`
          h-0.5 inline-block w-0
          absolute left-0 -bottom-0.5
          group-hover:w-full transition-[width] ease-in-out duration-300
          ${underlineClassName}
          ${pathname === href ? 'w-full' : 'w-0'}
        `}
      >
        &nbsp;
      </span>
    </Link>
  );
};

export default CustomLink;