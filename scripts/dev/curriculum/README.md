# `./scripts/dev/curriculum`
Some handy development scripts for the curriculum visualiser. 

## Usage
All the scripts are contained in a single CLI app, you can pass `--help` to the individual commands also

```bash
./scripts/dev/curriculum/automate --help
# automate <command>
# 
# Commands:
#   automate screenshot                       screenshot the visualiser
#   automate compare <basepath> <targetpath>  compare two sets of screenshots
# 
# Options:
#   --help     Show help                                                 [boolean]
#   --version  Show version number                                       [boolean]
```

### `screenshot` & `compare`
Generate some screenshots of your local environment

> [!NOTE]  
> You might want to use labels instead, see section below  

```bash
./scripts/dev/curriculum/automate screenshot 
# ...
```

Generate some screenshots of the production environment

```bash
./scripts/dev/curriculum/automate screenshot --basepath https://www.thenational.academy/
# ...
```

Compare both envs

```bash
./scripts/dev/curriculum/automate compare ./scripts/dev/curriculum/output/screenshots/www-thenational-academy ./scripts/dev/curriculum/output/screenshots/localhost-3000
# ...
```

Should open a browser with the following showing the two envs

![Screenshot of automate compare output](empty.png)


#### Using labels
Rather than having the `screenshot` command picking names you can a labels  

Take snapshot with label `:before`

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
