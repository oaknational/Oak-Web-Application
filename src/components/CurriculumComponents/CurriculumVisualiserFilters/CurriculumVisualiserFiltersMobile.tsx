import React from "react";
// import { OakP, OakFlex, OakSpan } from "@oaknational/oak-components";
// import styled from "styled-components";

// import { Fieldset, FieldsetLegend } from "../OakComponentsKitchen/Fieldset";
// import { RadioButton, RadioGroup } from "../OakComponentsKitchen/SimpleRadio";
// import FocusIndicator from "../OakComponentsKitchen/FocusIndicator";

// import { CurriculumVisualiserFiltersProps } from "./CurriculumVisualiserFilters";
// import { highlightedUnitCount } from "./helpers";

// import Box from "@/components/SharedComponents/Box";
// import Button from "@/components/SharedComponents/Button/Button";
// import ButtonGroup from "@/components/SharedComponents/ButtonGroup";
// import { getYearGroupTitle } from "@/utils/curriculum/formatting";
// import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
// import useAnalytics from "@/context/Analytics/useAnalytics";
// import { Thread } from "@/utils/curriculum/types";

// const StyledButton = styled("button")`
//   all: unset;
//   color: inherit;
//   cursor: pointer;
//   padding: 12px;
//   width: fit-content;
//   display: inline-block;
//   white-space: nowrap;
//   border-radius: 4px;
//   margin-right: 0;
//   border: 1px solid ${({ theme }) => theme.colors.grey40};

//   &:hover:not([aria-pressed="true"]) {
//     background: #f2f2f2;
//   }
// `;

// const ScrollableWrapper = styled.div`
//   position: relative;
//   width: 100%;

//   &::before {
//     content: "";
//     position: absolute;
//     top: 0;
//     left: 0;
//     height: 100%;
//     width: 20px;
//     background: linear-gradient(
//       to left,
//       rgba(255, 255, 255, 0),
//       rgba(255, 255, 255, 1)
//     );
//     pointer-events: none;
//     z-index: 1;
//   }

//   &::after {
//     content: "";
//     position: absolute;
//     top: 0;
//     right: 0;
//     height: 100%;
//     width: 25px;
//     background: linear-gradient(
//       to right,
//       rgba(255, 255, 255, 0),
//       rgba(255, 255, 255, 1)
//     );
//     pointer-events: none;
//     z-index: 1;
//   }
// `;

// const StyledButtonGroup = styled(ButtonGroup)`
//   overflow-x: auto;
//   overflow-y: hidden;
//   position: relative;

//   & > *:first-child {
//     margin-left: 16px;
//   }

//   & > *:not(:last-child) {
//     margin-right: -5px;
//   }
// `;

// function StickyBit({
//   onOpenModal,
//   data,
//   trackingData,
//   selectedThread,
//   selectedYear,
//   yearSelection,
//   onSelectYear,
// }: Pick<
//   CurriculumVisualiserFiltersProps,
//   | "data"
//   | "trackingData"
//   | "selectedThread"
//   | "selectedYear"
//   | "yearSelection"
//   | "onSelectYear"
// > & { onOpenModal: () => void }) {
//   const { track } = useAnalytics();
//   const { analyticsUseCase } = useAnalyticsPageProps();

//   const { yearData, threadOptions, yearOptions } = data;

//   const highlightedUnits = highlightedUnitCount(
//     yearData,
//     null,
//     yearSelection,
//     selectedThread,
//   );

//   function trackSelectYear(year: string): void {
//     if (trackingData) {
//       const { subjectTitle, subjectSlug } = trackingData;
//       track.yearGroupSelected({
//         yearGroupName: year,
//         yearGroupSlug: year,
//         subjectTitle,
//         subjectSlug,
//         analyticsUseCase: analyticsUseCase,
//       });
//     }
//   }

//   const threadDef = (selectedThread: Thread["slug"]) =>
//     threadOptions.find((t) => t.slug === selectedThread);

//   function isSelectedYear(yearOption: string) {
//     return selectedYear === yearOption;
//   }

//   function scrollToYearSection(yearOption: string) {
//     setTimeout(() => {
//       const targetElement = document.getElementById(`year-${yearOption}`);
//       if (targetElement) {
//         const headerOffset = 70;
//         const elementPosition = targetElement.getBoundingClientRect().top;
//         const offsetPosition =
//           elementPosition + window.pageYOffset - headerOffset;

