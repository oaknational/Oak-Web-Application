# `./scripts/dev/curriculum`
Some handy development scripts for the curriculum visualiser. 

## Usage
All the scripts are contained in a single CLI app, you can pass `--help` to the individual commands also

```bash
./scripts/dev/curriculum/automate --help
# automate <command>
# 
# Commands:
#   automate fixtures                         generates fixtures from graphql
#   automate screenshot <label>               screenshot the visualiser
#   automate compare <basepath> <targetpath>  compare two sets of screenshots
# 
# Options:
#   --help     Show help                                                 [boolean]
#   --version  Show version number                                       [boolean]
```

### `screenshot` & `compare`
Generate some screenshots of your local environment, take snapshot with label `:before`

```bash
./scripts/dev/curriculum/automate screenshot :before
# ...
```

Change branch

```bash
git checkout another-branch
```

Take snapshot with label `:after`

```bash
./scripts/dev/curriculum/automate screenshot :after
# ...
```

Compate the versions

```bash
./scripts/dev/curriculum/automate compare :before :after
# ...
```

#### Using `--basepath`
Generate some screenshots of the production environment

```bash
./scripts/dev/curriculum/automate screenshot :foo --basepath https://www.thenational.academy/
# ...
```



### `fixtures`
Generates fixtures for curriculum squads tests

```bash
./scripts/dev/curriculum/automate fixtures
# 📦 generating: src/utils/curriculum/fixtures/curriculumunits-english-secondary.ts
# 📦 generating: src/utils/curriculum/fixtures/subjectPhaseOptionsIncludeNew.ts
# 📦 generating: src/utils/curriculum/fixtures/curriculumOverview-english-secondary.ts
```

You can define new fixture generation in `./scripts/dev/curriculum/_commands/fixtures.ts`

> [!NOTE]  
> You'll also need to export the correct types in `./src/utils/curriculum/fixtures/index.ts`  


