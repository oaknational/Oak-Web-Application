# Fetching Secrets

Secret Oak app config can be in a local file (.env), or fetched from a network location.

## Local file

If a value for a secret is found in `.env` then this will override the value from the network location.

In order to *not* fetch secrets from the network location (and only read then from `.env`), add the following to your `.env` file:
```
USE_ONLY_LOCAL_SECRETS=true
```

## Network location

Currently we support fetching secrets from Google Secret Manager

### Google Secret Manager

In order to fetch secrets from Google Secret Manager, the [Oak Config file](../fetch_config/) must contain the following properties:
```json
{
  "googleSecretManager": {
    "projectId": "[your-project-id]"
  },
}
```
In this case, the script will look for the following environment variable:
```sh
GOOGLE_SECRET_MANAGER_SERVICE_ACCOUNT='{"type":"service_account","project_id":...'
```

This service account will need the following permissions in order to access the app's secrets:
```sh
resourcemanager.projects.get
resourcemanager.projects.list
secretmanager.versions.access
secretmanager.secrets.list
# TODO: fill out required permissions
```

