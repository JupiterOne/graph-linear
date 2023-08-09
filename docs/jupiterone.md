# Linear

## Integration Benefits

- Visualize your Linear organization, projects, teams, and users in the
  JupiterOne graph.
- Map Linear users to Person entities in your JupiterOne account.
- Monitor changes to Linear entities by leveraging JupiterOne alerts.

## How it Works

- JupiterOne periodically ingests projects, teams, and users from Linear to
  update the graph.
- Write JupiterOne queries to review and monitor updates to the graph, or
  leverage existing queries.
- Configure alerts to take action when JupiterOne graph changes, or leverage
  existing alerts.

## Prerequisites

- Linear supports the use of API keys to authenticate API requests. You need
  access to an account that has permissions to create a new API key.
- You must have permission in JupiterOne to install new integrations.

## Support

If you need help with this integration, contact
[JupiterOne Support](https://support.jupiterone.io/).

## How to Use This Integration

### In Linear

1. Generate an API key via the [settings page](https://linear.app/settings/api).
1. Copy the API key and save it for use within JupiterOne.

### In JupiterOne

<!-- TODO! -->

<!-- {J1_DOCUMENTATION_MARKER_START} -->
<!--
********************************************************************************
NOTE: ALL OF THE FOLLOWING DOCUMENTATION IS GENERATED USING THE
"j1-integration document" COMMAND. DO NOT EDIT BY HAND! PLEASE SEE THE DEVELOPER
DOCUMENTATION FOR USAGE INFORMATION:

https://github.com/JupiterOne/sdk/blob/main/docs/integrations/development.md
********************************************************************************
-->

## Data Model

### Entities

The following entities are created:

| Resources    | Entity `_type`        | Entity `_class`     |
| ------------ | --------------------- | ------------------- |
| Issue        | `linear_issue`        | `Record`, `Issue`   |
| Organization | `linear_organization` | `Account`           |
| Project      | `linear_project`      | `Project`           |
| Team         | `linear_team`         | `Team`, `UserGroup` |
| User         | `linear_user`         | `User`              |

### Relationships

The following relationships are created:

| Source Entity `_type` | Relationship `_class` | Target Entity `_type` |
| --------------------- | --------------------- | --------------------- |
| `linear_issue`        | **ASSIGNED**          | `linear_user`         |
| `linear_issue`        | **CONTAINS**          | `linear_issue`        |
| `linear_organization` | **HAS**               | `linear_team`         |
| `linear_project`      | **HAS**               | `linear_issue`        |
| `linear_project`      | **HAS**               | `linear_user`         |
| `linear_team`         | **HAS**               | `linear_issue`        |
| `linear_team`         | **HAS**               | `linear_project`      |
| `linear_team`         | **HAS**               | `linear_user`         |
| `linear_user`         | **CREATED**           | `linear_issue`        |

<!--
********************************************************************************
END OF GENERATED DOCUMENTATION AFTER BELOW MARKER
********************************************************************************
-->
<!-- {J1_DOCUMENTATION_MARKER_END} -->
