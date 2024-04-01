import { HttpStatusCode } from "axios"
import { client, downloadClient } from "."
/**
 * article API
 *
 * /articles
 */

type Summary = {
  s3_dir: string
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

const getBlogs: (limit?: number) => Promise<{ blogs: Summary[] }> = async (
  limit
) => {
  const url = "blogs" + (limit ? `?limit=${limit}` : "")
  const { data, status } = await client.get<{ blogs: Summary[] }>(url)
  //TODO: sort by create_at with time type
  data.blogs.sort((a, b) => (a.create_at > b.create_at ? -1 : 1))
  return data
}

//simple get markdown file from s3(cached by cloudfront)
const download: (dir: string) => Promise<string> = async (dir) => {
  const { data, status } = await downloadClient.get<string>(`${dir}/index.md`)
  if (status === HttpStatusCode.Ok) {
    return data
  } else {
    throw new Error("cannot find content")
  }
}

export { download, get, getCategories, getBlogs, search, type Summary }
