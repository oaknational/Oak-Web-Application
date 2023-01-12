import { SearchHit } from "../../pages/beta/teachers/search";
import Flex from "../Flex";
import LessonListItem from "../Lessons/LessonList/LessonListItem";
import { LI, UL } from "../Typography";
import UnitListItem from "../UnitList/UnitListItem";

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

const getLessonObject = (hit: SearchHit) => {
  const { _source } = hit;
  return {
    description: _source.lesson_description,
    themeTitle: _source.theme_title,
    subjectSlug: _source.subject_slug,
    keyStageSlug: keyStageSlugMap[_source.key_stage_slug] || "",
    keyStageTitle: keyStageTitleMap[_source.key_stage_title] || "",
    subjectTitle: _source.subject_title,
    unitSlug: _source.topic_slug,
    themeSlug: null, // null values -  add to elastic slug index in acorn
    videoCount: null,
    presentationCount: null,
    worksheetCount: null,
    title: _source.title,
    slug: _source.slug,
    type: _source.type,
  };
};

const getUnitObject = (hit: SearchHit) => {
  const { _source } = hit;
  return {
    title: _source.title,
    slug: _source.slug,
    themeTitle: _source.theme_title,
    lessonCount: null,
    quizCount: null,
    subjectSlug: _source.subject_slug,
    subjectTitle: _source.subject_title,
    keyStageSlug: keyStageSlugMap[_source.key_stage_slug] || "",
    keyStageTitle: keyStageTitleMap[_source.key_stage_title] || "",
    type: _source.type,
  };
};

const SearchResults = (props: SearchResultsProps) => {
  const { hits } = props;
  return (
    <Flex $flexDirection="column">
      {hits.length ? (
        <>
          <UL $reset>
            {hits.map((hit) => {
              const { _source } = hit;
              return (
                <LI key={`SearchList-SearchListItem-${_source.slug}`}>
                  {_source.type === "lesson" ? (
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
      {/* {to be added with pagination PR} */}

      {/* {units.length > 5 && (     
          <Box $width="100%" $mt={[0, "auto"]} $pt={48}>
            <Pagination {...paginationProps} />
          </Box>
        )} */}
    </Flex>
  );
};

export default SearchResults;
