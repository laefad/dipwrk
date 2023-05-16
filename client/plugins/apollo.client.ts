import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { DefaultApolloClient, provideApolloClient } from '@vue/apollo-composable'
import { setContext } from '@apollo/client/link/context'
import { useLocalStorage } from '@vueuse/core'

export default defineNuxtPlugin(nuxtApp => {

  const httpLink = createHttpLink({
    uri: 'http://localhost:5000/graphql'
  })

  const authLink = setContext((_, { headers }) => {
      // return the headers to the context so httpLink can read them
      const token = localStorage.getItem(AUTH_TOKEN)
      return {
          headers: {
              ...headers,
              authorization: token ? `Bearer ${token}` : "",
          }
      }
  })

  const cache = new InMemoryCache()
  cache.restore(window.__NUXT__!.data.apollo.apolloClient)
  
  const apolloClient = new ApolloClient({ 
    link: authLink.concat(httpLink), 
    cache 
  })

  provideApolloClient(apolloClient)
  nuxtApp.provide('apollo', { DefaultApolloClient, apolloClient })
})
