# 1 - Configuration

The following steps describe how to install and configure each microservice of the iSafetyStaff platform. The platform consists of multiple integrated micro-services, using an architecture focused on just one instance of each service, running on a single Linux machine. 

## 1.1 - Create New Strapi Secrets

Strap secrets generate tokens for authorization/authentication. It is important to change the tokens inserted in the env file to avoid using leaked secrets. The current .env is an proposital example (only to test), do not use in production environment.

```
# building the system for the first time
docker compose build

# running the all services in detached mode
docker compose up -d

# running script to 'create' random secrets
./scripts/generate_strapi_env.sh

# Copy generated values and paste in the .env file

# Reinstall all services using updated vars / env file
docker stop isafety-strapi
docker compose build strapi
docker compose up

# edit linux host file, appending a new line (localhost):
echo 127.0.0.1 isafety-staff | sudo tee -a /etc/hosts
```

## 1.2 - Create Strapi Account and API Tokens

The Strapi Admin Account is created during the system's first access. It manages all resources available inside the strap service, such as APIs, Databases, Access Authorization, etc. The Strapi Admin Account generates authorization tokens to permit integration with external services.

### 1.2.1 - Creating Strapi Account

Using an internet browser, go to
https://isafety-staff:2222/dev
and complete the registration process. This process is only available during the first access. After completing all the registration, it will be possible to sign in.

### 1.2.2 Creating Strapi Authorization Tokens

To permit data access for external services, tokens for each service must be created. Limiting each token's interaction type (read-only, edit-all, etc.) is possible. To integrate Strapi with Grafana and the Front-end service, it is necessary to generate new tokens and configure the following: 

Go to the settings -> Global Settings -> Api Tokens, and click to Create a new Entry. Is necessary to provide information to generate the token, for example:

```
Name:            Nuxt-API
Token Duration:  Unlimited
Token Type:      Full Access
```

The token value is only available during creation and must be recreated if lost. Tokens can be relocated by deleting them or changing the limitations of interaction between the straps (backend) and external services. Ideally, each service must have a unique token.
When all information is provided, copy the token value and click save to store the token generated;

Copy the token generated to the .env file, to include in an environment of specific services, as NUXT Frontend:
```
# permit the frontend to interact with strapi backend as a service;
NUXT_TOKEN_API=Bearer <token>
```

In some cases, it is necessary to rebuild and upgrade the services to ensure that the env variables are updated and available inside docker containers. In [1.1], it is described how to update all services simultaneously. To update only one service, it is possible to do the following steps:

```
# stop the service container
docker stop isafety-nuxt

# remove the service container (will be recreated)
docker rm isafety-nuxt

# building the expecific service
docker compose build nuxt

# up all services (only up services in stop state)
docker compose up -d
```

This is the same process to generate Grafana access tokens,
but instead of inserting the token inside the .env file, it
will be configured directly via the Grafana website.


## 1.3 - Grafana Configurations

First step: generate a token with READ ONLY permission for Grafana,
following the same steps described in [1.2.2].
Copy the token generated.

Using a browser, go to
https://isafety-staff:2222/dashboard and login using an admin account.
For the first sign-in, Grafana is configured to use  a default user and password:
```
User: admin
Pass: admin
```

### 1.3.1 Install GraphQL Pluggins

Grafana permits plugin installation and, in this case, must use the GraphQL plugin to facilitate the integration with Strapi Service (used as the backend). To install plugins in Grafana, go to administration -> Plugins and Data -> Plugins -> GraphQL Data Source, and click Install.

### 1.3.2 Integrating Grafana with Strapi GraphQL

Inside the Grafana Admin, 
Go to Connections -> Add new connection and select the GraphQL Data Source option -> Add new dataset.
Configuration:
```
Name:               strapi
Access:             Server
With Credentials:   True
Skip TLS Verify:    True
URL:                https://nginx:8080/dev/graphql
                     
Header:             Authorization
Value:              Bearer <Grafana Token>
```

### 1.3.4 - Importing Grafana Dashboard

To use a pre-created dashboard for Grafana, you can import the grafana/dashboard/dashboard.json directly via the Grafana webpage: access https://isafety-staff:2222/dashboard with an admin account. In Dashboard, select the "new" option and click import. Select "UPLOAD JSON FILE" and select the dashboard.json file.

The imported dashboard was configured to support the actual structure of strapi, with graphQL queries and general information (graphs).

### 1.4 - NGINX HTTPS Self Signed

In the folder nginx/certs has the certificates used for HTTPS Self Signed. Do not use the leaked certificate in production environment. Ideally, in production must avoid self signed solutions.

# 2 - Platform iSafetyStaff

The section below briefly describes the main concepts of the iSafetyStaff platform.

## 2.1 - Create a Survey (Strapi)

To create a complete survey, the iSafetyStaff needs different information:

* A Survey Name;
* At least one Section linked with the survey;
* At least one Link to keep the survey available;
* At least one Question to be answered;
* Answers are not required.

The following sections describe how to create each piece of information that composes the survey. All information is managed directly via Strapi (Content Manager).

### 2.1.1 - Survey

The survey collection in strapi permits the setting of a name when the survey is created. Only the name/title of the survey is required for this collection. All the other information will be attached to this information in the following steps.

### 2.1.2 - Section

The Section collection in strapi permits setting a name for a section and linking the section with a survey. The section differentiates the type of user interacting with the system, for example, client/employee, sales/developers/managers, etc. After starting the survey, the safety-staff platform will ask to choose a section first.

The Section is required for a survey. If the section is not defined, the platform will not show options to start the survey.

### 2.1.3 - Link

The collection "link" in strapi permits setting a name and a code to keep the survey accessible. It is possible to create multiple links for the same survey to share with different groups of users. For example, the same survey is shared with Store_A and Store_B using Link_A and Link_B. All answers are tracked with the link code to differentiate answers from each group.

The link code must be unique, and it is used to allow public access to the survey via https://isafety-staff:2222/quiz/\<LinkCode\>.

### 2.1.4 - Question

The collection question permits creating all the questions for a survey. For each question created, the respective survey must be associated with it.

### 2.1.5 - Answers

The collection Answer connects all information and includes the user's external grade. The answer contains information about the question, the survey link, the section selected, the numerical grade (satisfaction), the date and time, and the survey. This information is filled automatically during the interaction with Nuxt Frontend.

## 2.2 - Exploring Data (Grafana)

The analytical dashboard is provided inside the Grafana microservice. To simplify data visualization and continuous dashboard development, Grafana is configured to connect with the Strapi backend. Survey interactions, metrics, and temporal analysis are visualized via the Grafana dashboard, and Pemit creates/extends graph information.
