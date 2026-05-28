import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {ExtendedProfileType} from "@geo-cast/lib/dto/account";
import { getUserPublicProfile } from "../../actions";
import _ from "lodash";

const PublicProfile = () => {
  const { userId } = useParams();

  const [profile, setProfile] = useState<ExtendedProfileType>();

  useEffect(() => {
    if (userId) {
      getUserPublicProfile(userId)
        .then(x => setProfile(x.data))
        .catch(() => setProfile(undefined));
    }
  }, [userId]);

  return (
    <>
      <h3>
        {profile?.name} { _.find(profile?.roles, { name: "admin"}) ? <span style={{ fontSize: "1.25rem"}}>(admin)</span> : null }
      </h3>
      <p>{profile?.description || "No profile description"}</p>
    </>
  );
}

export default PublicProfile;
