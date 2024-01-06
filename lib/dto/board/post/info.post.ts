import {EntityType} from "../../account";

export type PostInfoType = {
  duration: number;
  longitude: number;
  latitude: number;
  recordingId: string;
  created_at: string;
  user: {
    email: string;
    name: string;
  } & EntityType
} & EntityType;
