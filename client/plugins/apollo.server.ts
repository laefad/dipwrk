import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { DefaultApolloClient, provideApolloClient } from '@vue/apollo-composable'
import { setContext } from '@apollo/client/link/context'
import { getStates } from '@vue/apollo-ssr'
import { useLocalStorage } from '@vueuse/core'

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig()

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

  const apolloClient = new ApolloClient({ 
    ssrMode: true, 
    link: authLink.concat(httpLink), 
    cache 
  })

  nuxtApp.hook('app:rendered', () => {
    nuxtApp.payload.data.apollo = getStates({ apolloClient })
  })
  provideApolloClient(apolloClient)
  nuxtApp.provide('apollo', { DefaultApolloClient, apolloClient })
})
