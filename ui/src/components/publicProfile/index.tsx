import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {ExtendedProfileType} from "@geo-cast/lib/dto/account";
import { getUserPublicProfile } from "../../actions";
import { Spinner } from "../common";
import _ from "lodash";

const PublicProfile = () => {
  const { userId } = useParams();

  const [profile, setProfile] = useState<ExtendedProfileType>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      getUserPublicProfile(userId)
        .then(x => setProfile(x.data))
        .catch(() => setProfile(undefined))
        .finally(() => setLoading(false));
    }
  }, [userId]);

  if (loading) {
    return <Spinner />;
  }

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