//         window.scrollTo({
//           top: offsetPosition,
//           behavior: "smooth",
//         });

//         // It's key that focus is set after scroll completes otherwise
//         // scroll ends above the intended year section
//         setTimeout(() => {
//           const yearHeading = document.getElementById(`year-${yearOption}`);
//           if (yearHeading instanceof HTMLElement) {
//             yearHeading.setAttribute("tabindex", "-1");
//             yearHeading.focus();
//           }
//         }, 500);
//       }
//     }, 0);
//   }

//   return (
//     <Box
//       $position={["sticky", "static"]}
//       $display={["block", "none"]}
//       $top={0}
//       $zIndex={"fixedHeader"}
//     >
//       <Box
//         $width={"100%"}
//         $background={"white"}
//         $mb={8}
//         data-test-id="filter-mobiles"
//       >
//         <Box>
//           <Box $dropShadow="mobileFilterSelector" $ph={[16, 0]} $pb={16}>
//             <Button
//               label="Highlight a thread"
//               icon="chevron-right"
//               $iconPosition="trailing"
//               variant="buttonStyledAsLink"
//               $mt={16}
//               onClick={onOpenModal}
//               data-testid="mobile-highlight-thread"
//             />
//             {selectedThread && (
//               <OakFlex>
//                 <Box
//                   $textOverflow={"ellipsis"}
//                   $whiteSpace={"nowrap"}
//                   $overflow={"hidden"}
//                   data-testid="highlighted-threads-mobile"
//                   $maxWidth={"50%"}
//                 >
//                   {threadDef(selectedThread)?.title}
//                 </Box>
//                 <Box $mh={6}> • </Box>
//                 <Box data-testid="highlighted-units-box-mobile">
//                   <OakSpan aria-live="polite" aria-atomic="true">
//                     {highlightedUnits} units highlighted
//                   </OakSpan>
//                 </Box>
//               </OakFlex>
//             )}
//           </Box>
//           <Box
//             $pt={2}
//             $dropShadow="mobileFilterSelector"
//             $width={"100%"}
//             data-testid={"year-selection-mobile"}
//           >
//             <ScrollableWrapper>
//               <StyledButtonGroup aria-label="Select a year group">
//                 {yearOptions.map((yearOption) => (
//                   <Box key={yearOption} $pt={8} $ml={5}>
//                     <FocusIndicator
//                       data-testid="year-group-focus-indicator"
//                       $display={"inline-block"}
//                       $mb="space-between-ssx"
//                       $mr="space-between-ssx"
//                       $background={
//                         isSelectedYear(yearOption) ? "black" : "white"
//                       }
//                       $color={isSelectedYear(yearOption) ? "white" : "black"}
//                       $borderRadius={"border-radius-s"}
//                       $font="heading-7"
//                       disableMouseHover={isSelectedYear(yearOption)}
//                     >
//                       <StyledButton
//                         data-testid="year-group-filter-button"
//                         aria-pressed={isSelectedYear(yearOption)}
//                         onClick={() => {
//                           onSelectYear(yearOption);
//                           trackSelectYear(yearOption);
//                           scrollToYearSection(yearOption);
//                         }}
//                       >
//                         {getYearGroupTitle(yearData, yearOption)}
//                       </StyledButton>
//                     </FocusIndicator>
//                   </Box>
//                 ))}
//               </StyledButtonGroup>
//             </ScrollableWrapper>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// function Modal({
//   data,
//   selectedThread,
//   yearSelection,
//   onSelectThread,
//   onOpenModal,
// }: Pick<
//   CurriculumVisualiserFiltersProps,
//   | "data"
//   | "selectedThread"
//   | "selectedYear"
//   | "yearSelection"
//   | "onSelectThread"
// > & { onOpenModal: () => void }) {
//   const { threadOptions, yearData } = data;

//   function isSelectedThread(thread: Thread) {
//     return selectedThread === thread.slug;
//   }

//   const highlightedUnits = highlightedUnitCount(
//     yearData,
//     null,
//     yearSelection,
//     selectedThread,
//   );

