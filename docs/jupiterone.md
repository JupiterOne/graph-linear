# Linear

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
| `linear_issue`        | **CONTAINS**          | `linear_issue`        |
| `linear_organization` | **HAS**               | `linear_team`         |
| `linear_organization` | **HAS**               | `linear_user`         |
| `linear_project`      | **HAS**               | `linear_issue`        |
| `linear_project`      | **HAS**               | `linear_user`         |
| `linear_team`         | **HAS**               | `linear_issue`        |
| `linear_team`         | **HAS**               | `linear_project`      |
| `linear_team`         | **HAS**               | `linear_user`         |
| `linear_user`         | **ASSIGNED**          | `linear_issue`        |
| `linear_user`         | **CREATED**           | `linear_issue`        |

<!--
********************************************************************************
END OF GENERATED DOCUMENTATION AFTER BELOW MARKER
********************************************************************************
-->
<!-- {J1_DOCUMENTATION_MARKER_END} -->
