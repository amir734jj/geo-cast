import {useEffect, useState} from 'react';
import Card from 'react-bootstrap/Card';
import {queryPosts} from '../../actions';
import {useAuthStore, useLocationStore, useMapFocusStore, usePostsStore} from "../../stores";
import InfiniteScroll from 'react-infinite-scroller';
import {Button, ButtonGroup, ProgressBar, Spinner} from 'react-bootstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPause, faPlay} from "@fortawesome/free-solid-svg-icons";
import {DateTime} from "luxon";
import _ from "lodash";
import Player, {EventType, PlayerInfoPropType} from "../player";
import {LinkContainer} from "react-router-bootstrap";
import {EntityType} from '@geo-cast/lib/dto/account';

type PlayerInfoType = Record<number, PlayerInfoPropType & {
  play: boolean,
  page: number
} & EntityType>;

type BoardType = {
  page: number,
  more: boolean,
  error: boolean,
  autoPlay: boolean,
  currentAutoPlaying: number,
  playerInfos: PlayerInfoType,
}

const stopAutoPlay = (board: BoardType): BoardType => {
  return {
    ...board,
    autoPlay: false,
    currentAutoPlaying: -1
  }
};

const hardStopPlaying = (board: BoardType): BoardType => {
  return {
    ...board,
    playerInfos: _.reduce(_.values(board.playerInfos), (acc, x) => ({...acc, [x.id]: {...x, play: false}}), {})
  }
};

const startAutoPlay = (board: BoardType): BoardType => {
  return combine(
    x => ({...x, autoPlay: true}),
    playNextPost
  )(board);
};

const playNextPost = (board: BoardType): BoardType => {
  if (board.autoPlay && board.currentAutoPlaying + 1 === _.values(board.playerInfos).length) {
    return stopAutoPlay(board);
  } else {
    return {
      ...board,
      currentAutoPlaying: board.currentAutoPlaying + 1,
      playerInfos: _.reduce(_.values(board.playerInfos), (acc, x) => ({
        ...acc,
        [x.id]: {...x, play: _.orderBy(board.playerInfos, ["page"]).at(board.currentAutoPlaying + 1)!.id === x.id}
      }), {})
    }
  }
};

const getProgressPercentage = (info: PlayerInfoPropType) => Math.round(100 * info.currentTime / info.duration);

function combine<T>(...updater: ((board: T) => T)[]) {
  return (board: T): T => updater.reduce((acc, x) => x(acc), board);
}

