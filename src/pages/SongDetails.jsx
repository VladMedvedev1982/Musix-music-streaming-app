import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DetailsHeader, Error, Loader, RelatedSongs } from "../components";
import { setActiveSong, playPause } from "../redux/features/playerSlice";
import {
  useGetSongsByGenreQuery,
  useGetSongDetailsQuery,
} from "../redux/services/fakeApiCore";
import { useEffect, useState } from "react";
// import {
//   useGetSongDetailsQuery,
//   useGetRelatedSongsQuery,
// } from "../redux/services/shazamCore";

const SongDetails = ({ setLink, link }) => {
  const dispatch = useDispatch();
  const [relatedSongs, setRelatedSongs] = useState();
  const { activeSong, isPlaying, genreListId } = useSelector(
    (state) => state.player
  );
  const { discover } = useSelector((state) => {
    return state.api.allData;
  });

  const { songid } = useParams();

  useEffect(() => {
    // setLink(!link);
    const start = Math.floor(Math.random() * 41);

    const end = start + 10;

    setRelatedSongs(discover[genreListId].slice(start, end));
  }, [songid]);

  const {
    data: song,
    isFetching: isFetchingSongDetails,
    error,
  } = useGetSongDetailsQuery(songid);

  const lirics = song[0]?.songData?.resources?.lyrics;

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song, i) => {
    dispatch(playPause(true));
    dispatch(setActiveSong({ song, i, discover }));
  };

  if (isFetchingSongDetails) {
    return <Loader title="Searching song details" />;
  }

  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      <DetailsHeader
        artistId=""
        songData={song[0]?.songDetails}
        setLink={setLink}
        link={link}
      ></DetailsHeader>
      <div className="mb-10 ">
        <h2 className="text-white text-3xl font-bold">Lyrics</h2>
        <div className="mt-5">
          {lirics ? (
            lirics.map((line, i) => (
              <p key={i} className="text-gray-400 text-base my-1">
                {line}
              </p>
            ))
          ) : (
            <p className="text-gray-400 text-base my-1">
              Sorry, no lyrics found !
            </p>
          )}
        </div>
      </div>
      <div>
        <RelatedSongs
          isPlaying={isPlaying}
          activeSong={activeSong}
          data={relatedSongs}
          handlePauseClick={handlePauseClick}
          handlePlayClick={handlePlayClick}
        ></RelatedSongs>
      </div>
    </div>
  );
};

export default SongDetails;
