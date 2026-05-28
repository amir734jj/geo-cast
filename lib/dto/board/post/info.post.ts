import {EntityType} from "../../account";

export type PostInfoType = {
  duration: number;
  longitude: number;
  latitude: number;
  recordingId: string;
  createdAt: string;
  country?: string;
  user: {
    email: string;
    name: string;
  } & EntityType
} & EntityType;
