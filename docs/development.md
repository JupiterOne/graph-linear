# Development

Any individual is able to create a free Linear account with an email address and
use the API for testing purposes. This project takes advantage of the Linear
[SDK](https://developers.linear.app/docs/sdk/getting-started) for fetching data.

## Provider account setup

1. Create a Linear account at https://linear.app/signup.
1. Confirm your registration using the emailed link.
1. You will be prompted to create a workspace.
1. Once the workspace is created, you will be able to create and update entities
   as needed for testing.

## Authentication

1. Once logged in, navigate to Settings --> My Account --> API.
1. Create an API key in one of two ways:
   1. Personal API key
   1. Create a new OAuth application --> Manage application --> Create developer
      token
1. Add the token to the `.env` file as the `ACCESS_TOKEN`.
