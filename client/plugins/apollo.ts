import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { DefaultApolloClient, provideApolloClient } from '@vue/apollo-composable'
import { setContext } from '@apollo/client/link/context'
import { useLocalStorage } from '@vueuse/core'

// TODO need to fix SSR 

// part taken from my old implementation 
// https://github.com/laefad/fedora-books-frontend/blob/master/src/plugins/apolloClient.ts
// 
// another part taken from comment 
// https://github.com/vuejs/apollo/issues/1277#issuecomment-1189391410
export default defineNuxtPlugin(nuxtApp => {

    // https://www.apollographql.com/docs/react/api/link/apollo-link-http
    const httpLink = createHttpLink({
      // doesnt work without function, idk why
      uri: () => process.env.GRAPHQL_SERVER ?? '', 
    })

    // get the authentication token from local storage if it exists
    const token = useLocalStorage<string>(AUTH_TOKEN, null)
    
    // https://www.apollographql.com/docs/react/api/link/apollo-link-context/
    const authLink = setContext((_, { headers }) => {
        // return the headers to the context so httpLink can read them
        return {
            headers: {
                ...headers,
                authorization: token.value ? `Bearer ${token.value}` : "",
            }
        }
    })

    const apolloClient = new ApolloClient({
        ssrMode: process.server,
        link: authLink.concat(httpLink),
        cache: new InMemoryCache()
    })

    if (process.server) {
      nuxtApp.hook('app:rendered', () => {
        nuxtApp.payload.data.apollo = apolloClient.extract()
      })
    }

    provideApolloClient(apolloClient)
    nuxtApp.provide('apollo', { DefaultApolloClient, apolloClient })
})