//   return (
//     <Box
//       $background={"white"}
//       $position="fixed"
//       $top={0}
//       $height={"100%"}
//       $zIndex={"modalDialog"}
//       $display={["block", "none"]}
//     >
//       <Box $position={"absolute"} $top={20} $right={16} $zIndex={"inFront"}>
//         <Button
//           label=""
//           aria-label="Close Menu"
//           icon={"cross"}
//           variant={"minimal"}
//           size={"large"}
//           onClick={onOpenModal}
//           aria-expanded={open}
//         />
//       </Box>
//       <Fieldset
//         $ml={16}
//         $mt={32}
//         $mr={16}
//         data-testid="mobile-thread-modal"
//         $height={"85%"}
//         $overflow={"scroll"}
//       >
//         <FieldsetLegend $font={"heading-7"} $mb="space-between-m">
//           Highlight a thread
//         </FieldsetLegend>
//         <OakP $mb="space-between-m">
//           Threads are groups of units across the curriculum that build a common
//           body of knowledge
//         </OakP>
//         <RadioGroup
//           name="thread"
//           value={selectedThread ?? ""}
//           onChange={(e) => onSelectThread(e.target.value)}
//         >
//           <Box>
//             <Box
//               $mv={16}
//               $pl={12}
//               $position={"relative"}
//               $bl={1}
//               $borderColor="transparent"
//             >
//               <RadioButton
//                 aria-label={"None highlighted"}
//                 value={""}
//                 data-testid={"no-threads-radio-mobile"}
//               >
//                 None highlighted
//               </RadioButton>
//             </Box>
//             {threadOptions.map((threadOption) => {
//               const isSelectedMobile = isSelectedThread(threadOption);
//               return (
//                 <Box
//                   $position={"relative"}
//                   $ba={1}
//                   $background={isSelectedMobile ? "black" : "white"}
//                   $borderColor={isSelectedMobile ? "black" : "grey40"}
//                   $borderRadius={4}
//                   $color={isSelectedMobile ? "white" : "black"}
//                   $font={isSelectedMobile ? "heading-light-7" : "body-2"}
//                   $ph={12}
//                   $pt={12}
//                   $mb={8}
//                   key={threadOption.slug}
//                 >
//                   <RadioButton
//                     aria-label={threadOption.title}
//                     value={threadOption.slug}
//                     data-testid={
//                       isSelectedMobile
//                         ? "selected-thread-radio-mobile"
//                         : "thread-radio-mobile"
//                     }
//                   >
//                     <OakSpan>
//                       {threadOption.title}
//                       <OakSpan aria-live="polite" aria-atomic="true">
//                         {isSelectedMobile && (
//                           <>
//                             <br />
//                             {highlightedUnits}
//                             {highlightedUnits === 1 ? " unit " : " units "}
//                             highlighted
//                           </>
//                         )}
//                       </OakSpan>
//                     </OakSpan>
//                   </RadioButton>
//                 </Box>
//               );
//             })}
//           </Box>
//         </RadioGroup>
//       </Fieldset>
//       <OakFlex
//         $position={"fixed"}
//         $width={"100%"}
//         $background={"white"}
//         $bottom={["all-spacing-0"]}
//         $right={["all-spacing-0"]}
//         $justifyContent={"left"}
//       >
//         <Button
//           $ma={16}
//           label="Done"
//           data-testid="mobile-done-thread-modal-button"
//           icon="arrow-right"
//           $iconPosition="trailing"
//           iconBackground="black"
//           onClick={onOpenModal}
//         />
//       </OakFlex>
//     </Box>
//   );
// }

export default function CurriculumVisualiserFiltersMobile() {
  // {
  //   filters,
  //   onChangeFilters,
  //   trackingData,
  //   data,
  // }: CurriculumVisualiserFiltersProps
  // const [mobileThreadModalOpen, setMobileThreadModalOpen] =
  //   useState<boolean>(false);

  return <div />;
  // return mobileThreadModalOpen ? (
  //   <Modal
  //     data={data}
  //     selectedThread={selectedThread}
  //     selectedYear={selectedYear}
  //     yearSelection={yearSelection}
  //     onOpenModal={handleMobileThreadModal}
  //     onSelectThread={onSelectThread}
  //   />
  // ) : (
  //   <StickyBit
  //     onOpenModal={handleMobileThreadModal}
  //     data={data}
  //     selectedYear={selectedYear}
  //     selectedThread={selectedThread}
  //     trackingData={trackingData}
  //     yearSelection={yearSelection}
  //     onSelectYear={onSelectYear}
  //   />
  // );
}
