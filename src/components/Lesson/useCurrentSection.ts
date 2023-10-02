import { useEffect, useState } from "react";

import { LessonPageLinkAnchorId } from "./lesson.helpers";

type Section = {
  id: LessonPageLinkAnchorId;
  ref: React.RefObject<HTMLElement>;
};

/**
 * Sets the hash in the URL without scrolling the page.
 */
function safeSetHash(hash: string): void {
  const element = document.getElementById(hash);

  if (element) {
    // Temporarily remove the id
    element.id = "";
  }

  // Update the hash
  window.location.hash = hash;

  if (element) {
    // Restore the id
    element.id = hash;
  }
}

export function useCurrentSection(sections: Section[]) {
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [lastScrollTop, setLastScrollTop] = useState<number>(0);

  useEffect(() => {
    let running = false;

    const checkScroll = () => {
      if (running) return;
      running = true;

      requestAnimationFrame(() => {
        const currentScrollTop =
          window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollTop !== lastScrollTop) {
          setIsScrolling(true);
          // Your scroll handling logic here
        } else {
          setIsScrolling(false);
        }

        setLastScrollTop(currentScrollTop);

        let activeId: string | null = currentSection;

        sections.forEach((section) => {
          const rect = section.ref.current?.getBoundingClientRect();
          if (rect) {
            // Check if the top of the section is in the viewport
            if (rect.top >= 0 && rect.top <= window.innerHeight * 0.5) {
              activeId = section.id || null;
            }
          }
        });

        setCurrentSection(activeId);

        running = false;
      });
    };

    window.addEventListener("scroll", checkScroll);

    return () => {
      window.removeEventListener("scroll", checkScroll);
    };
  }, [currentSection, lastScrollTop, sections]);

  useEffect(() => {
    const checkScroll = () => {
      const currentScrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (currentScrollTop !== lastScrollTop) {
        setIsScrolling(true);
        // Your scroll handling logic here
      } else {
        setIsScrolling(false);
      }

      setLastScrollTop(currentScrollTop);
    };

    const intervalId = setInterval(checkScroll, 50);

    return () => {
      clearInterval(intervalId);
    };
  }, [lastScrollTop, currentSection, sections]);

  useEffect(() => {
    if (currentSection && !isScrolling) {
      safeSetHash(currentSection);
    }
  }, [currentSection, isScrolling]);

  return { currentSection, isScrolling };
}

// import { useEffect, useState } from "react";

// import { LessonPageLinkAnchorId } from "./lesson.helpers";

// type Section = {
//   id: LessonPageLinkAnchorId;
//   ref: React.RefObject<HTMLElement>;
// };

// /**
//  * Sets the hash in the URL without scrolling the page.
//  * This means that when the user stops scrolling, the browser will not
//  * scroll to the top of the section.
//  */
// function safeSetHash(hash: string): void {
//   const element = document.getElementById(hash);

//   if (element) {
//     // Temporarily remove the id
//     element.id = "";
//   }

//   // Update the hash
//   window.location.hash = hash;

//   if (element) {
//     // Restore the id
//     element.id = hash;
//   }
// }

// export function useCurrentSection(sections: Section[]) {
//   const [currentSection, setCurrentSection] = useState<string | null>(null);
//   const [isScrolling, setIsScrolling] = useState<boolean>(false);
//   const [lastScrollTop, setLastScrollTop] = useState<number>(0);

//   useEffect(() => {
//     let running = false;

//     const checkScroll = () => {
//       if (running) return;
//       running = true;

//       requestAnimationFrame(() => {
//         const currentScrollTop =
//           window.pageYOffset || document.documentElement.scrollTop;

//         if (currentScrollTop !== lastScrollTop) {
//           setIsScrolling(true);
//           // Your scroll handling logic here
//         } else {
//           setIsScrolling(false);
//         }

//         setLastScrollTop(currentScrollTop);

//         // let activeId: string | null = currentSection;

//         const activeSection = sections.reduce(
//           (acc: (Section & { top: number }) | null, section) => {
//             const rect = section.ref.current?.getBoundingClientRect();

//             if (rect) {
//               const isAboveThreshold = rect.top <= window.innerHeight * 0.5;
//               const isBelowPrevSection = acc ? rect.top > acc.top : true;
//               if (isAboveThreshold && isBelowPrevSection) {
//                 return { ...section, top: rect.top };
//               }
//             }
//             return acc;
//           },
//           null,
//         );

//         // sections.forEach((section) => {
//         //   const rect = section.ref.current?.getBoundingClientRect();
//         //   if (rect) {
//         //     // Check if the top of the section is in the viewport
//         //     if (rect.top >= 0 && rect.top <= window.innerHeight * 0.5) {
//         //       activeId = section.id || null;
//         //     }
//         //   }
//         // });

//         setCurrentSection(activeSection?.id || null);

//         running = false;
//       });
//     };

//     window.addEventListener("scroll", checkScroll);

//     return () => {
//       window.removeEventListener("scroll", checkScroll);
//     };
//   }, [currentSection, lastScrollTop, sections]);

//   useEffect(() => {
//     const checkScroll = () => {
//       const currentScrollTop =
//         window.pageYOffset || document.documentElement.scrollTop;

//       if (currentScrollTop !== lastScrollTop) {
//         setIsScrolling(true);
//         // Your scroll handling logic here
//       } else {
//         setIsScrolling(false);
//       }

//       setLastScrollTop(currentScrollTop);
//     };

//     const intervalId = setInterval(checkScroll, 100);

//     return () => {
//       clearInterval(intervalId);
//     };
//   }, [lastScrollTop, currentSection, sections]);

//   useEffect(() => {
//     if (currentSection && !isScrolling) {
//       safeSetHash(currentSection);
//     }
//   }, [currentSection, isScrolling]);

//   return { currentSection, isScrolling };
// }
