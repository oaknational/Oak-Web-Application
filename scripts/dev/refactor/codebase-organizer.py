import os
import re
import json
import logging
import argparse
from collections import defaultdict
from typing import Dict, List, Set, Tuple

# TODO
# - only include hooks and functions which are declare in the code base
# - categorize the pages helpers hooks
# - revisit api helpers hooks categorization

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class NextJsCodebaseAnalyzer:
    def __init__(self, root_dir: str):
        self.root_dir = root_dir
        # TODO: split these into declarations and calls
        self.hook_patterns = [
            r'use[A-Z]\w+',  # Matches useEffect, useState, etc.
            r'function\s+use[A-Z]\w+',  # Matches function declarations
            r'const\s+use[A-Z]\w+'  # Matches const declarations
        ]
        # TODO: split these into declarations and calls
        self.util_patterns = [
            r'export\s+(?:const|function|class)\s+(?!use[A-Z])[a-z]\w+',  
            r'const\s+(?!use[A-Z])[a-z]\w+\s*=\s*(?:\(.*\)|async\s*\(.*\))\s*=>'
        ]
        self.excluded_hooks = {
            'useEffect', 'useState', 'useContext', 'useReducer', 
            'useCallback', 'useMemo', 'useRef', 'useRouter',
            'useLayoutEffect', 'useImperativeHandle', 'useDebugValue',
            'useQuery', 'useMutation', 'useQueryClient'
        }
        # Define hook and utility categorization patterns
        self.hook_categories = {
            'components/teacherHooks': ['Teacher'],
            'components/pupilHooks': ['Pupil'],
            'components/curriculumHooks': ['Curriculum'],
            'components/genericPagesHooks': ['Generic', 'Page'],
            'components/appHooks': ['App'],
            'components/sharedHooks': ['Shared'],
        }
        self.util_categories = {
            'components/teacherUtils': ['Teacher'],
            'components/pupilUtils': ['Pupil'],
            'components/curriculumUtils': ['Curriculum'],
            'components/genericPagesUtils': ['Generic', 'Page'],
            'components/appUtils': ['App'],
            'components/sharedUtils': ['Shared'],
        }
        
    def is_schema_file(self, file_path: str) -> bool:
        return file_path.endswith('schema.ts') or file_path.endswith('schema.js')

    def is_fixture_file(self, file_path: str) -> bool:
        return file_path.endswith('fixture.ts') or file_path.endswith('fixture.js')

    def is_test_file(self, file_path: str) -> bool:
        return file_path.endswith(('.test.ts', '.spec.ts', '.test.js', '.spec.js'))

    def is_fixture_function(self, func_name: str) -> bool:
        return 'fixture' in func_name.lower()

    def get_component_directory(self, file_path: str) -> str:
        """
        Extracts the component directory from a file path.
        Assumes components are organized as `components/ComponentName/...`.
        """
        parts = file_path.split(os.sep)
        if 'components' in parts:
            component_index = parts.index('components')
            if component_index + 1 < len(parts):
                return os.path.join('components', parts[component_index + 1])
        return None

    def get_hook_category(self, hook_name: str, dependencies: Set[str]) -> str:

        if len(dependencies) == 0:
            return 'unused-hooks'
        
        # check if hook is used exclusively by components
        is_component_hook = all('components' in dep for dep in dependencies)

        if is_component_hook:
            # Check if the hook is used exclusively by a single component
            component_dirs = set()
            for dep in dependencies:
                component_dir = self.get_component_directory(dep)
                if component_dir:
                    component_dirs.add(component_dir)
            if len(component_dirs) == 1:
                component_dir = component_dirs.pop()
                paths = component_dir.split(os.sep)
                if len(paths) > 2:
                    return os.path.join(component_dir, 'hooks')
        
            # Check if the hook is used in multiple domains
            domains = set()
            for category, prefixes in self.hook_categories.items():
                if any(prefix.lower() in dep.lower() for dep in dependencies for prefix in prefixes):
                    domains.add(category)
            if len(domains) > 1:
                return 'components/hooks'
            

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
        elif any('api' in dep for dep in dependencies):
            return 'api-helpers/hooks'
        return 'hooks'

    def get_util_category(self, util_name: str, dependencies: Set[str]) -> str:
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
        
    def scan_files(self) -> Tuple[Dict[str, List[str]], Dict[str, List[str]]]:
        hooks = defaultdict(set)
        utils = defaultdict(set)
        
        for root, _, files in os.walk(self.root_dir):
            for file in files:
                if file.endswith(('.ts', '.tsx', '.js', '.jsx')):
                    file_path = os.path.join(root, file)
                    if self.is_schema_file(file_path) or self.is_fixture_file(file_path) or self.is_test_file(file_path):
                        continue
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                        found_hooks = self._find_patterns(content, self.hook_patterns)
                        found_hooks = {h for h in found_hooks if h not in self.excluded_hooks}
                        if found_hooks:
                            hooks[file_path].update(found_hooks)
                        found_utils = self._find_patterns(content, self.util_patterns)
                        found_utils = {u for u in found_utils if not u[0].isupper() and not self.is_fixture_function(u)}
                        if found_utils:
                            utils[file_path].update(found_utils)
                    except Exception as e:
                        logging.error(f"Error processing {file_path}: {e}")
                        
        return (
            {k: sorted(list(v)) for k, v in hooks.items()},
            {k: sorted(list(v)) for k, v in utils.items()}
        )
    
    def _find_patterns(self, content: str, patterns: List[str]) -> Set[str]:
        found = set()
        for pattern in patterns:
            matches = re.finditer(pattern, content)
            for match in matches:
                name = match.group(0).split()[-1]
                name = name.replace('=>', '').strip()
                if (name and 
                    not name.startswith(('(', '{', '=>')) and 
                    not (name[0].isupper() and 'use' not in name)):
                    found.add(name)
        return found
    
    def analyze_dependencies(self, hooks: Dict[str, List[str]], utils: Dict[str, List[str]]) -> Dict[str, Set[str]]:
        dependencies = defaultdict(set)
        all_functions = {func: file for file, funcs in {**hooks, **utils}.items() for func in funcs}
        
        for file_path in {**hooks, **utils}.keys():
            if self.is_schema_file(file_path) or self.is_fixture_file(file_path) or self.is_test_file(file_path):
                continue
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                for func_name in all_functions:
                    if file_path != all_functions[func_name]:
                        func_call = f"{func_name}("
                        if func_call in content:
                            dependencies[func_name].add(file_path)
            except Exception as e:
                logging.error(f"Error analyzing dependencies in {file_path}: {e}")
                    
        return dependencies
    
    def suggest_organization(self, hooks: Dict[str, List[str]], utils: Dict[str, List[str]], 
                           dependencies: Dict[str, Set[str]]) -> Dict[str, List[str]]:
        suggestions = defaultdict(set)
        
        # Analyze hooks
        for file, hook_list in hooks.items():
            for hook in hook_list:
                deps = dependencies.get(hook, set())
                category = self.get_hook_category(hook, deps)
                suggestions[category].add(hook)
                logging.info(f"Categorized hook {hook} as {category} based on dependencies: {deps}")
        
        # Analyze utils
        # for file, util_list in utils.items():
        #     if self.is_schema_file(file) or self.is_fixture_file(file) or self.is_test_file(file):
        #         continue
        #     for util in util_list:
        #         deps = dependencies.get(util, set())
        #         category = self.get_util_category(util, deps)
        #         suggestions[category].add(util)
        #         logging.info(f"Categorized utility {util} as {category} based on dependencies: {deps}")
        
        return {k: sorted(list(v)) for k, v in suggestions.items()}

def generate_json_report(root_dir: str) -> str:
    analyzer = NextJsCodebaseAnalyzer(root_dir)
    hooks, utils = analyzer.scan_files()
    dependencies = analyzer.analyze_dependencies(hooks, utils)
    suggestions = analyzer.suggest_organization(hooks, utils, dependencies)
    
    dependencies = {k: sorted(list(v)) for k, v in dependencies.items()}
    suggestions = {k: v for k, v in suggestions.items() if v}
    
    report = {
        "current_structure": {
            "hooks": {file: funcs for file, funcs in hooks.items() if funcs},
            "utils": {file: funcs for file, funcs in utils.items() if funcs}
        },
        "dependencies": dependencies,
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