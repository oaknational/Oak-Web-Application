import os
import re
import json
import logging
import argparse
from collections import defaultdict
from typing import Dict, List, Set, Tuple


logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class NextJsCodebaseAnalyzer:
    def __init__(self, root_dir: str):
        self.root_dir = root_dir

        self.hook_call_patterns = [
            r'use[A-Z]\w+\s*\('  # Matches hook calls
        ]
        self.hook_declaration_patterns = [
            r'function\s+use[A-Z]\w+',  # Matches function declarations
            r'const\s+use[A-Z]\w+'  # Matches const declarations
        ]
        # Define hook and utility categorization patterns
        self.hook_categories = {
            'components/teacherHooks': ['Teacher'],
            'components/pupilHooks': ['Pupil'],
            'components/curriculumHooks': ['Curriculum'],
            'components/genericPagesHooks': ['Generic', 'Page'],
            'components/appHooks': ['App'],
            'components/sharedHooks': ['Shared'],
        }

        
    def is_schema_file(self, file_path: str) -> bool:
        return file_path.endswith('schema.ts') or file_path.endswith('schema.js')

    def is_fixture_file(self, file_path: str) -> bool:
        return file_path.endswith('fixture.ts') or file_path.endswith('fixture.js')

    def is_test_file(self, file_path: str) -> bool:
        return file_path.endswith(('.test.ts', '.spec.ts', '.test.js', '.spec.js', 'test.tsx', 'spec.tsx'))


    def get_hook_category(self, hook_name: str, dependencies: Set[str]) -> str:

        is_debug = hook_name == 'useLessonDownloadExistenceCheck'

        dependencies_copy = dependencies.copy()
        # check if hook is used exclusively by components
        is_component_hook = all('components' in dep for dep in dependencies)

        if is_component_hook:
            # Check if the hook is used exclusively by a single component
            if len(dependencies) == 1:
                component_dir = dependencies_copy.pop().replace('./src', '')
                component_dir = component_dir.split('/')
                component_dir.pop()
                # remove empty strings from the list
                component_dir = [x for x in component_dir if x != '']
                if(len(component_dir) > 2):
                    component_dir = '/'.join(component_dir)
                    return os.path.join(component_dir, 'hooks')

            # Check if the hook is used in multiple domains
            domains = set()
            for category, prefixes in self.hook_categories.items():
                if any(prefix.lower() in dep.lower() for dep in dependencies for prefix in prefixes):
                    domains.add(category)
            if len(domains) > 1:
                return 'components/hooks'
            else:
                return list(domains)[0]
            

        # check if the hook is used in pages
        is_page_hook = False
        possible_page_paths = ['pages/', 'pages-helpers/']
        if all(any(prefix in dep for prefix in possible_page_paths) for dep in dependencies):
            is_page_hook = True
        
        if is_page_hook:
            return 'pages-helpers/hooks'
        
                
        # Default categorization logic
        for category, prefixes in self.hook_categories.items():
            if dependencies and all(
                any(prefix.lower() in dep.lower() for prefix in prefixes)
                for dep in dependencies
            ):
                return category
        if all('components/' in dep for dep in dependencies):
            return 'components/hooks'
        elif all('api' in dep for dep in dependencies):
            return 'api-helpers/hooks'
        return 'hooks'

        # Check if the utility is used exclusively by a single component
        component_dirs = set()
        for dep in dependencies:
            component_dir = self.get_component_directory(dep)
            if component_dir:
                component_dirs.add(component_dir)
        if len(component_dirs) == 1:
            component_dir = component_dirs.pop()
            return os.path.join(component_dir, 'utils')
        
        # Check if the utility is used in multiple domains
        domains = set()
        for category, prefixes in self.util_categories.items():
            if any(prefix.lower() in dep.lower() for dep in dependencies for prefix in prefixes):
                domains.add(category)
        if len(domains) > 1:
            return 'components/shared/utils'
        # Default categorization logic
        for category, prefixes in self.util_categories.items():
            if dependencies and all(
                any(prefix.lower() in dep.lower() for prefix in prefixes)
                for dep in dependencies
            ):
                return category
        if any('api' in dep for dep in dependencies):
            return 'api-helpers/utils'
        return 'utils'
        
    def scan_files(self) ->  Tuple[Dict[str, List[str]], Dict[str, List[str]]]:
        hook_calls = defaultdict(set)
        hook_declarations = defaultdict(set)
        
        for root, _, files in os.walk(self.root_dir):
            for file in files:
                if file.endswith(('.ts', '.tsx')):
                    file_path = os.path.join(root, file)
                    if self.is_schema_file(file_path) or self.is_fixture_file(file_path) or self.is_test_file(file_path):
                        continue
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                        found_hook_calls = self._find_patterns(content, self.hook_call_patterns)
                        found_hook_declarations = self._find_patterns(content, self.hook_declaration_patterns)
                        if found_hook_calls:
                            hook_calls[file_path].update(found_hook_calls)
                        if found_hook_declarations:
                            hook_declarations[file_path].update(found_hook_declarations)
                    except Exception as e:
                        logging.error(f"Error processing {file_path}: {e}")

        

                        
        return ({k: sorted(list(v)) for k, v in hook_calls.items()}, 
                {k: sorted(list(v)) for k, v in hook_declarations.items()})
        
    
    def _find_patterns(self, content: str, patterns: List[str]) -> Set[str]:
        found = set()
        for pattern in patterns:
            matches = re.finditer(pattern, content)
            for match in matches:
                name = match.group(0).split()[-1]
                name = name.replace('=>', '').strip()
                name = name.replace('(', '').strip()
                if (name and 
                    not name.startswith(('(', '{', '=>')) and 
                    not (name[0].isupper() and 'use' not in name)):
                    found.add(name)
        return found
    
    def analyze_dependencies(self, hook_calls: Dict[str, List[str]], hook_declarations: Dict[str, List[str]]) -> Dict[str, Set[str]]:
        dependencies = defaultdict(set)
        no_dependencies = set()
        declarations = defaultdict(str)

        all_hook_declarations = {hook for hooks in hook_declarations.values() for hook in hooks}
        all_hook_calls = {hook for hooks in hook_calls.values() for hook in hooks}
        
        for file_path in hook_calls.keys():
            for hook in hook_calls[file_path]:
                if hook in all_hook_declarations:
                    dependencies[hook].add(file_path)
              
        for file_path in hook_declarations.keys():
            for hook in hook_declarations[file_path]:
                if hook not in all_hook_calls:
                    no_dependencies.add(hook)
                else:
                    declarations[hook] = file_path
                    
        return dependencies, declarations, no_dependencies
    
    def suggest_organization(self, dependencies: Dict[str, Set[str]]) -> Dict[str, List[str]]:
        suggestions = defaultdict(set)
        
        # Analyze hooks
        for hook in dependencies.keys():
            deps = dependencies.get(hook, set())
            category = self.get_hook_category(hook, deps)
            suggestions[category].add(hook)
            logging.info(f"Categorized hook {hook} as {category} based on dependencies: {deps}")
        
        return {k: sorted(list(v)) for k, v in suggestions.items()}

def generate_json_report(root_dir: str) -> str:
    analyzer = NextJsCodebaseAnalyzer(root_dir)
    hook_calls, hook_declarations = analyzer.scan_files()
    dependencies, declarations, no_dependencies = analyzer.analyze_dependencies(hook_calls, hook_declarations)

    suggestions = analyzer.suggest_organization(dependencies)
    
    dependencies = {k: sorted(list(v)) for k, v in dependencies.items()}

    no_dependencies = sorted(list(no_dependencies))
    suggestions = {k: v for k, v in suggestions.items() if v}
    
    report = {
        "declarations": declarations,
        "dependencies": dependencies,
        "unused_hooks": no_dependencies,
        "suggested_organization": suggestions
    }
    
    return json.dumps(report, indent=2)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Analyze and reorganize a Next.js codebase.")
    parser.add_argument("--root_dir", default="./src", help="Root directory of the codebase.")
    parser.add_argument("--output", default="scripts/dev/refactor/codebase_organization.json", help="Output JSON file path.")
    args = parser.parse_args()

    json_report = generate_json_report(args.root_dir)
    with open(args.output, 'w') as f:
        f.write(json_report)
    logging.info(f"Report saved to {args.output}")