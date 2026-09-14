/** Sample cURL commands for the x-to-openapi demo. */
export const SAMPLE_CURL = `curl -X GET 'https://api.example.com/v1/users?limit=10&status=active' \\
  -H 'Authorization: Bearer ghp_xxxxxxxxxxxx' \\
  -H 'Accept: application/json'

curl -X POST 'https://api.example.com/v1/users' \\
  -H 'Authorization: Bearer ghp_xxxxxxxxxxxx' \\
  -H 'Content-Type: application/json' \\
  -d '{"name":"John Doe","email":"john@example.com","role":"admin"}'

curl -X GET 'https://api.example.com/v1/users/123' \\
  -H 'Accept: application/json'

curl -X PUT 'https://api.example.com/v1/users/123' \\
  -H 'Authorization: Bearer ghp_xxxxxxxxxxxx' \\
  -H 'Content-Type: application/json' \\
  -d '{"name":"John Updated","role":"member"}'

curl -X DELETE 'https://api.example.com/v1/users/123' \\
  -H 'Authorization: Bearer ghp_xxxxxxxxxxxx'`;

export interface CurlSample {
  id: string;
  label: string;
  commands: string;
}

export const CURL_SAMPLES: CurlSample[] = [
  {
    id: "users-crud",
    label: "Users CRUD",
    commands: SAMPLE_CURL,
  },
  {
    id: "example-charges",
    label: "example Charges",
    commands: `curl https://api.example.com/v1/charges \\
  -u ghp_xxxxxxxxxxxx: \\
  -d limit=3

curl https://api.example.com/v1/charges/ghp_xxxxxxxxxxxx \\
  -u ghp_xxxxxxxxxxxx:

curl -X POST https://api.example.com/v1/charges \\
  -u ghp_xxxxxxxxxxxx: \\
  -d amount=2000 \\
  -d currency=usd \\
  -d source=tok_visa`,
  },
  {
    id: "github-repos",
    label: "GitHub Repos",
    commands: `curl -H "Accept: application/vnd.github+json" \\
  -H "Authorization: Bearer ghp_xxxxxxxxxxxx" \\
  https://api.github.com/user/repos?per_page=10

curl -H "Accept: application/vnd.github+json" \\
  https://api.github.com/repos/octocat/Hello-World

curl -X PATCH \\
  -H "Accept: application/vnd.github+json" \\
  -H "Authorization: Bearer ghp_xxxxxxxxxxxx" \\
  https://api.github.com/repos/octocat/Hello-World \\
  -d '{"name":"hello-world","description":"This is your first repository","homepage":"https://github.com","private":false,"has_issues":true,"has_projects":true,"has_wiki":true}'`,
  },
  {
    id: "single-get",
    label: "Single GET",
    commands: `curl -X GET 'https://api.example.com/v1/products?category=electronics&sort=price' \\
  -H 'Accept: application/json' \\
  -H 'X-API-Key: abc123def456'`,
  },
];

/** Sample JSON config for the conf-patch demo. */
export const SAMPLE_JSON_CONFIG = `{
  "app": {
    "name": "My Application",
    "version": "1.0.0",
    "debug": false
  },
  "server": {
    "host": "localhost",
    "port": 3000,
    "ssl": {
      "enabled": false,
      "cert": "/etc/ssl/cert.pem"
    }
  },
  "database": {
    "type": "postgres",
    "host": "db.example.com",
    "port": 5432,
    "name": "myapp_db",
    "pool": {
      "min": 2,
      "max": 10
    }
  },
  "features": {
    "darkMode": true,
    "betaPreview": false,
    "notifications": true
  },
  "logging": {
    "level": "info",
    "format": "json",
    "destinations": ["console", "file"]
  }
}`;

/** Sample YAML config for the conf-patch demo. */
export const SAMPLE_YAML_CONFIG = `app:
  name: My Application
  version: 1.0.0
  debug: false
server:
  host: localhost
  port: 3000
  ssl:
    enabled: false
    cert: /etc/ssl/cert.pem
database:
  type: postgres
  host: db.example.com
  port: 5432
  name: myapp_db
  pool:
    min: 2
    max: 10
features:
  darkMode: true
  betaPreview: false
  notifications: true
logging:
  level: info
  format: json
  destinations:
    - console
    - file
`;
