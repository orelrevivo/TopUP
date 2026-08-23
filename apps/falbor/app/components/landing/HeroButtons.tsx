import Link from "next/link"

const HeroButtons = () => {
    return (
        <>
            <div className="flex items-center gap-4">
                <a href="https://x.com/WrRbybw84381" target="_blank" className="hover:scale-110 transition-transform">
                    <img src="/landing/social/X.png" alt="X" className="w-14 h-14 object-contain" />
                </a>
                <a href="https://www.instagram.com/falbor.xyz" target="_blank" className="hover:scale-110 transition-transform">
                    <img src="/landing/social/instagram.png" alt="Instagram" className="w-6 h-6 object-contain" />
                </a>
                <a href="https://www.linkedin.com/company/falbor-xyz" target="_blank" className="hover:scale-110 transition-transform">
                    <img src="/landing/social/linkdin.png" alt="LinkedIn" className="w-11 h-11 object-contain" />
                </a>
                <a href="https://www.reddit.com/r/Falbor" target="_blank" className="hover:scale-110 transition-transform">
                    <img src="/landing/social/reddit.png" alt="Reddit" className="w-6 h-6 object-contain" />
                </a>
            </div>
            <Link href={"https://github.com/orelrevivo/TopUP"} target="_blank">
                <img src="/icons/github.png" alt="github" className="rounded-full w-[35px]" />
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