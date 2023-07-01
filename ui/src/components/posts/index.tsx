import {useEffect, useState} from 'react';
import Card from 'react-bootstrap/Card';
import {queryPosts} from '../../actions';
import {useLocationStore, useMapFocusStore, usePostsStore} from "../../stores";
import InfiniteScroll from 'react-infinite-scroller';
import {Button, ButtonGroup, Spinner} from 'react-bootstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPause, faPlay} from "@fortawesome/free-solid-svg-icons";
import {DateTime} from "luxon";
import _ from "lodash";
import LazyPlayer from "../lazyPlayer";
import {PlayerInfoPropType} from "../player";

const Posts = () => {
  const locationContext = useLocationStore();
  const mapFocusContext = useMapFocusStore();

  const count = 2;
  const [page, setPage] = useState(0);
  const {posts, appendPosts, clearPosts} = usePostsStore();
  const [more, setMore] = useState(true);
  const [error, setError] = useState(true);
  const [scrollRef, setScrollRef] = useState<any>(null);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const [currentAutoPlaying, setCurrentAutoPlaying] = useState<number>(-1);
  const [playerInfos, setPlayersInfo] = useState<(PlayerInfoPropType & { play: boolean })[]>([]);

  const nextPage = async (currentPage: number | null = null) => {
    currentPage = _.isNull(currentPage) ? page : currentPage;
    try {
      const {data} = await queryPosts(count, currentPage + 1, mapFocusContext.coordinate ?? locationContext.coordinate ?? {
        latitude: 0,
        longitude: 0
      });
      appendPosts(data);
      setPage(currentPage + 1);
      setMore(data.length === count);
      setError(false);
      setPlayersInfo([...playerInfos, ...data.map(() => ({} as any))]);
    } catch (e) {
      setError(true);
    }
  };

  useEffect(() => {
    nextPage();
  }, [locationContext.coordinate]);

  useEffect(() => {
    if (mapFocusContext.coordinate) {
      clearPosts();
      setPage(0);
      nextPage(0);
    }
  }, [mapFocusContext.coordinate]);

  const stopAutoPlay = () => {
    setAutoPlay(false);
    setCurrentAutoPlaying(-1);
  };

  const hardStopPlaying = () => {
    setPlayersInfo(infos => infos.map(info => ({...info, play: false})));
  };

  const startAutoPlay = () => {
    setCurrentAutoPlaying(0);
    setAutoPlay(true);
    playNextPost();
  };

  const playNextPost = () => {
    if (autoPlay && currentAutoPlaying! + 1 === posts.length) {
      stopAutoPlay();
    } else {
      setCurrentAutoPlaying(currentAutoPlaying! + 1);
      playerInfos[currentAutoPlaying! + 1].play = true;
    }
  };

  return (
    <>
      <ButtonGroup className="mb-2 mt-1">
        {autoPlay ?
          <Button variant="outline-danger" onClick={() => {
            stopAutoPlay();
            hardStopPlaying();
          }}> stop playlist </Button> :
          <Button variant="outline-success" disabled={!!(_.values(playerInfos).filter(x => x.play).length)} onClick={() => {
            startAutoPlay();
          }}> start playlist </Button>}
      </ButtonGroup>
      <div style={{height: '37rem', overflowY: 'auto'}} ref={(ref) => setScrollRef(ref)}>
        <InfiniteScroll
          pageStart={0}
          loadMore={() => nextPage()}
          hasMore={more && !error}
          loader={<Spinner key="spinner-post"/>}
          useWindow={false}
          getScrollParent={() => scrollRef}
        >
          {posts.map((post, i) => (
            <Card key={`post-${i}`} style={{marginBottom: '0.5rem'}}>
              <Card.Body style={{padding: '0.5rem 0.5rem'}}>
                <Card.Title as="p">{post.user.name}</Card.Title>
                <Card.Subtitle
                  className="mb-2 text-muted">
                  {post.duration}sec - {DateTime.fromISO(post.created_at).toLocaleString(DateTime.DATETIME_MED)}
                </Card.Subtitle>
                <LazyPlayer
                  mediaBlobUrl={`/api/board/download/${post.recordingId}`}
                  play={playerInfos[i] && playerInfos[i].play}
                  onchange={(info, event) => {
                    playerInfos[i] = {...playerInfos[i], ...info };
                    switch (event) {
                      case "pause":
                      case "finish":
                        playerInfos[i].play = false;
                        if (event === 'finish' && autoPlay) {
                          playNextPost();
                        }
                        break;
                      case "play":
                        playerInfos[i].play = true;
                        break;
                      default:
                        break;
                    }

                    setPlayersInfo(_.clone(playerInfos));
                  }}/>
                {playerInfos[i] && playerInfos[i].playing ? (
                  <Button variant="outline-secondary" title="pauseRecording" onClick={() => {
                    playerInfos[i] = {...playerInfos[i], play: false};
                    setPlayersInfo(_.clone(playerInfos));
                    stopAutoPlay();
                    hardStopPlaying();
                  }}>
                    <FontAwesomeIcon icon={faPause} beatFade/>
                  </Button>) : (<Button variant="outline-primary" title="play-recording" onClick={() => {
                    stopAutoPlay();
                    setPlayersInfo(playerInfos.map((info, index) => {
                      if (index === i) {
                        return {...info, play: true};
                      } else {
                        return {...info, play: false};
                      }
                    }));
                  }}>
                    <FontAwesomeIcon icon={faPlay}/>
                  </Button>
                )}
              </Card.Body>
            </Card>
          ))}
        </InfiniteScroll>
      </div>
    </>
  );
}

export default Posts;
