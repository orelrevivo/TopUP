import Link from "next/link"

const HeroButtons = () => {
    return (
        <>
            <Link href={"https://github.com/orelrevivo/TopUP"} target="_blank">
                <img src="/icons/github.svg" alt="github" className="rounded-full w-[35px]" />
            </Link>
            <Link href={"/login"}>
                <button className="text-sm text-white font-medium cursor-pointer">Sign In</button>
            </Link>
            <Link href={"/signup"}>
                <button className="text-sm font-medium cursor-pointer w-[100px] bg-[#e7e7e7] p-1 rounded-md text-[#000000]">
                    Start for free
                </button>
            </Link>
        </>
    )
}

export default HeroButtons