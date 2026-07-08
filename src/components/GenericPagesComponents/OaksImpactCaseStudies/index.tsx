import { OakBox, OakCard, OakFlex, OakHeading, OakMaxWidth } from "@oaknational/oak-components";

export type OaksImpactCaseStudiesProps = {
  caseStudies: {
    heading: string;
    href: string;
    imageSrc: string;
  }[];
};

export const OaksImpactCaseStudies = ( { caseStudies }: OaksImpactCaseStudiesProps) => {
	return (
		<OakBox $background={"bg-decorative2-subdued"}>
			<OakMaxWidth>
				<OakFlex
					$flexDirection={"column"}
					$ph={["spacing-32", "spacing-40", "spacing-100"]}
					$pv={["spacing-56", "spacing-80"]}
					$gap={"spacing-24"}
				>
					<OakHeading
						tag={"h2"}
						$font={["heading-5", "heading-3"]}
					>
						Case studies
					</OakHeading>
					<OakFlex
						$gap={"spacing-16"}
						$flexDirection={["column", "row"]}
					>
						{caseStudies.map((caseStudy, index) => (
							<OakCard
								key={index}
								heading={caseStudy.heading}
								href={caseStudy.href}
								imageSrc={caseStudy.imageSrc}
								aspectRatio="4/3"
								linkText="Watch the video"
								cardWidth={"100%"}
							/>
						))}
					</OakFlex>
				</OakFlex>
			</OakMaxWidth>
		</OakBox>
	);
};
