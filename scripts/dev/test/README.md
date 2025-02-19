# test
Some automation scripts for tests

## commands
Run tests and generate timings report

```bash
./scripts/dev/test/automate.ts timings-test
```

Inspect the timings reports

```bash
./scripts/dev/test/automate.ts timings-report --min 300 --path "curric"
```

See help for details

```bash
./scripts/dev/test/automate.ts timings-report --help
# automate.ts timings-report
# 
# report on timings
# 
# Options:
#   --help     Show help                                                 [boolean]
#   --version  Show version number                                       [boolean]
#   --min      min number of ms                              [number] [default: 0]
#   --path     glob path                                                  [string]
```