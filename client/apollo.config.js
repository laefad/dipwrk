// Copy of nuxt-apollo config for VSCode extension 'apollographql.vscode-apollo'
// https://www.apollographql.com/docs/devtools/apollo-config
module.exports = {
    client: {
        localSchemaFile: 'schema.gql',
        // Doesn't work without APOLLO_KEY in env
        service: 'dstream@dev',
        // Files processed by the extension
        includes: [ 
            'queries/**/*.gql',
        ],
        excludes: [
            'queries/generated/*.ts'
        ],
        httpLinkOptions: {
            credentials: 'include'
        }
    }
}
