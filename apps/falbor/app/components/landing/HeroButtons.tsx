import Link from "next/link"

const HeroButtons = () => {
    return (
        <>
            <Link href={"/login"}>
                <button className="text-sm text-zinc-800 dark:text-white font-medium cursor-pointer transition-colors">Sign In</button>
            </Link>
            <Link href={"/signup"}>
                <button className="text-sm font-medium cursor-pointer px-3 py-1.5 bg-[#e7e7e7] dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-md transition-colors">
                    Start for free
                </button>
            </Link>
        </>
    )
}

export default HeroButtons