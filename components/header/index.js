import Link from "next/dist/client/link";

function Header() {
    return (
        <header className="py-4 px-7">
            <Link href="/">
                <a className="font-black text-xl">
                    IdeaHunt
                </a>
            </Link>
        </header>
    )
}

export default Header;