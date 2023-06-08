import { client } from "./"

/**
 * article API
 *
 * /articles
 */

type Summary = {
  id: string
  title: string
}

type Article = {
  author: string
  content: string
} & Summary

const search: (titleStartWith: string) => Promise<{
  articles: Summary[]
  limit: number
}> = async (titleStartWith) => {
  const { data, status: _ } = await client.get<{
    articles: Summary[]
    limit: number
  }>("articles", {
    params: {
      q: titleStartWith,
    },
  })

  //:TODO filter by server
  return data
}

const get: (id: string) => Promise<Article> = async (id) => {
  const { data, status: _ } = await client.get<Article>(`articles/${id}`, {})
  return data
}

export { search, get, type Article, type Summary }
