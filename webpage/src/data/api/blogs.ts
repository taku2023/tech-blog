import { client, downloadClient } from "."

/**
 * article API
 *
 * /articles
 */

type Summary = {
  id: string
  title: string
  categories: string[]
  keywords: string[]
}

type Blog = {
  author: string
  tags: string[]
  content: string
  createAt: string
  updateAt?: string
} & Summary

const search: (titleStartWith: string) => Promise<{
  blogs: Summary[]
}> = async (keyWordInclude) => {
  const { data, status: _ } = await client.get<{
    blogs: Summary[]
  }>("blogs", {
    params: {
      search: keyWordInclude,
    },
  })

  return data
}

const get: (id: string) => Promise<Summary> = async (id) => {
  const { data, status: _ } = await client.get<Summary>(`blogs/${id}`)
  return data
}

//simple get markdown file from s3(cached by cloudfront)
const download: (filename: string) => Promise<string> = async (filename) => {
  const { data, status: _ } = await downloadClient.get<string>(filename)
  return data
}

export { download, get, search, type Blog, type Summary }
