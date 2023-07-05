import { client, downloadClient } from "."

/**
 * article API
 *
 * /articles
 */

type Summary = {
  object_key: string
  title: string
  categories: string[]
  keywords: string[]
  create_at: string
  update_at: string
  viewer: number
}

const search: (params: { search?: string; category?: string }) => Promise<{
  blogs: Summary[]
}> = async (params) => {
  const { data, status: _ } = await client.get<{
    blogs: Summary[]
  }>("blogs", {
    params,
  })

  return data
}

const get: (key: string) => Promise<{ blog: Summary }> = async (key) => {
  const { data, status: _ } = await client.get<{ blog: Summary }>(
    `blogs/${key}`
  )
  return data
}

const getCategories: () => Promise<{ categories: string[] }> = async () => {
  const { data, status } = await client.get<{ categories: string[] }>(
    `categories`
  )
  return data
}

//simple get markdown file from s3(cached by cloudfront)
const download: (key: string, suffix?: string) => Promise<string> = async (
  key,
  suffix = ".md"
) => {
  const { data, status: _ } = await downloadClient.get<string>(key + suffix)
  return data
}

export { download, get, getCategories, search, type Summary }
