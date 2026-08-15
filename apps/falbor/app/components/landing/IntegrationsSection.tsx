import { classNames as cn } from "~/utils/classNames";

type LogoType = {
	src: string;
	alt: string;
	isInvertable?: boolean;
};

type TileData = {
	row: number;
	col: number;
	logo?: LogoType;
};

export default function IntegrationsSection() {
	return (
		<div className="bg-[#0a0a0a] py-32 w-full flex items-center justify-center">
			<div className="mx-auto grid max-w-6xl w-full grid-cols-1 gap-12 px-8 md:px-16 md:grid-cols-2 md:items-center relative z-10">
				<div className="max-w-xl space-y-6">
					<h2 className="font-bold text-white text-[2.5rem] md:text-[3rem] leading-[1.1] tracking-tight">
						MCPs
					</h2>
					<p className="text-lg text-zinc-400 leading-relaxed font-light">
						Integrate with over 19+ tools and platforms to streamline your
						workflow and boost productivity.
					</p>
				</div>
				<div className="place-items-end flex justify-end">
					<div className="relative" style={{ width: '360px', height: '360px', WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)', maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)' }}>
						{tiles.map((tile) => (
							<IntegrationCard key={`${tile.row}_${tile.col}`} {...tile} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

function IntegrationCard({ row, col, logo }: TileData) {
	return (
		<div
			className={cn(
				"absolute flex items-center justify-center rounded-md border",
				logo
					? "bg-zinc-900 shadow-xl shadow-black/50 border-zinc-700/50"
					: "bg-zinc-950 border-zinc-900/50"
			)}
			style={{
				width: '72px',
				height: '72px',
				left: col * 72,
				top: row * 72,
			}}
		>
			{logo && (
				<img
					alt={logo.alt}
					className={cn(
						"pointer-events-none select-none object-contain p-2",
						logo.isInvertable && "invert opacity-80"
					)}
					height={40}
					src={logo.src}
					width={40}
				/>
			)}
		</div>
	);
}
const tiles: TileData[] = [
	{ row: 0, col: 1 },
	{
		row: 0,
		col: 3,
		logo: {
			src: "/icons/connectors/github.svg",
			alt: "GitHub",
			isInvertable: true,
		},
	},
	{ row: 1, col: 0 },
	{
		row: 1,
		col: 2,
		logo: {
			src: "/icons/connectors/slack.svg",
			alt: "Slack",
		},
	},
	{
		row: 1,
		col: 4,
		logo: {
			src: "/icons/connectors/vercel.svg",
			alt: "Vercel",
			isInvertable: true,
		},
	},
	{
		row: 2,
		col: 1,
		logo: {
			src: "/icons/connectors/stripe.svg",
			alt: "Stripe",
		},
	},
	{
		row: 2,
		col: 3,
		logo: {
			src: "/icons/connectors/gmail.svg",
			alt: "Gmail",
		},
	},
	{ row: 3, col: 0 },
	{
		row: 3,
		col: 2,
		logo: {
			src: "/icons/connectors/supabase.svg",
			alt: "Supabase",
		},
	},
	{
		row: 3,
		col: 4,
		logo: {
			src: "/icons/connectors/netlify.svg",
			alt: "Netlify",
		},
	},
	{
		row: 4,
		col: 1,
		logo: {
			src: "/icons/connectors/discord.svg",
			alt: "Discord",
		},
	},
	{
		row: 4,
		col: 3,
		logo: {
			src: "/icons/connectors/twilio.svg",
			alt: "Twilio",
		},
	},
];
