import {
  isLessonSearchHit,
  LessonSearchHit,
  SearchHit,
  UnitSearchHit,
} from "../../pages/beta/teachers/search";
import Flex from "../Flex";
import LessonListItem from "../UnitAndLessonLists/LessonList/LessonListItem";
import { LI, UL } from "../Typography";
import UnitListItem from "../UnitAndLessonLists/UnitList/UnitListItem";
import Box from "../Box";
import Pagination from "../Pagination";
import usePagination from "../Pagination/usePagination";
import {
  TeachersKeyStageSubjectUnitsData,
  TeachersKeyStageSubjectUnitsLessonsData,
} from "../../node-lib/curriculum-api";

interface SearchResultsProps {
  hits: Array<SearchHit>;
}

const keyStageSlugMap: Record<string, string> = {
  "key-stage-1": "ks1",
  "key-stage-2": "ks2",
  "key-stage-3": "ks3",
  "key-stage-4": "ks4",
};

const keyStageTitleMap: Record<string, string> = {
  "Key Stage 1": "KS1",
  "Key Stage 2": "KS2",
  "Key Stage 3": "KS3",
  "Key Stage 4": "KS4",
};

const getLessonObject = (
  hit: LessonSearchHit
): TeachersKeyStageSubjectUnitsLessonsData["lessons"][number] => {
  const { _source } = hit;
  return {
    description: _source.lesson_description,
    themeTitle: _source.theme_title,
    subjectSlug: _source.subject_slug,
    keyStageSlug: keyStageSlugMap[_source.key_stage_slug] || "", // @todo - remove map once new index is created for material views
    keyStageTitle: keyStageTitleMap[_source.key_stage_title] || "",
    subjectTitle: _source.subject_title,
    unitSlug: _source.topic_slug,
    themeSlug: null, // null values -  add to elastic slug index in acorn
    videoCount: null,
    presentationCount: null,
    worksheetCount: null,
    title: _source.title,
    slug: _source.slug,
    hasCopyrightMaterial: false, // this will need to be added to elastic search
  };
};

const getUnitObject = (
  hit: UnitSearchHit
): TeachersKeyStageSubjectUnitsData["units"][number] => {
  const { _source } = hit;
  return {
    title: _source.title,
    slug: _source.slug,
    themeTitle: _source.theme_title,
    themeSlug: null, // null values need to be added to elastic search
    lessonCount: null,
    quizCount: null,
    subjectSlug: _source.subject_slug,
    subjectTitle: _source.subject_title,
    keyStageSlug: keyStageSlugMap[_source.key_stage_slug] || "",
    keyStageTitle: keyStageTitleMap[_source.key_stage_title] || "",
  };
};

export const RESULTS_PER_PAGE = 20;

const SearchResults = (props: SearchResultsProps) => {
  const { hits } = props;

  const paginationProps = usePagination({
    totalResults: hits.length,
    pageSize: RESULTS_PER_PAGE,
    items: hits,
  });
  const { currentPageItems } = paginationProps;
  return (
    <Flex $background={"white"} $flexDirection="column">
      {hits.length ? (
        <>
          <UL $reset>
            {currentPageItems.map((hit) => {
              const { _source } = hit;

              return (
                <LI key={`SearchList-SearchListItem-${_source.slug}`}>
                  {isLessonSearchHit(hit) ? (
                    <LessonListItem {...getLessonObject(hit)} />
                  ) : (
                    <UnitListItem {...getUnitObject(hit)} />
                  )}
                </LI>
              );
            })}
          </UL>
        </>
      ) : null}

      {hits.length > RESULTS_PER_PAGE && (
        <Box $width="100%" $mt={[0, "auto"]} $pt={48}>
          <Pagination {...paginationProps} />
        </Box>
      )}
    </Flex>
  );
};

export default SearchResults;
