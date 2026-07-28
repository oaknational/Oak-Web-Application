# Sanity CLI
This runs scripts against the sanity configured in your env

If you're unfamiliar with GROQ see <https://www.sanity.io/docs/content-lake/query-cheat-sheet>

## Usage

```bash
./scripts/dev/sanity/cli.ts --help                                                                
# cli.ts <command>
# 
# Commands:
#   cli.ts query <dataset> <groq_file>  run a query against the Sanity dataset
#                                       with the current environment variables
# 
# Options:
#   --help     Show help                                                 [boolean]
#   --version  Show version number            
```


## Example
An example

```bash
./scripts/dev/sanity/cli.ts query production scripts/dev/sanity/scripts/videos-not-referenced.groq
```

A bunch of useful scripts in [`./scripts/dev/sanity/scripts/`](./scripts/dev/sanity/scripts/)
