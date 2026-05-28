import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {ExtendedProfileType} from "@geo-cast/lib/dto/account";
import {getUserPublicProfile} from "../../actions";
import {getUserPosts, deletePost as deletePostAction} from "../../actions/board.action";
import {Spinner, useConfirmModal} from "../common";
import {isAdmin as checkAdmin} from '@geo-cast/lib/utils';
import {useAuthStore} from "../../stores";
import _ from "lodash";
import {Card, Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlay, faPause, faTrash, faStop, faForward} from "@fortawesome/free-solid-svg-icons";
import {DateTime} from "luxon";
import Player, {EventType, PlayerInfoPropType} from "../player";
import {PostInfoType} from "@geo-cast/lib/dto/board/post";
import {ButtonGroup} from "react-bootstrap";

type PostWithPlayer = PostInfoType & { id: number; play: boolean } & Partial<PlayerInfoPropType>;

const PublicProfile = () => {
  const { userId } = useParams();
  const authContext = useAuthStore();
  const currentUserId = authContext?.auth?.id;
  const isAdmin = checkAdmin(authContext?.auth?.roles);
  const {confirmAction, ConfirmModal} = useConfirmModal();

  const [profile, setProfile] = useState<ExtendedProfileType>();
  const [posts, setPosts] = useState<PostWithPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [currentAutoPlaying, setCurrentAutoPlaying] = useState(-1);

  const isAnyPlaying = posts.some(p => p.play);

  const stopAll = () => {
    setAutoPlay(false);
    setCurrentAutoPlaying(-1);
    setPosts(prev => prev.map(p => ({...p, play: false})));
  };

  const playNext = (index: number) => {
    if (index >= posts.length) {
      stopAll();
    } else {
      setCurrentAutoPlaying(index);
      setPosts(prev => prev.map((p, i) => ({...p, play: i === index})));
    }
  };

  const startAutoPlay = () => {
    setAutoPlay(true);
    playNext(0);
  };

  useEffect(() => {
    if (userId) {
      setLoading(true);
      Promise.all([
        getUserPublicProfile(userId).then(x => setProfile(x.data)).catch(() => setProfile(undefined)),
        getUserPosts(userId).then(x => setPosts(x.data.map(p => ({...p, play: false})))).catch(() => setPosts([]))
      ]).finally(() => setLoading(false));
    }
  }, [userId]);

  if (loading) {
    return <Spinner />;
  }

  const canDelete = isAdmin || (currentUserId != null && String(currentUserId) === userId);

  return (
    <>
      <h3>
        {profile?.name} { _.find(profile?.roles, { name: "admin"}) ? <span style={{ fontSize: "1.25rem"}}>(admin)</span> : null }
      </h3>
      <p>{profile?.description || "No profile description"}</p>

      <h5 className="mt-4">{posts.length ? `Recordings (${posts.length})` : 'No recordings yet'}</h5>
      {posts.length >= 3 ?
        <ButtonGroup className="mb-2">
          {autoPlay ?
            <Button
              variant="outline-danger"
              size="sm"
              onClick={stopAll}>
              <FontAwesomeIcon icon={faStop} className="me-1" />Stop Playlist
            </Button> :
            <Button
              variant="outline-success"
              size="sm"
              disabled={isAnyPlaying}
              onClick={startAutoPlay}>
              <FontAwesomeIcon icon={faForward} className="me-1" />Play All
            </Button>}
        </ButtonGroup> : null}
      {posts.map((post) => (
        <Card key={`profile-post-${post.id}`} className="mb-2">
          <Card.Body style={{padding: '0.75rem'}}>
            <Card.Subtitle className="mb-2 text-muted">
              {Number(post.duration).toFixed(2)}sec - {DateTime.fromISO(post.created_at.toString()).toLocaleString(DateTime.DATETIME_MED)}
              {post.country ? ` - ${post.country}` : ''}
            </Card.Subtitle>
            <Player
              mediaBlobUrl={`/api/board/download/${post.recordingId}`}
              play={post.play}
              showWaveform={true}
              onchange={(playerInfo: Partial<PlayerInfoPropType>, event: EventType) => {
                setPosts(prev => prev.map(p => p.id === post.id ? {
                  ...p,
                  ...playerInfo,
                  play: event === 'pause' || event === 'finish' ? false : event === 'play' ? true : p.play
                } : {...p, play: false}));
                if (event === 'finish' && autoPlay) {
                  playNext(currentAutoPlaying + 1);
                }
              }}/>
            {post.playing
              ? <Button variant="outline-secondary" size="sm" title="pause-recording" onClick={stopAll}>
                  <FontAwesomeIcon icon={faPause} beatFade/>
                </Button>
              : <Button variant="outline-primary" size="sm" title="play-recording" onClick={() => {
                  setAutoPlay(false);
                  setCurrentAutoPlaying(-1);
                  setPosts(prev => prev.map(p => ({...p, play: p.id === post.id})));
                }}>
                  <FontAwesomeIcon icon={faPlay}/>
                </Button>}
            {canDelete ?
              <Button variant="outline-danger" size="sm" className="ms-2" title="delete-recording"
                disabled={autoPlay || isAnyPlaying}
                onClick={async () => {
                  if (await confirmAction('This will permanently delete the recording.')) {
                    await deletePostAction(post.id);
                    setPosts(prev => prev.filter(p => p.id !== post.id));
                  }
                }}>
                <FontAwesomeIcon icon={faTrash}/>
              </Button> : null}
          </Card.Body>
        </Card>
      ))}
      <ConfirmModal />
    </>
  );
};

export default PublicProfile;