const Posts = () => {
  const locationContext = useLocationStore();
  const mapFocusContext = useMapFocusStore();
  const authContext = useAuthStore();

  const count = 2;
  const {posts, appendPosts, clearPosts} = usePostsStore();

  const [scroll, setScrollRef] = useState<any>(null);
  const [board, setBoard] = useState<BoardType>({
    page: 0,
    more: true,
    error: false,
    autoPlay: false,
    currentAutoPlaying: -1,
    playerInfos: {}
  });

  const nextPage = async (page: number | null = null) => {
    try {
      const queryPage = page ?? board.page;
      const {data} = await queryPosts(count, queryPage + 1, mapFocusContext.coordinate ?? locationContext.coordinate ?? {
        latitude: 0,
        longitude: 0
      });
      appendPosts(data);
      setBoard(board => ({
        ...board,
        page: queryPage + 1,
        more: data.length === count,
        error: false,
        playerInfos: _.merge({}, board.playerInfos, _.reduce(data, (acc, x) => ({
          ...acc,
          [x.id]: {...x, page: queryPage + 1}
        }), {}))
      }))
    } catch (e) {
      setBoard(board => ({...board, error: true}));
    }
  };

  useEffect(() => {
    nextPage();
  }, [locationContext.coordinate]);

  useEffect(() => {
    if (mapFocusContext.coordinate) {
      clearPosts();
      nextPage(0);
    }
  }, [mapFocusContext.coordinate]);

  const mapEventToPlay = (event: EventType, prevPlay: boolean) => {
    switch (event) {
      case "pause":
      case "finish":
        return false;
      case "play":
        return true;
      default:
        return prevPlay;
    }
  };

  return (
    <>
      <ButtonGroup className="mb-2 mt-1">
        {posts.length ? (board.autoPlay ?
          <Button
            variant="outline-danger"
            onClick={() => {
              setBoard(
                combine(
                  stopAutoPlay,
                  hardStopPlaying));
            }}> stop playlist </Button> :
          <Button
            variant="outline-success"
            disabled={!!(_.find(_.values(board.playerInfos), {play: true}))}
            onClick={() => {
              setBoard(startAutoPlay);
            }}> start playlist </Button>) : null}
      </ButtonGroup>
      <div style={{height: '37rem', overflowY: 'auto'}} ref={(ref) => setScrollRef(ref)}>
        <InfiniteScroll
          pageStart={0}
          loadMore={() => nextPage()}
          hasMore={board.more && !board.error}
          loader={<Spinner key="spinner-post"/>}
          useWindow={false}
          getScrollParent={() => scroll}
        >
          {_.orderBy(posts, ["page"]).map((post) => (
            <Card key={`post-${post.id}`} style={{marginBottom: '0.5rem'}}>
              <Card.Body style={{padding: '0.5rem 0.5rem'}}>
                <Card.Title as="p">
                  {authContext.auth ?
                    <LinkContainer to={`/profile/${post.user.id}`}>
                      <a>{post.user.name}</a>
                    </LinkContainer> : post.user.name}
                </Card.Title>
                <Card.Subtitle
                  className="mb-2 text-muted">
                  {post.duration.toFixed(2)}sec
                  - {DateTime.fromISO(post.created_at).toLocaleString(DateTime.DATETIME_MED)}
                </Card.Subtitle>
                <Player
                  mediaBlobUrl={`/api/board/download/${post.recordingId}`}
                  play={board.playerInfos[post.id]?.play}
                  onchange={(playerInfo: Partial<PlayerInfoPropType>, event: EventType) => {
                    setBoard(
                      combine(
                        board => ({
                          ...board,
                          playerInfos: _.reduce(_.values(board.playerInfos), (acc, {play, ...info}) => {
                            if (info.id === post.id) {
                              return {
                                ...acc,
                                [info.id]: {
                                  ...info,
                                  ...playerInfo,
                                  play: mapEventToPlay(event, play)
                                },
                              };
                            } else {
                              return ({
                                ...acc,
                                [info.id]: {
                                  ...info,
                                  play
                                },
                              });
                            }
                          }, {})
                        }),
                        board => {
                          if (event === "finish" && board.autoPlay) {
                            return playNextPost(board);
                          } else {
                            return board
                          }
                        }
                      )
                    );
                  }}/>
                {board.playerInfos[post.id]?.playing
                  ? <Button variant="outline-secondary" title="pauseRecording" onClick={() => {
                    setBoard(
                      combine(
                        stopAutoPlay,
                        hardStopPlaying))
                  }}>
                    <FontAwesomeIcon icon={faPause} beatFade/>
                  </Button> : <Button variant="outline-primary" title="play-recording" onClick={() => {
                    setBoard(
                      combine(
                        stopAutoPlay,
                        x => ({
                          ...x,
                          playerInfos: _.reduce(_.values(x.playerInfos), (acc, y) => ({
                            ...acc,
                            [y.id]: {...y, play: y.id === post.id}
                          }), {})
                        })))
                  }}>
                    <FontAwesomeIcon icon={faPlay}/>
                  </Button>}
                {board.playerInfos[post.id]?.playing ?
                  <ProgressBar now={getProgressPercentage(board.playerInfos[post.id])} className="mt-2"
                               animated/> : null}
              </Card.Body>
            </Card>
          ))}
        </InfiniteScroll>
      </div>
    </>
  );
}

export default Posts;
