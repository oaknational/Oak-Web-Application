# Infrastructure

This folder current manages the buckets responsible for holding uploaded lesson videos.

The terraform project is broken out into multiple workspaces

- production
- staging
- demo

Each workspace will have variables configured in TF cloud

```
project       = "oak-national-academy"
region        = "europe-west2"
retool_origin = "https://creator-staging.thenational.academy"
environment   = "staging"

```

## Local setup

The current doc on terraform management can be found here https://github.com/oaknational/Data-Tools/tree/development/infrastructure#terraform-cloud

### How to Set up repo
 This repo has a file named `backend.tf.template` which serves as a starting point for your configuration.
 - Duplicate/copy `backend.tf.template` file into a new file called `backend.tf`
 - In the cloud block, replace `your-organizaton-name` with your organisation name and replace tags with your preferred tags
 ```
 cloud {
    organization = "your-organizaton-name"
    workspaces {
      tags = ["repo:Oak-Web-Application", "config:web"]
    }
  }
```
