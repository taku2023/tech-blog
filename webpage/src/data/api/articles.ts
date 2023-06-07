import { client } from "./"

/**
 * article API
 *
 * /articles
 */

type Article = {
  title: string
}

const search: (titleStartWith: string) => Promise<{
  articles: Article[]
  limit: number
}> = async (titleStartWith) => {
  const { data, status: _ } = await client.get<{
    articles: Article[]
    limit: number
  }>("articles", {
    params: {
      q: titleStartWith,
    },
  })

  //:TODO filter by server
  console.log(data)

  return data
}

export { search }
