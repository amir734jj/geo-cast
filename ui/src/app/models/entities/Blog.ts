import { User } from './User';

export default interface Blog {
  id: number
  title: string
  text: string
  owner: User
}
