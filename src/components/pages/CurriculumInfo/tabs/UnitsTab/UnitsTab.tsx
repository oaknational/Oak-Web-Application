import React, { FC, useState } from "react";

import Box from "@/components/Box/Box";
import Flex from "@/components/Flex/Flex";
import P, { Heading } from "@/components/Typography";
import Card from "@/components/Card/Card";
import { CurriculumUnitsTabData } from "@/node-lib/curriculum-api-2023";
import Icon from "@/components/Icon/Icon";
import OutlineHeading from "@/components/OutlineHeading/OutlineHeading";
import OakLink from "@/components/OakLink/OakLink";
import Button from "@/components/Button/Button";
import BrushBorders from "@/components/SpriteSheet/BrushSvgs/BrushBorders/BrushBorders";
import GridArea from "@/components/Grid/GridArea";
import Grid from "@/components/Grid/Grid";
import Radio from "@/components/RadioButtons/Radio";
import RadioGroup from "@/components/RadioButtons/RadioGroup";

type UnitsTabProps = {
  data: CurriculumUnitsTabData;
};

const UnitsTab: FC<UnitsTabProps> = ({ data }) => {
  type Unit = CurriculumUnitsTabData["units"][number];

  interface Thread {
    title: string;
    slug: string;
  }

  interface Subject {
    subject: string;
    subject_slug: string;
  }

  interface Domain {
    title: string;
    tag_id: number | null;
  }

  interface Tier {
    tier: string;
    tier_slug: string;
  }

  interface YearSelection {
    [key: string]: {
      subject?: Subject | null;
      domain?: Domain | null;
      tier?: Tier | null;
    };
  }

  const threads: Thread[] = [];
  const years: string[] = [];

  const yearData: {
    [key: string]: {
      units: Unit[];
      childSubjects: Subject[];
      domains: Domain[];
      tiers: Tier[];
    };
  } = {};

  data.units.forEach((unit) => {
    // Create list of years
    if (years.every((y) => y !== unit.year)) {
      years.push(unit.year);
    }

    // Create list of threads
    unit.threads.forEach((thread) => {
      if (threads.every((t) => t.slug !== thread.slug)) {
        threads.push(thread);
      }
    });

    // Check if the yearData object has an entry for the unit's year
    // If not, initialize it with default values
    let currentYearData = yearData[unit.year];
    if (!currentYearData) {
      currentYearData = {
        units: [],
        childSubjects: [],
        domains: [],
        tiers: [],
      };
      yearData[unit.year] = currentYearData;
    }

    // Add the current unit
    currentYearData.units.push(unit);

    // Populate list of domain filter values
    // Replace below with domain / domain_slug from API request when updated
    const domain = unit.domains[0];
    if (
      domain &&
      currentYearData.domains.every((d) => d.tag_id !== domain.tag_id)
    ) {
      currentYearData.domains.push(domain);
    }

    // Populate list of child subject filter values
    if (
      unit.subject_parent &&
      unit.subject_parent_slug &&
      currentYearData.childSubjects.every(
        (c) => c.subject_slug !== unit.subject_slug,
      )
    ) {
      currentYearData.childSubjects.push({
        subject: unit.subject,
        subject_slug: unit.subject_slug,
      });
    }

    // Populate list of tier filter values
    if (
      unit.tier &&
      unit.tier_slug &&
      currentYearData.tiers.every((t) => t.tier_slug !== unit.tier_slug)
    ) {
      currentYearData.tiers.push({
        tier: unit.tier,
        tier_slug: unit.tier_slug,
      });
    }
  });

  const initialYearSelection = {} as YearSelection;
  Object.keys(yearData).forEach((year) => {
    const data = yearData[year];
    if (!data) {
      throw new Error("year data missing");
    }
    data.childSubjects.sort((a, b) => {
      if (a.subject_slug === "combined-science") {
        return -1;
      } else if (b.subject_slug === "combined-science") {
        return 1;
      } else {
        return a.subject_slug.localeCompare(b.subject_slug);
      }
    });
    if (data.domains.length > 0) {
      data.domains.sort((a, b) => Number(a.tag_id) - Number(b.tag_id));
      data.domains.unshift({
        title: "All",
        tag_id: null,
      });
    }
    data.tiers.sort((a, b) => a.tier_slug.localeCompare(b.tier_slug));
    initialYearSelection[year] = {
      subject:
        data.childSubjects.find((s) => s.subject_slug === "combined-science") ??
        null,
      domain: data.domains.length ? data.domains[0] : null,
      tier: data.tiers.length ? data.tiers[0] : null,
    };
  });

  const [yearSelection, setYearSelection] =
    useState<YearSelection>(initialYearSelection);

  const buildProgrammeSlug = (unit: Unit) => {
    let slug = `${unit.subject_slug}-${unit.phase_slug}-${unit.keystage_slug}`;
    if (unit.tier_slug) {
      slug = `${slug}-${unit.tier_slug}`;
    }
    if (unit.examboard_slug) {
      slug = `${slug}-${unit.examboard_slug}`;
    }
    return slug;
  };

  function handleSelectSubject(year: string, subject: Subject) {
    const selection = { ...yearSelection[year] };
    selection.subject = subject;
    setYearSelection({ ...yearSelection, [year]: selection });
  }

  function handleSelectDomain(year: string, domain: Domain) {
    const selection = { ...yearSelection[year] };
    selection.domain = domain;
    setYearSelection({ ...yearSelection, [year]: selection });
  }

  function handleSelectTier(year: string, tier: Tier) {
    const selection = { ...yearSelection[year] };
    selection.tier = tier;
    setYearSelection({ ...yearSelection, [year]: selection });
  }

  function isSelectedDomain(year: string, domain: Domain) {
    return yearSelection[year]?.domain?.tag_id === domain.tag_id;
  }

  function isSelectedSubject(year: string, subject: Subject) {
    return yearSelection[year]?.subject?.subject_slug === subject.subject_slug;
  }

  function isSelectedTier(year: string, tier: Tier) {
    return yearSelection[year]?.tier?.tier_slug === tier.tier_slug;
  }

  function isVisibleUnit(year: string, unit: Unit) {
    const s = yearSelection[year];
    if (!s) {
      throw new Error("year selection missing");
    }
    const filterBySubject =
      !s.subject || s.subject.subject_slug === unit.subject_slug;
    const filterByDomain =
      !s.domain ||
      s.domain.tag_id === null ||
      s.domain.tag_id === unit.domains[0]?.tag_id;
    const filterByTier = !s.tier || s.tier?.tier_slug === unit.tier_slug;
    return filterBySubject && filterByDomain && filterByTier;
  }

  function isHighlightedUnit(unit: Unit) {
    if (!selectedThread) {
      return false;
    }
    return unit.threads.some((t) => t.slug === selectedThread.slug);
  }

  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);

  function handleSelectThread(slug: string): void {
    const thread = threads.find((t) => t.slug === slug) ?? null;
    setSelectedThread(thread);
  }

  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  function handleSelectYear(year: string): void {
    setSelectedYear(year);
  }

  return (
    <Box $maxWidth={["100%", "80%"]} $ma={"auto"} $pb={80}>
      <Card
        $background={"lemon30"}
        $pa={0}
        $pl={96}
        $mv={[16, 48]}
        $mh={[16, 0]}
      >
        <Box
          $background={"lemon"}
          $height={"100%"}
          $left={0}
          $position={"absolute"}
          $top={0}
          $width={96}
          $textAlign={"center"}
        >
          <Icon
            name={"bell"}
            size={[48]}
            $position={"relative"}
            $transform={"translateY(-50%)"}
            $top={"50%"}
          />
        </Box>

        <Box $pa={20}>
          <Heading
            tag={"h2"}
            $font={"heading-7"}
            $mb={12}
            data-testid="units-heading"
          >
            Introducing our new curriculum sequence for 2023/2024!
          </Heading>
          <P>
            Units that make up our curricula are fully sequenced, and aligned to
            the national curriculum.
          </P>
        </Box>
      </Card>

      <Grid>
        <GridArea $colSpan={[12, 3]}>
          <Box $mr={16} $mb={32}>
            <Heading tag={"h3"} $font={"heading-7"} $mb={12}>
              Highlight a thread
            </Heading>
            <P $mb={12}>
              Threads are groups of units across the curriculum that build a
              common body of knowledge
            </P>
            <RadioGroup
              aria-label="Highlight a thread"
              value={selectedThread ? selectedThread.slug : ""}
              onChange={handleSelectThread}
            >
              <Box $mv={16}>
                <Radio
                  aria-label={"All threads"}
                  value={""}
                  data-testid={"all-threads-radio"}
                >
                  None highlighted
                </Radio>
              </Box>
              {threads.map((thread) => (
                <Box
                  $ba={1}
                  $background={
                    selectedThread?.slug === thread.slug ? "black" : "white"
                  }
                  $borderColor={
                    selectedThread?.slug === thread.slug ? "black" : "grey4"
                  }
                  $borderRadius={4}
                  $color={
                    selectedThread?.slug === thread.slug ? "white" : "black"
                  }
                  $ph={12}
                  $pt={12}
                  $mb={8}
                  key={thread.slug}
                >
                  <Radio
                    aria-label={thread.title}
                    value={thread.slug}
                    data-testid={"thread-radio"}
                  >
                    {thread.title}
                  </Radio>
                </Box>
              ))}
            </RadioGroup>
          </Box>

          <Box $mr={16} $mb={32}>
            <Heading tag={"h3"} $font={"heading-7"} $mb={12}>
              Year Group
            </Heading>
            <RadioGroup
              aria-label="Select a year group"
              value={selectedYear ?? ""}
              onChange={handleSelectYear}
            >
              <Box $mb={16}>
                <Radio
                  aria-label="All"
                  value={""}
                  data-testid={"all-years-radio"}
                >
                  All
                </Radio>
              </Box>
              {years.map((year) => (
                <Box key={year} $mb={16}>
                  <Radio
                    aria-label={`Year ${year}`}
                    value={year}
                    data-testid={"year-radio"}
                  >
                    Year {year}
                  </Radio>
                </Box>
              ))}
            </RadioGroup>
          </Box>
        </GridArea>
        <GridArea $colSpan={[12, 9]}>
          {Object.keys(yearData)
            .filter((year) => !selectedYear || selectedYear === year)
            .map((year) => {
              const { units, childSubjects, domains, tiers } = yearData[
                year
              ] as (typeof yearData)[string];
              return (
                <Box
                  key={year}
                  $background={"pink30"}
                  $pt={32}
                  $pl={30}
                  $mb={32}
                  $borderRadius={4}
                >
                  <Heading
                    tag="h4"
                    $font={"heading-4"}
                    $mb={32}
                    data-testid="year-heading"
                  >
                    Year {year}
                  </Heading>
                  {childSubjects.length > 0 && (
                    <Box>
                      {childSubjects.map((subject) => (
                        <Button
                          $mr={20}
                          $mb={16}
                          background={
                            isSelectedSubject(year, subject) ? "black" : "white"
                          }
                          key={subject.subject_slug}
                          label={subject.subject}
                          onClick={() => handleSelectSubject(year, subject)}
                          size="small"
                          data-testid="subject-button"
                        />
                      ))}
                    </Box>
                  )}
                  {domains.length > 0 && (
                    <Box>
                      {domains.map((domain) => (
                        <Button
                          $mr={20}
                          $mb={16}
                          background={
                            isSelectedDomain(year, domain) ? "black" : "white"
                          }
                          key={domain.tag_id}
                          label={domain.title}
                          onClick={() => handleSelectDomain(year, domain)}
                          size="small"
                          data-testid="domain-button"
                        />
                      ))}
                    </Box>
                  )}
                  {tiers.length > 0 && (
                    <Box $mb={32}>
                      {tiers.map((tier) => (
                        <Button
                          $mr={16}
                          key={tier.tier_slug}
                          label={tier.tier}
                          onClick={() => handleSelectTier(year, tier)}
                          size="small"
                          variant="minimal"
                          isCurrent={isSelectedTier(year, tier)}
                          currentStyles={["underline"]}
                          data-testid="tier-button"
                        />
                      ))}
                    </Box>
                  )}
                  <Flex $flexWrap={"wrap"} data-testid="unit-cards">
                    {units
                      .filter((unit) => isVisibleUnit(year, unit))
                      .map((unit, index) => {
                        return (
                          <Card
                            key={unit.slug}
                            $background={
                              isHighlightedUnit(unit) ? "black" : "white"
                            }
                            $color={isHighlightedUnit(unit) ? "white" : "black"}
                            $flexGrow={"unset"}
                            $mb={32}
                            $mr={28}
                            $pb={64}
                            $position={"relative"}
                            $width={["100%", "calc(33% - 26px)"]}
                            data-testid={
                              isHighlightedUnit(unit)
                                ? "highlighted-unit-card"
                                : "unit-card"
                            }
                          >
                            <BrushBorders
                              color={
                                isHighlightedUnit(unit) ? "black" : "white"
                              }
                            />
                            <OutlineHeading tag={"h3"} $fontSize={24} $mb={12}>
                              {index + 1}
                            </OutlineHeading>
                            <Heading tag={"h3"} $font={"heading-7"}>
                              {unit.title}
                            </Heading>
                            <Box
                              $position={"absolute"}
                              $bottom={16}
                              $right={16}
                              $font={"body-2-bold"}
                            >
                              <OakLink
                                page="lesson-index"
                                viewType="teachers-2023"
                                programmeSlug={buildProgrammeSlug(unit)}
                                unitSlug={unit.slug}
                                data-testid="unit-link"
                              >
                                Unit info
                                <Icon
                                  name="chevron-right"
                                  verticalAlign="bottom"
                                />
                              </OakLink>
                            </Box>
                          </Card>
                        );
                      })}
                  </Flex>
                </Box>
              );
            })}
        </GridArea>
      </Grid>
    </Box>
  );
};
export default UnitsTab;
