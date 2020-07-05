export interface CommentDetails {
  commentHex: string
  commenterHex: string
  creationDate: string
  deleted: boolean
  direction: number
  html: string
  markdown: string
  parentHex: string
  score: number
  replies: { [key: string]: CommentDetails }
}

export interface UserDetails {
  commenterHex: string
  isModerator: boolean
  joinDate: string
  link: 'undefined'
  name: string
  photo: string
  provider: string
}
