import Link from "next/link"

const HeroButtons = () => {
    return (
        <>
            <Link href={"https://github.com/orelrevivo/falbor"} target="_blank">
                <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" className="w-[25px]" />
            </Link>
            <Link href={"/login"}>
                <button className="text-sm font-medium cursor-pointer text-[#181717]">Sign In</button>
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