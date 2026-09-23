import { Container } from '@/components/container';
import { linkClassName } from '@/lib/link-styles';
import { linkedInProfileUrl, siteName } from '@/lib/site';

const socialLinks = [
	{
		label: 'LinkedIn',
		href: linkedInProfileUrl,
	},
	{
		label: 'GitHub',
		href: 'https://github.com/odanieldcs',
	},
	{
		label: 'YouTube',
		href: 'https://www.youtube.com/@odanieldcs',
	},
	{
		label: 'Instagram',
		href: 'https://www.instagram.com/odanieldcs',
	},
] as const;

const footerLinkClassName = linkClassName.replace('text-link', 'text-muted');

export function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="border-t border-gray-200 py-4">
			<Container
				width="page"
				className="flex flex-col items-center gap-content-gap py-section text-center"
			>
				<ul className="flex list-none flex-wrap justify-center gap-content-gap text-caption">
					{socialLinks.map((link) => (
						<li key={link.href}>
							<a
								href={link.href}
								className={footerLinkClassName}
								target="_blank"
								rel="noopener noreferrer"
							>
								{link.label}
							</a>
						</li>
					))}
				</ul>
				<p className="flex flex-wrap justify-center gap-x-content-gap text-caption text-muted">
					<span>
						© {year} {siteName}
					</span>
					<span>Made with love in Gravataí 🇧🇷</span>
				</p>
			</Container>
		</footer>
	);
}
