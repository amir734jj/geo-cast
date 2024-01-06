import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {ExtendedProfileType} from "@geo-cast/lib/dto/account";
import { getUserPublicProfile } from "../../actions";

const PublicProfile = () => {
  const { userId } = useParams();

  const [profile, setProfile] = useState<ExtendedProfileType>();

  useEffect(() => {
    getUserPublicProfile(userId!)
      .then(x => setProfile(x.data));
  }, []);


  return (
    <>
      <h3>
        <a href={`mailto:${profile?.email}`}>{profile?.name}</a>
      </h3>
      <p>{profile?.description || "No profile description"}</p>
    </>
  );
}

export default PublicProfile;
